package com.bluebillywig.bbplayer

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.Choreographer
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import com.facebook.react.modules.core.ReactChoreographer
import androidx.collection.ArrayMap
import androidx.mediarouter.app.MediaRouteButton
import org.json.JSONObject
import com.bluebillywig.bbnativeplayersdk.BBNativePlayer
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerView
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerViewDelegate
import com.bluebillywig.bbnativeshared.enums.Phase
import com.bluebillywig.bbnativeshared.enums.State
import com.bluebillywig.bbnativeshared.model.MediaClip
import com.bluebillywig.bbnativeshared.model.Project
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

// Debug logging helper - only logs in debug builds
private inline fun debugLog(tag: String, message: () -> String) {
    if (BuildConfig.DEBUG) {
        Log.d(tag, message())
    }
}

/**
 * React Native View for Blue Billywig Native Player
 *
 * This view wraps the native BBNativePlayerView and handles the integration with
 * React Native's view system. The key challenge is that React Native uses Yoga for
 * layout, which can interfere with native Android views that have their own layout
 * and touch handling requirements (like ExoPlayer's StyledPlayerView with controlbar).
 *
 * ## Native Layout Integration
 *
 * To ensure the native player controls work correctly, this view:
 *
 * 1. **Overrides onLayout()** - Explicitly layouts child views to fill the container,
 *    which is necessary because React Native's Yoga layout doesn't automatically
 *    propagate layout to native child views.
 *
 * 2. **Overrides onInterceptTouchEvent()** - Returns false to ensure touch events
 *    always reach the child BBNativePlayerView, allowing the player's controlbar
 *    to respond to taps.
 *
 * ## Why This Is Necessary
 *
 * React Native's Yoga layout system is designed for flexbox-based UI, not for native
 * views with complex internal view hierarchies. The BBNativePlayerView contains an
 * ExoPlayer StyledPlayerView which has its own gesture detectors and controlbar that
 * need to receive touch events directly. Without these overrides, React Native's
 * touch handling system intercepts events before they reach the native player controls.
 */
