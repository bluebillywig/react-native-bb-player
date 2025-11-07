package expo.modules.bbplayer

import android.app.Activity
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.FrameLayout
import androidx.mediarouter.app.MediaRouteButton
import com.bluebillywig.bbnativeplayersdk.BBNativePlayer
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerView
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerViewDelegate
import com.bluebillywig.bbnativeshared.enums.Phase
import com.bluebillywig.bbnativeshared.enums.State
import com.bluebillywig.bbnativeshared.model.MediaClip
import com.bluebillywig.bbnativeshared.model.Project
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

/**
 * Expo-based View for Blue Billywig Native Player
 *
 * Uses ExpoView with shouldUseAndroidLayout = true to ensure native Android layout
 * is used instead of React Native's Yoga layout system. This is critical for
 * native player controls to work properly.
 */
class BBPlayerView(context: Context, appContext: AppContext) : ExpoView(context, appContext),
    BBNativePlayerViewDelegate {

    // CRITICAL: Use Android's native layout system instead of React Native's Yoga layout
    // This allows the native player controls to render and respond to touch events properly
    override val shouldUseAndroidLayout = true

    private val currentActivity: Activity
        get() = appContext.currentActivity ?: throw IllegalStateException("No current activity")

    private var jsonUrl: String = ""
    private var options = HashMap<String, Any?>()
    private var playerSetup: Boolean = false

    private lateinit var playerView: BBNativePlayerView

    init {
        // Default to black background (playout data may override with bgColor)
        setBackgroundColor(android.graphics.Color.BLACK)
    }

    // Timer for periodic time updates (4x per second)
    private val timeUpdateHandler = Handler(Looper.getMainLooper())
    private var timeUpdateRunnable: Runnable? = null
    private var isPlaying = false
    private var currentDuration: Double = 0.0
    private var lastKnownTime: Double = 0.0
    private var playbackStartTimestamp: Long = 0

    // Event dispatchers for React Native events
    private val onDidSetupWithJsonUrl by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerMediaClipLoaded by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerProjectLoaded by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerPhaseChange by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerStateChange by EventDispatcher<Map<String, String?>>()
    private val onDidFailWithError by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerMediaClipFailed by EventDispatcher<Unit>()
    private val onDidRequestOpenUrl by EventDispatcher<Map<String, String?>>()

    // Additional critical event dispatchers for bidirectional communication
    private val onDidTriggerPlay by EventDispatcher<Unit>()
    private val onDidTriggerPlaying by EventDispatcher<Unit>()
    private val onDidTriggerPause by EventDispatcher<Unit>()
    private val onDidTriggerEnded by EventDispatcher<Unit>()
    private val onDidTriggerSeeking by EventDispatcher<Unit>()
    private val onDidTriggerSeeked by EventDispatcher<Map<String, Double?>>()
    private val onDidTriggerTimeUpdate by EventDispatcher<Map<String, Double>>()
    private val onDidTriggerDurationChange by EventDispatcher<Map<String, Double>>()
    private val onDidTriggerVolumeChange by EventDispatcher<Map<String, Any?>>()
    private val onDidTriggerCanPlay by EventDispatcher<Unit>()
    private val onDidTriggerStall by EventDispatcher<Unit>()

    // Additional missing event dispatchers
    private val onDidTriggerModeChange by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerAutoPause by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerAutoPausePlay by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerFullscreen by EventDispatcher<Unit>()
    private val onDidTriggerRetractFullscreen by EventDispatcher<Unit>()
    private val onDidRequestCollapse by EventDispatcher<Unit>()
    private val onDidRequestExpand by EventDispatcher<Unit>()
    private val onDidTriggerCustomStatistics by EventDispatcher<Map<String, Any?>>()
    private val onDidTriggerViewStarted by EventDispatcher<Unit>()
    private val onDidTriggerViewFinished by EventDispatcher<Unit>()
    private val onDidTriggerApiReady by EventDispatcher<Unit>()

    // Ad event dispatchers
    private val onDidTriggerAdLoadStart by EventDispatcher<Unit>()
    private val onDidTriggerAdLoaded by EventDispatcher<Unit>()
    private val onDidTriggerAdNotFound by EventDispatcher<Unit>()
    private val onDidTriggerAdError by EventDispatcher<Map<String, String?>>()
    private val onDidTriggerAdStarted by EventDispatcher<Unit>()
    private val onDidTriggerAdQuartile1 by EventDispatcher<Unit>()
    private val onDidTriggerAdQuartile2 by EventDispatcher<Unit>()
    private val onDidTriggerAdQuartile3 by EventDispatcher<Unit>()
    private val onDidTriggerAdFinished by EventDispatcher<Unit>()
    private val onDidTriggerAllAdsCompleted by EventDispatcher<Unit>()

    fun setJsonUrl(url: String) {
        Log.d("BBPlayerView", "setJsonUrl: $url")
        this.jsonUrl = url
    }

    fun setAutoPlay(autoPlay: Boolean) {
        Log.d("BBPlayerView", "setAutoPlay: $autoPlay")
        this.options["autoPlay"] = autoPlay
    }

    fun setupPlayer() {
        Log.d("BBPlayerView", "setupPlayer called - jsonUrl: $jsonUrl, options: $options")

        if (playerSetup) {
            Log.d("BBPlayerView", "Player already setup, removing old player")
            removePlayer()
        }

        if (jsonUrl.isEmpty()) {
            Log.w("BBPlayerView", "Cannot setup player - jsonUrl is empty")
            return
        }

        Log.d("BBPlayerView", "Creating BBNativePlayerView with factory method")
        playerView = BBNativePlayer.createPlayerView(currentActivity, jsonUrl, options)
        playerView.delegate = this@BBPlayerView

        // Add player with WRAP_CONTENT height for proper aspect ratio
        addView(playerView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT))

        playerSetup = true
        Log.d("BBPlayerView", "Player setup complete")
    }

    private fun removePlayer() {
        Log.d("BBPlayerView", "removePlayer called")
        playerSetup = false
        isPlaying = false
        stopTimeUpdates()
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

    fun enterFullscreen() {
        if (::playerView.isInitialized) {
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
            // Find the MediaRouteButton (cast button) in the player view hierarchy
            // The cast button has the ID R.id.exo_cast_button from the ExoPlayer layout
            try {
                // Find the cast button by traversing the view hierarchy
                val castButton = findCastButton(playerView)
                if (castButton != null) {
                    Log.d("BBPlayerView", "Found cast button, triggering click")
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
        // First try to find by resource ID
        val castButtonId = view.resources.getIdentifier("exo_cast_button", "id", view.context.packageName)
        if (castButtonId != 0) {
            val button = view.findViewById<MediaRouteButton>(castButtonId)
            if (button != null) {
                return button
            }
        }

        // If not found by ID, recursively search through view hierarchy
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

    fun destroy() {
        // Note: destroy() method not available in Android SDK
        // Player cleanup happens automatically in onDetachedFromWindow
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
        // Note: adMediaClip property not available in Android SDK
        return null
    }

    // Load methods
    fun loadWithClipId(clipId: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null) {
        if (::playerView.isInitialized) {
            playerView.player?.loadWithClipId(clipId, initiator, autoPlay, seekTo)
        }
    }

    fun loadWithClipListId(clipListId: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null) {
        if (::playerView.isInitialized) {
            playerView.player?.loadWithClipListId(clipListId, initiator, autoPlay, seekTo)
        }
    }

    fun loadWithProjectId(projectId: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null) {
        if (::playerView.isInitialized) {
            playerView.player?.loadWithProjectId(projectId, initiator, autoPlay, seekTo)
        }
    }

    fun loadWithClipJson(clipJson: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null) {
        if (::playerView.isInitialized) {
            playerView.player?.loadWithClipJson(clipJson, initiator, autoPlay, seekTo)
        }
    }

    fun loadWithClipListJson(clipListJson: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null) {
        if (::playerView.isInitialized) {
            playerView.player?.loadWithClipListJson(clipListJson, initiator, autoPlay, seekTo)
        }
    }

    fun loadWithProjectJson(projectJson: String, initiator: String? = "external", autoPlay: Boolean? = true, seekTo: Double? = null) {
        if (::playerView.isInitialized) {
            playerView.player?.loadWithProjectJson(projectJson, initiator, autoPlay, seekTo)
        }
    }

    // Start periodic time updates (1x per second = 1000ms interval)
    // Reduced from 4Hz to 1Hz to minimize bridge traffic and improve performance
    private fun startTimeUpdates() {
        if (timeUpdateRunnable != null) {
            return // Already running
        }

        timeUpdateRunnable = object : Runnable {
            override fun run() {
                if (::playerView.isInitialized && isPlaying) {
                    // Calculate current time based on elapsed time since playback started
                    val elapsedSeconds = (System.currentTimeMillis() - playbackStartTimestamp) / 1000.0
                    val estimatedTime = lastKnownTime + elapsedSeconds
                    val currentTime = kotlin.math.min(estimatedTime, currentDuration)

                    // Only emit if we have valid time values
                    if (currentDuration > 0) {
                        onDidTriggerTimeUpdate(mapOf(
                            "currentTime" to currentTime,
                            "duration" to currentDuration
                        ))
                    }

                    // Schedule next update at 1Hz instead of 4Hz
                    timeUpdateHandler.postDelayed(this, 1000)
                }
            }
        }

        // Start the timer
        timeUpdateHandler.postDelayed(timeUpdateRunnable!!, 1000)
    }

    // Stop periodic time updates
    private fun stopTimeUpdates() {
        timeUpdateRunnable?.let {
            timeUpdateHandler.removeCallbacks(it)
            timeUpdateRunnable = null
        }
    }

    // BBNativePlayerViewDelegate implementations
    override fun didSetupWithJsonUrl(view: BBNativePlayerView, url: String?) {
        Log.d("BBPlayerView", "didSetupWithJsonUrl: $url")

        // Debug: Check if controls are enabled
        val playoutData = view.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.playoutData)
        Log.d("BBPlayerView", "Playout data: $playoutData")

        onDidSetupWithJsonUrl(mapOf("url" to url))
    }

    override fun didTriggerMediaClipLoaded(view: BBNativePlayerView, clipData: MediaClip?) {
        Log.d("BBPlayerView", "didTriggerMediaClipLoaded: ${clipData?.title}")
        onDidTriggerMediaClipLoaded(mapOf(
            "title" to clipData?.title,
            "id" to clipData?.id
        ))
    }

    override fun didTriggerProjectLoaded(view: BBNativePlayerView, projectData: Project?) {
        Log.d("BBPlayerView", "didTriggerProjectLoaded: ${projectData?.id}")
        onDidTriggerProjectLoaded(mapOf("id" to projectData?.id))
    }

    override fun didTriggerPhaseChange(view: BBNativePlayerView, phase: Phase?) {
        Log.d("BBPlayerView", "didTriggerPhaseChange: ${phase?.name}")
        onDidTriggerPhaseChange(mapOf("phase" to phase?.name))
    }

    override fun didTriggerStateChange(view: BBNativePlayerView, state: State?) {
        Log.d("BBPlayerView", "didTriggerStateChange: ${state?.name}")
        onDidTriggerStateChange(mapOf("state" to state?.name))
    }

    override fun didFailWithError(view: BBNativePlayerView, error: String?) {
        Log.e("BBPlayerView", "didFailWithError: $error")

        // Map common error types to user-friendly messages
        val errorMessage = when {
            error?.contains("Domain", ignoreCase = true) == true ->
                "Content is not available in this location or domain"
            error?.contains("Geo", ignoreCase = true) == true ->
                "Content is not available in your region"
            error != null && error.isNotBlank() -> error
            else -> "Unknown error occurred"
        }

        onDidFailWithError(mapOf("error" to errorMessage))
    }

    override fun didTriggerMediaClipFailed(view: BBNativePlayerView) {
        Log.e("BBPlayerView", "didTriggerMediaClipFailed")
        onDidTriggerMediaClipFailed(Unit)
    }

    override fun didRequestOpenUrl(view: BBNativePlayerView, url: String?) {
        Log.d("BBPlayerView", "didRequestOpenUrl: $url")
        onDidRequestOpenUrl(mapOf("url" to url))
    }

    override fun didTriggerCanPlay(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerCanPlay - autoPlay: ${options["autoPlay"]}")

        // Emit event
        onDidTriggerCanPlay(Unit)

        // If autoPlay was requested, start playback when player is ready
        val autoPlay = options["autoPlay"] as? Boolean ?: false
        if (autoPlay) {
            Log.d("BBPlayerView", "Calling play() for autoplay")
            view.player?.play()
        } else {
            Log.d("BBPlayerView", "AutoPlay is false, not calling play()")
        }
    }

    // Additional critical delegate implementations for bidirectional communication
    override fun didTriggerPlay(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerPlay")
        onDidTriggerPlay(Unit)
    }

    override fun didTriggerPlaying(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerPlaying - starting periodic time updates")
        isPlaying = true
        playbackStartTimestamp = System.currentTimeMillis()
        startTimeUpdates()
        onDidTriggerPlaying(Unit)
    }

    override fun didTriggerPause(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerPause - stopping periodic time updates")
        isPlaying = false
        stopTimeUpdates()
        onDidTriggerPause(Unit)
    }

    override fun didTriggerEnded(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerEnded - stopping periodic time updates")
        isPlaying = false
        stopTimeUpdates()
        onDidTriggerEnded(Unit)
    }

    override fun didTriggerSeeking(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerSeeking")
        onDidTriggerSeeking(Unit)
    }

    override fun didTriggerSeeked(view: BBNativePlayerView, seekOffset: Double?) {
        Log.d("BBPlayerView", "didTriggerSeeked: $seekOffset")
        // Update lastKnownTime based on seek and reset playback timestamp
        lastKnownTime = seekOffset ?: 0.0
        playbackStartTimestamp = System.currentTimeMillis()

        onDidTriggerSeeked(mapOf(
            "seekOffset" to seekOffset,
            "currentTime" to lastKnownTime
        ))

        // Also fire time update after seek
        onDidTriggerTimeUpdate(mapOf(
            "currentTime" to lastKnownTime,
            "duration" to currentDuration
        ))
    }

    override fun didTriggerDurationChange(view: BBNativePlayerView, duration: Double?) {
        Log.d("BBPlayerView", "didTriggerDurationChange: $duration")
        currentDuration = duration ?: 0.0
        onDidTriggerDurationChange(mapOf("duration" to currentDuration))
    }

    override fun didTriggerVolumeChange(view: BBNativePlayerView, volume: Double?) {
        Log.d("BBPlayerView", "didTriggerVolumeChange: $volume")
        // Infer muted state from volume (volume == 0 means muted)
        val muted = (volume ?: 0.0) == 0.0
        onDidTriggerVolumeChange(mapOf(
            "volume" to volume,
            "muted" to muted
        ))
    }

    override fun didTriggerStall(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerStall")
        onDidTriggerStall(Unit)
    }

    // Additional missing delegate implementations
    override fun didTriggerModeChange(view: BBNativePlayerView, mode: String?) {
        Log.d("BBPlayerView", "didTriggerModeChange: $mode")
        onDidTriggerModeChange(mapOf("mode" to mode))
    }

    override fun didTriggerAutoPause(view: BBNativePlayerView, why: String?) {
        Log.d("BBPlayerView", "didTriggerAutoPause: $why")
        onDidTriggerAutoPause(mapOf("why" to why))
    }

    override fun didTriggerAutoPausePlay(view: BBNativePlayerView, why: String?) {
        Log.d("BBPlayerView", "didTriggerAutoPausePlay: $why")
        onDidTriggerAutoPausePlay(mapOf("why" to why))
    }

    override fun didTriggerFullscreen(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerFullscreen")
        onDidTriggerFullscreen(Unit)
    }

    override fun didTriggerRetractFullscreen(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerRetractFullscreen")
        onDidTriggerRetractFullscreen(Unit)
    }

    override fun didRequestCollapse(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didRequestCollapse")
        onDidRequestCollapse(Unit)
    }

    override fun didRequestExpand(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didRequestExpand")
        onDidRequestExpand(Unit)
    }

    override fun didTriggerCustomStatistics(view: BBNativePlayerView, ident: String, ev: String, aux: Map<String, String>) {
        Log.d("BBPlayerView", "didTriggerCustomStatistics: ident=$ident, ev=$ev")
        onDidTriggerCustomStatistics(mapOf(
            "ident" to ident,
            "ev" to ev,
            "aux" to aux
        ))
    }

    override fun didTriggerViewStarted(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerViewStarted")
        onDidTriggerViewStarted(Unit)
    }

    override fun didTriggerViewFinished(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerViewFinished")
        onDidTriggerViewFinished(Unit)
    }

    override fun didTriggerApiReady(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerApiReady")
        onDidTriggerApiReady(Unit)
    }

    // Ad delegate implementations
    override fun didTriggerAdLoadStart(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdLoadStart")
        onDidTriggerAdLoadStart(Unit)
    }

    override fun didTriggerAdLoaded(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdLoaded")
        onDidTriggerAdLoaded(Unit)
    }

    override fun didTriggerAdNotFound(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdNotFound")
        onDidTriggerAdNotFound(Unit)
    }

    override fun didTriggerAdError(view: BBNativePlayerView, error: String?) {
        Log.e("BBPlayerView", "didTriggerAdError: $error")
        onDidTriggerAdError(mapOf("error" to error))
    }

    override fun didTriggerAdStarted(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdStarted")
        onDidTriggerAdStarted(Unit)
    }

    override fun didTriggerAdQuartile1(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdQuartile1")
        onDidTriggerAdQuartile1(Unit)
    }

    override fun didTriggerAdQuartile2(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdQuartile2")
        onDidTriggerAdQuartile2(Unit)
    }

    override fun didTriggerAdQuartile3(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdQuartile3")
        onDidTriggerAdQuartile3(Unit)
    }

    override fun didTriggerAdFinished(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAdFinished")
        onDidTriggerAdFinished(Unit)
    }

    override fun didTriggerAllAdsCompleted(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerAllAdsCompleted")
        onDidTriggerAllAdsCompleted(Unit)
    }

    override fun onDetachedFromWindow() {
        Log.d("BBPlayerView", "onDetachedFromWindow - cleaning up player")
        removePlayer()
        super.onDetachedFromWindow()
    }
}