class BBPlayerView(private val reactContext: ThemedReactContext) : FrameLayout(reactContext),
    BBNativePlayerViewDelegate {

    private val currentActivity: Activity
        get() = reactContext.currentActivity ?: throw IllegalStateException("No current activity")

    private var jsonUrl: String = ""
    private var options = ArrayMap<String, Any?>()
    private var playerSetup: Boolean = false

    private lateinit var playerView: BBNativePlayerView

    // Track if we should force landscape orientation on fullscreen
    private var shouldForceLandscape = false
    private var wasLandscapeFullscreen = false
    private var savedOrientation: Int? = null

    // ==================================================================================
    // NATIVE LAYOUT INTEGRATION
    // ViewGroupManager.needsCustomLayoutForChildren() = true tells React Native
    // that this view handles its own child layout, allowing ExoPlayer's controlbar
    // to work correctly.
    //
    // This uses the ReactChoreographer pattern from react-native-screens:
    // https://github.com/software-mansion/react-native-screens
    // See also: https://github.com/facebook/react-native/issues/17968
    // ==================================================================================

    private var isLayoutEnqueued = false
    // Flag to prevent requestLayout during super constructor
    private var constructorComplete = false

    private val layoutCallback = Choreographer.FrameCallback {
        isLayoutEnqueued = false
        measure(
            MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
            MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
        )
        layout(left, top, right, bottom)
    }

    init {
        // Default to black background (playout data may override with bgColor)
        setBackgroundColor(android.graphics.Color.BLACK)
        // Remove any padding
        setPadding(0, 0, 0, 0)
        // Allow children to render slightly outside bounds (helps with margin artifacts)
        clipToPadding = false
        clipChildren = false
        // Mark constructor complete - enables requestLayout Choreographer callback
        constructorComplete = true
    }

    /**
     * Override requestLayout to ensure layout propagates to children using ReactChoreographer.
     *
     * This is the proper React Native pattern for native views that need layout updates.
     * Using NATIVE_ANIMATED_MODULE queue catches the current looper loop instead of
     * enqueueing the update in the next loop, preventing one-frame delays.
     *
     * Combined with ViewGroupManager.needsCustomLayoutForChildren() = true, this ensures
     * the native player view and controlbar layout correctly without margin artifacts.
     */
    override fun requestLayout() {
        super.requestLayout()
        // Guard against calls during super constructor (before properties are initialized)
        if (!constructorComplete) return
        if (!isLayoutEnqueued) {
            isLayoutEnqueued = true
            ReactChoreographer.getInstance()
                .postFrameCallback(
                    ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE,
                    layoutCallback
                )
        }
    }

    /**
     * Override onLayout to explicitly position child views to fill the container.
     *
     * React Native's Yoga layout calculates positions but doesn't automatically apply
     * them to native child views.
     */
    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        // Layout all children to fill the entire container
        val w = right - left
        val h = bottom - top
        for (i in 0 until childCount) {
            getChildAt(i)?.layout(0, 0, w, h)
        }
    }

    /**
     * Never intercept touch events - let them pass through to child views.
     *
     * This is CRITICAL for the player controlbar to work. React Native's gesture
     * handling system can intercept touch events before they reach native views.
     * By always returning false, we ensure:
     *
     * 1. Single taps reach the PlayerView to toggle the controlbar
     * 2. Double taps reach the PlayerView for seek functionality
     * 3. Swipes and other gestures work for any interactive elements
     *
     * The BBNativePlayerView handles its own touch events internally through
     * ExoPlayer's StyledPlayerView and custom gesture detectors.
     */
    override fun onInterceptTouchEvent(ev: MotionEvent?): Boolean {
        return false
    }

    // ==================================================================================
    // END NATIVE LAYOUT INTEGRATION
    // ==================================================================================

    private var isPlaying = false
    private var currentDuration: Double = 0.0

    // Event emission helper using modern EventDispatcher
    private fun sendEvent(eventName: String, params: WritableMap?) {
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        eventDispatcher?.dispatchEvent(BBPlayerEvent(surfaceId, id, eventName, params))
    }

    private fun sendEvent(eventName: String) {
        sendEvent(eventName, null)
    }

    /**
     * Custom event class for BBPlayer events.
     * Uses the modern Event API instead of deprecated RCTEventEmitter.
     */
    private class BBPlayerEvent(
        surfaceId: Int,
        viewTag: Int,
        private val name: String,
        private val data: WritableMap?
    ) : Event<BBPlayerEvent>(surfaceId, viewTag) {

        override fun getEventName(): String = name

        override fun getEventData(): WritableMap = data ?: Arguments.createMap()
    }

    fun setJsonUrl(url: String) {
        Log.d("BBPlayerView", "setJsonUrl: $url (current: $jsonUrl)")
        this.jsonUrl = url
    }

    fun setAutoPlay(autoPlay: Boolean) {
        debugLog("BBPlayerView") { "setAutoPlay: $autoPlay" }
        this.options["autoPlay"] = autoPlay
    }

    fun setOptions(optionsMap: ReadableMap?) {
        optionsMap?.let { map ->
            val iterator = map.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                when (map.getType(key)) {
                    com.facebook.react.bridge.ReadableType.Boolean -> options[key] = map.getBoolean(key)
                    com.facebook.react.bridge.ReadableType.Number -> options[key] = map.getDouble(key)
                    com.facebook.react.bridge.ReadableType.String -> options[key] = map.getString(key)
                    else -> {}
                }
            }
        }
    }

    fun setupPlayer() {
        Log.d("BBPlayerView", "setupPlayer called - jsonUrl: $jsonUrl, playerSetup: $playerSetup")

        if (jsonUrl.isEmpty()) {
            Log.w("BBPlayerView", "Cannot setup player - jsonUrl is empty")
            return
        }

        if (!playerSetup) {
            // Initial setup - create the player view with the initial URL
            Log.d("BBPlayerView", "Initial setup - creating player")
            createAndAddPlayer()
        }
        // Note: We don't auto-load on URL prop changes anymore.
        // Content loading is handled explicitly via loadWithJsonUrl() from JavaScript,
        // similar to how the native SDK demo app works.
    }

    private fun createAndAddPlayer() {
        debugLog("BBPlayerView") { "Creating BBNativePlayerView with factory method" }
        playerView = BBNativePlayer.createPlayerView(currentActivity, jsonUrl, options)
        playerView.delegate = this@BBPlayerView
        // Remove any padding from playerView
        playerView.setPadding(0, 0, 0, 0)

        addView(playerView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))

        // RESIZE_MODE_FILL prevents SurfaceView bleed-through at container edges
        // when embedding inline above a WebView. The container aspect ratio is
        // adapted dynamically via onDidTriggerMediaClipLoaded to avoid stretching.
        postDelayed({
            setExoPlayerResizeMode(playerView)
        }, 500)

        playerSetup = true
        debugLog("BBPlayerView") { "Player setup complete with URL: $jsonUrl" }
    }

    /**
     * Set ExoPlayer's resize mode to FILL via reflection.
     * FILL prevents SurfaceView bleed-through artifacts at container edges.
     */
    private fun setExoPlayerResizeMode(view: View): Boolean {
        try {
            val playerViewClass = Class.forName("androidx.media3.ui.PlayerView")
            if (playerViewClass.isInstance(view)) {
                val method = playerViewClass.getMethod("setResizeMode", Int::class.javaPrimitiveType)
                method.invoke(view, 3) // RESIZE_MODE_FILL = 3
                return true
            }
        } catch (_: Exception) {}

        if (view is ViewGroup) {
            for (i in 0 until view.childCount) {
                if (setExoPlayerResizeMode(view.getChildAt(i))) return true
            }
        }
        return false
    }

    /**
     * Load content from a JSON URL into the existing player.
     * Extracts IDs from the URL and uses the native SDK's loadWithXxxId methods.
     * This is more reliable than parsing JSON because the SDK handles all the loading internally.
     *
     * Note: Shorts URLs (/sh/{id}.json) are NOT supported here - use BBShortsView instead.
     */
    fun loadWithJsonUrl(url: String, autoPlay: Boolean = true, contextJson: String? = null) {
        if (!::playerView.isInitialized) {
            Log.w("BBPlayerView", "Cannot load content - playerView not initialized")
            return
        }

        Log.d("BBPlayerView", "loadWithJsonUrl called with URL: $url, context: $contextJson")

        // Extract ID from URL patterns like:
        // /c/{id}.json or /mediaclip/{id}.json -> clip ID
        // /l/{id}.json or /mediacliplist/{id}.json -> clip list ID
        // /pj/{id}.json or /project/{id}.json -> project ID

        val clipIdRegex = Regex("/c/([0-9]+)\\.json|/mediaclip/([0-9]+)")
        val clipListIdRegex = Regex("/l/([0-9]+)\\.json|/mediacliplist/([0-9]+)")
        val projectIdRegex = Regex("/pj/([0-9]+)\\.json|/project/([0-9]+)")
        val shortsIdRegex = Regex("/sh/([0-9]+)\\.json")

        val context = parseContext(contextJson)

        when {
            shortsIdRegex.containsMatchIn(url) -> {
                // Shorts require a separate BBShortsView component
                Log.e("BBPlayerView", "Shorts URLs are not supported in BBPlayerView. Use BBShortsView instead.")
                sendEvent("onDidFailWithError", Arguments.createMap().apply {
                    putString("error", "Shorts URLs are not supported in BBPlayerView. Use BBShortsView instead.")
                })
            }
            clipListIdRegex.containsMatchIn(url) -> {
                val match = clipListIdRegex.find(url)
                val clipListId = match?.groupValues?.drop(1)?.firstOrNull { it.isNotEmpty() }
                if (clipListId != null) {
                    Log.d("BBPlayerView", "Loading ClipList by ID: $clipListId")
                    playerView.player?.loadWithClipListId(clipListId, "external", autoPlay, null, context)
                } else {
                    Log.e("BBPlayerView", "Failed to extract cliplist ID from URL: $url")
                }
            }
            projectIdRegex.containsMatchIn(url) -> {
                val match = projectIdRegex.find(url)
                val projectId = match?.groupValues?.drop(1)?.firstOrNull { it.isNotEmpty() }
                if (projectId != null) {
                    Log.d("BBPlayerView", "Loading Project by ID: $projectId")
                    playerView.player?.loadWithProjectId(projectId, "external", autoPlay, null, context)
                } else {
                    Log.e("BBPlayerView", "Failed to extract project ID from URL: $url")
                }
            }
            clipIdRegex.containsMatchIn(url) -> {
                val match = clipIdRegex.find(url)
                val clipId = match?.groupValues?.drop(1)?.firstOrNull { it.isNotEmpty() }
                if (clipId != null) {
                    Log.d("BBPlayerView", "Loading Clip by ID: $clipId")
                    playerView.player?.loadWithClipId(clipId, "external", autoPlay, null, context)
                } else {
                    Log.e("BBPlayerView", "Failed to extract clip ID from URL: $url")
                }
            }
            else -> {
                Log.e("BBPlayerView", "Unknown URL format, cannot extract ID: $url")
                sendEvent("onDidFailWithError", Arguments.createMap().apply {
                    putString("error", "Cannot load content: unsupported URL format")
                })
            }
        }
    }

    private fun removePlayer() {
        debugLog("BBPlayerView") { "removePlayer called" }
        playerSetup = false
        isPlaying = false
        removeAllViews()

        if (::playerView.isInitialized) {
            playerView.player?.pause()
            playerView.destroy()
        }
    }

    // Public methods for playback control
    fun play() {
        if (::playerView.isInitialized) {
            playerView.player?.play()
        }
    }

    fun pause() {
        if (::playerView.isInitialized) {
            playerView.player?.pause()
        }
    }

    fun seek(offsetInSeconds: Double) {
        if (::playerView.isInitialized) {
            playerView.player?.seek(offsetInSeconds)
        }
    }

    fun seekRelative(offsetInSeconds: Double) {
        // seekRelative not yet available in native SDK
        android.util.Log.w("BBPlayerView", "seekRelative not supported by native SDK")
    }

    fun setVolume(volume: Double) {
        if (::playerView.isInitialized) {
            playerView.setApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.volume, volume)
        }
    }

    fun setMuted(muted: Boolean) {
        if (::playerView.isInitialized) {
            playerView.setApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.muted, muted)
        }
    }

    fun autoPlayNextCancel() {
        if (::playerView.isInitialized) {
            playerView.player?.autoPlayNextCancel()
        }
    }

    fun collapse() {
        if (::playerView.isInitialized) {
            playerView.player?.collapse()
        }
    }

    fun expand() {
        if (::playerView.isInitialized) {
            playerView.player?.expand()
        }
    }

    fun presentModal() {
        // Use in-place fullscreen with landscape; modalPlayer option hides fullscreen button
        enterFullscreenLandscape()
    }

    fun closeModal() {
        exitFullscreen()
    }

    fun enterFullscreen() {
        if (::playerView.isInitialized) {
            shouldForceLandscape = false
            playerView.player?.enterFullScreen()
        }
    }

    fun enterFullscreenLandscape() {
        if (::playerView.isInitialized) {
            shouldForceLandscape = true
            playerView.player?.enterFullScreen()
        }
    }

    fun exitFullscreen() {
        if (::playerView.isInitialized) {
            playerView.player?.exitFullScreen()
        }
    }

    fun showCastPicker() {
        if (::playerView.isInitialized) {
            try {
                val castButton = findCastButton(playerView)
                if (castButton != null) {
                    debugLog("BBPlayerView") { "Found cast button, triggering click" }
                    castButton.performClick()
                } else {
                    Log.w("BBPlayerView", "Cast button not found in view hierarchy")
                }
            } catch (e: Exception) {
                Log.e("BBPlayerView", "Error showing cast picker: ${e.message}")
            }
        }
    }

    private fun findCastButton(view: android.view.View): MediaRouteButton? {
        val castButtonId = view.resources.getIdentifier("exo_cast_button", "id", view.context.packageName)
        if (castButtonId != 0) {
            val button = view.findViewById<MediaRouteButton>(castButtonId)
            if (button != null) {
                return button
            }
        }

        if (view is android.view.ViewGroup) {
            for (i in 0 until view.childCount) {
                val child = view.getChildAt(i)
                if (child is MediaRouteButton) {
                    return child
                }
                val result = findCastButton(child)
                if (result != null) {
                    return result
                }
            }
        }

        return null
    }

    fun presentModal() {
        Log.d("BBPlayerView", "presentModal() called")
        if (::playerView.isInitialized) {
            playerView.player?.enterFullScreen()
        }
    }

    fun closeModal() {
        Log.d("BBPlayerView", "closeModal() called")
        if (::playerView.isInitialized) {
            playerView.player?.exitFullScreen()
        }
    }

    fun destroy() {
        Log.d("BBPlayerView", "destroy() called")
        if (::playerView.isInitialized) {
            removePlayer()
        }
    }

    // Getter methods
    fun getPhase(): Phase? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.phase) as? Phase
        } else null
    }

    fun getState(): State? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.state) as? State
        } else null
    }

    fun getMode(): String? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.mode) as? String
        } else null
    }

    fun getPlayoutData(): com.bluebillywig.bbnativeshared.model.Playout? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.playoutData) as? com.bluebillywig.bbnativeshared.model.Playout
        } else null
    }

    fun getProjectData(): Project? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.projectData) as? Project
        } else null
    }

    fun getClipData(): MediaClip? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.clipData) as? MediaClip
        } else null
    }

    fun getDuration(): Double? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.duration) as? Double
        } else null
    }

    fun getVolume(): Double? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.volume) as? Double
        } else null
    }

    fun getMuted(): Boolean? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.muted) as? Boolean
        } else null
    }

    fun getInView(): Boolean? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.inView) as? Boolean
        } else null
    }

    fun getControls(): Boolean? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.controls) as? Boolean
        } else null
    }

    fun getAdMediaWidth(): Double? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.adMediaWidth) as? Double
        } else null
    }

    fun getAdMediaHeight(): Double? {
        return if (::playerView.isInitialized) {
            playerView.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.adMediaHeight) as? Double
        } else null
    }

    fun getAdMediaClip(): MediaClip? {
        return null
    }

    // Helper to parse context JSON into a Map for the native SDK
    private fun parseContext(contextJson: String?): Map<String, Any?>? {
        if (contextJson.isNullOrBlank()) return null
        return try {
            val json = JSONObject(contextJson)
            mapOf(
                "contextEntityType" to json.optString("contextEntityType", null),
                "contextEntityId" to json.optString("contextEntityId", null),
                "contextCollectionType" to json.optString("contextCollectionType", null),
                "contextCollectionId" to json.optString("contextCollectionId", null)
            ).filterValues { it != null }
        } catch (e: Exception) {
            Log.w("BBPlayerView", "Failed to parse context JSON: $contextJson", e)
            null
        }
    }

    // Load methods
    fun loadWithClipId(clipId: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null, contextJson: String? = null) {
        if (::playerView.isInitialized) {
            val context = parseContext(contextJson)
            playerView.player?.loadWithClipId(clipId, initiator, autoPlay, seekTo, context)
        }
    }

    fun loadWithClipListId(clipListId: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null, contextJson: String? = null) {
        if (::playerView.isInitialized) {
            val context = parseContext(contextJson)
            playerView.player?.loadWithClipListId(clipListId, initiator, autoPlay, seekTo, context)
        }
    }

    fun loadWithProjectId(projectId: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null, contextJson: String? = null) {
        if (::playerView.isInitialized) {
            val context = parseContext(contextJson)
            playerView.player?.loadWithProjectId(projectId, initiator, autoPlay, seekTo, context)
        }
    }

    fun loadWithClipJson(clipJson: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null, contextJson: String? = null) {
        if (::playerView.isInitialized) {
            val context = parseContext(contextJson)
            playerView.player?.loadWithClipJson(clipJson, initiator, autoPlay, seekTo, context)
        }
    }

    fun loadWithClipListJson(clipListJson: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null, contextJson: String? = null) {
        if (::playerView.isInitialized) {
            val context = parseContext(contextJson)
            playerView.player?.loadWithClipListJson(clipListJson, initiator, autoPlay, seekTo, context)
        }
    }

    fun loadWithProjectJson(projectJson: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null, contextJson: String? = null) {
        if (::playerView.isInitialized) {
            val context = parseContext(contextJson)
            playerView.player?.loadWithProjectJson(projectJson, initiator, autoPlay, seekTo, context)
        }
    }

    // BBNativePlayerViewDelegate implementations
    override fun didSetupWithJsonUrl(view: BBNativePlayerView, url: String?) {
        debugLog("BBPlayerView") { "didSetupWithJsonUrl: $url" }

        val playoutData = view.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.playoutData)
        debugLog("BBPlayerView") { "Playout data: $playoutData" }

        val params = Arguments.createMap().apply {
            putString("payload", url)
        }
        sendEvent("onDidSetupWithJsonUrl", params)
    }

    override fun didTriggerMediaClipLoaded(view: BBNativePlayerView, clipData: MediaClip?) {
        debugLog("BBPlayerView") { "didTriggerMediaClipLoaded: ${clipData?.title} (${clipData?.width}x${clipData?.height})" }
        val params = Arguments.createMap().apply {
            putString("title", clipData?.title)
            putString("id", clipData?.id)
            clipData?.width?.let { putDouble("width", it.toDouble()) }
            clipData?.height?.let { putDouble("height", it.toDouble()) }
        }
        sendEvent("onDidTriggerMediaClipLoaded", params)
    }

    override fun didTriggerProjectLoaded(view: BBNativePlayerView, projectData: Project?) {
        debugLog("BBPlayerView") { "didTriggerProjectLoaded: ${projectData?.id}" }
        val params = Arguments.createMap().apply {
            putString("id", projectData?.id)
        }
        sendEvent("onDidTriggerProjectLoaded", params)
    }

    override fun didTriggerPhaseChange(view: BBNativePlayerView, phase: Phase?) {
        debugLog("BBPlayerView") { "didTriggerPhaseChange: ${phase?.name}" }
        val params = Arguments.createMap().apply {
            putString("phase", phase?.name)
        }
        sendEvent("onDidTriggerPhaseChange", params)
    }

    override fun didTriggerStateChange(view: BBNativePlayerView, state: State?) {
        debugLog("BBPlayerView") { "didTriggerStateChange: ${state?.name}" }
        val params = Arguments.createMap().apply {
            putString("state", state?.name)
        }
        sendEvent("onDidTriggerStateChange", params)
    }

    override fun didFailWithError(view: BBNativePlayerView, error: String?) {
        Log.e("BBPlayerView", "didFailWithError: $error")

        val errorMessage = when {
            error?.contains("Domain", ignoreCase = true) == true ->
                "Content is not available in this location or domain"
            error?.contains("Geo", ignoreCase = true) == true ->
                "Content is not available in your region"
            error != null && error.isNotBlank() -> error
            else -> "Unknown error occurred"
        }

        val params = Arguments.createMap().apply {
            putString("payload", errorMessage)
        }
        sendEvent("onDidFailWithError", params)
    }

    override fun didTriggerMediaClipFailed(view: BBNativePlayerView) {
        Log.e("BBPlayerView", "didTriggerMediaClipFailed")
        sendEvent("onDidTriggerMediaClipFailed")
    }

    override fun didRequestOpenUrl(view: BBNativePlayerView, url: String?) {
        debugLog("BBPlayerView") { "didRequestOpenUrl: $url" }
        val params = Arguments.createMap().apply {
            putString("payload", url)
        }
        sendEvent("onDidRequestOpenUrl", params)
    }

    override fun didTriggerCanPlay(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerCanPlay - autoPlay: ${options["autoPlay"]}" }

        sendEvent("onDidTriggerCanPlay")

        val autoPlay = options["autoPlay"] as? Boolean ?: false
        if (autoPlay) {
            debugLog("BBPlayerView") { "Calling play() for autoplay" }
            view.player?.play()
        } else {
            debugLog("BBPlayerView") { "AutoPlay is false, not calling play()" }
        }
    }

    override fun didTriggerPlay(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerPlay" }
        sendEvent("onDidTriggerPlay")
    }

    override fun didTriggerPlaying(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerPlaying" }
        isPlaying = true
        sendEvent("onDidTriggerPlaying")
    }

    override fun didTriggerPause(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerPause" }
        isPlaying = false
        sendEvent("onDidTriggerPause")
    }

    override fun didTriggerEnded(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerEnded" }
        isPlaying = false
        sendEvent("onDidTriggerEnded")
    }

    override fun didTriggerSeeking(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerSeeking" }
        sendEvent("onDidTriggerSeeking")
    }

    override fun didTriggerSeeked(view: BBNativePlayerView, seekOffset: Double?) {
        debugLog("BBPlayerView") { "didTriggerSeeked: $seekOffset" }
        val params = Arguments.createMap().apply {
            putDouble("payload", seekOffset ?: 0.0)
        }
        sendEvent("onDidTriggerSeeked", params)
    }

    override fun didTriggerDurationChange(view: BBNativePlayerView, duration: Double?) {
        debugLog("BBPlayerView") { "didTriggerDurationChange: $duration" }
        currentDuration = duration ?: 0.0
        val params = Arguments.createMap().apply {
            putDouble("duration", currentDuration)
        }
        sendEvent("onDidTriggerDurationChange", params)
    }

    override fun didTriggerVolumeChange(view: BBNativePlayerView, volume: Double?) {
        debugLog("BBPlayerView") { "didTriggerVolumeChange: $volume" }
        val muted = (volume ?: 0.0) == 0.0
        val params = Arguments.createMap().apply {
            putDouble("volume", volume ?: 0.0)
            putBoolean("muted", muted)
        }
        sendEvent("onDidTriggerVolumeChange", params)
    }

    override fun didTriggerStall(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerStall" }
        sendEvent("onDidTriggerStall")
    }

    override fun didTriggerModeChange(view: BBNativePlayerView, mode: String?) {
        debugLog("BBPlayerView") { "didTriggerModeChange: $mode" }
        val params = Arguments.createMap().apply {
            putString("mode", mode)
        }
        sendEvent("onDidTriggerModeChange", params)
    }

    override fun didTriggerAutoPause(view: BBNativePlayerView, why: String?) {
        debugLog("BBPlayerView") { "didTriggerAutoPause: $why" }
        val params = Arguments.createMap().apply {
            putString("why", why)
        }
        sendEvent("onDidTriggerAutoPause", params)
    }

    override fun didTriggerAutoPausePlay(view: BBNativePlayerView, why: String?) {
        debugLog("BBPlayerView") { "didTriggerAutoPausePlay: $why" }
        val params = Arguments.createMap().apply {
            putString("why", why)
        }
        sendEvent("onDidTriggerAutoPausePlay", params)
    }

    override fun didTriggerFullscreen(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerFullscreen" }

        if (shouldForceLandscape) {
            try {
                savedOrientation = currentActivity.requestedOrientation
                debugLog("BBPlayerView") { "Saved current orientation: $savedOrientation" }
            } catch (e: Exception) {
                Log.w("BBPlayerView", "Failed to save orientation: ${e.message}")
            }

            Handler(Looper.getMainLooper()).postDelayed({
                try {
                    currentActivity.requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                    debugLog("BBPlayerView") { "Set orientation to LANDSCAPE after fullscreen entered" }
                } catch (e: Exception) {
                    Log.w("BBPlayerView", "Failed to set landscape orientation: ${e.message}")
                }
            }, 100)
            wasLandscapeFullscreen = true
            shouldForceLandscape = false
        }

        sendEvent("onDidTriggerFullscreen")
    }

    override fun didTriggerRetractFullscreen(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerRetractFullscreen" }

        if (wasLandscapeFullscreen) {
            try {
                val orientationToRestore = savedOrientation ?: android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
                currentActivity.requestedOrientation = orientationToRestore
                debugLog("BBPlayerView") { "Restored orientation to $orientationToRestore after fullscreen exited" }
                savedOrientation = null
            } catch (e: Exception) {
                Log.w("BBPlayerView", "Failed to reset orientation: ${e.message}")
            }
            wasLandscapeFullscreen = false
        }

        sendEvent("onDidTriggerRetractFullscreen")
    }

    override fun didRequestCollapse(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didRequestCollapse" }
        sendEvent("onDidRequestCollapse")
    }

    override fun didRequestExpand(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didRequestExpand" }
        sendEvent("onDidRequestExpand")
    }

    override fun didTriggerCustomStatistics(view: BBNativePlayerView, ident: String, ev: String, aux: Map<String, String>) {
        debugLog("BBPlayerView") { "didTriggerCustomStatistics: ident=$ident, ev=$ev" }
        val auxMap = Arguments.createMap()
        aux.forEach { (key, value) -> auxMap.putString(key, value) }

        val params = Arguments.createMap().apply {
            putString("ident", ident)
            putString("ev", ev)
            putMap("aux", auxMap)
        }
        sendEvent("onDidTriggerCustomStatistics", params)
    }

    override fun didTriggerViewStarted(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerViewStarted" }
        sendEvent("onDidTriggerViewStarted")
    }

    override fun didTriggerViewFinished(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerViewFinished" }
        sendEvent("onDidTriggerViewFinished")
    }

    override fun didTriggerApiReady(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerApiReady" }
        sendEvent("onDidTriggerApiReady")
    }

    // Ad delegate implementations
    override fun didTriggerAdLoadStart(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdLoadStart" }
        sendEvent("onDidTriggerAdLoadStart")
    }

    override fun didTriggerAdLoaded(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdLoaded" }
        sendEvent("onDidTriggerAdLoaded")
    }

    override fun didTriggerAdNotFound(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdNotFound" }
        sendEvent("onDidTriggerAdNotFound")
    }

    override fun didTriggerAdError(view: BBNativePlayerView, error: String?) {
        Log.e("BBPlayerView", "didTriggerAdError: $error")
        val params = Arguments.createMap().apply {
            putString("payload", error)
        }
        sendEvent("onDidTriggerAdError", params)
    }

    override fun didTriggerAdStarted(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdStarted" }
        sendEvent("onDidTriggerAdStarted")
    }

    override fun didTriggerAdQuartile1(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdQuartile1" }
        sendEvent("onDidTriggerAdQuartile1")
    }

    override fun didTriggerAdQuartile2(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdQuartile2" }
        sendEvent("onDidTriggerAdQuartile2")
    }

    override fun didTriggerAdQuartile3(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdQuartile3" }
        sendEvent("onDidTriggerAdQuartile3")
    }

    override fun didTriggerAdFinished(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAdFinished" }
        sendEvent("onDidTriggerAdFinished")
    }

    override fun didTriggerAllAdsCompleted(view: BBNativePlayerView) {
        debugLog("BBPlayerView") { "didTriggerAllAdsCompleted" }
        sendEvent("onDidTriggerAllAdsCompleted")
    }

    override fun onDetachedFromWindow() {
        debugLog("BBPlayerView") { "onDetachedFromWindow - cleaning up player" }
        removePlayer()
        super.onDetachedFromWindow()
    }
}
