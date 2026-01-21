package com.bluebillywig.bbplayer

import android.app.Activity
import android.util.Log
import android.widget.FrameLayout
import com.bluebillywig.bbnativeplayersdk.BBNativeShorts
import com.bluebillywig.bbnativeplayersdk.BBNativeShortsView
import com.bluebillywig.bbnativeplayersdk.BBNativeShortsViewDelegate
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
 * React Native View for Blue Billywig Native Shorts
 *
 * This is a separate component from BBPlayerView specifically for Shorts playback.
 * Shorts use a different native SDK view (BBNativeShortsView) that supports
 * vertical swipe navigation and TikTok-style full-screen video experience.
 *
 * Usage:
 * ```tsx
 * <BBShortsView
 *   jsonUrl="https://demo.bbvms.com/sh/58.json"
 *   onDidSetupWithJsonUrl={(url) => console.log('Shorts loaded:', url)}
 *   onDidFailWithError={(error) => console.error('Error:', error)}
 * />
 * ```
 */
class BBShortsView(private val reactContext: ThemedReactContext) : FrameLayout(reactContext),
    BBNativeShortsViewDelegate {

    private val currentActivity: Activity
        get() = reactContext.currentActivity ?: throw IllegalStateException("No current activity")

    private var jsonUrl: String = ""
    private var options = HashMap<String, Any?>()
    private var shortsSetup: Boolean = false

    private var shortsView: BBNativeShortsView? = null

    init {
        // Default to black background for Shorts
        setBackgroundColor(android.graphics.Color.BLACK)
    }

    /**
     * Override onLayout to ensure child views receive proper bounds.
     * This is critical for React Native Fabric where layout isn't automatically propagated.
     */
    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        // Explicitly layout all children to fill the container
        for (i in 0 until childCount) {
            getChildAt(i)?.layout(0, 0, right - left, bottom - top)
        }
    }

    // Event emission helper using modern EventDispatcher
    private fun sendEvent(eventName: String, params: WritableMap?) {
        val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
        eventDispatcher?.dispatchEvent(BBShortsEvent(surfaceId, id, eventName, params))
    }

    private fun sendEvent(eventName: String) {
        sendEvent(eventName, null)
    }

    /**
     * Custom event class for BBShorts events.
     * Uses the modern Event API instead of deprecated RCTEventEmitter.
     */
    private class BBShortsEvent(
        surfaceId: Int,
        viewTag: Int,
        private val name: String,
        private val data: WritableMap?
    ) : Event<BBShortsEvent>(surfaceId, viewTag) {

        override fun getEventName(): String = name

        override fun getEventData(): WritableMap = data ?: Arguments.createMap()
    }

    fun setJsonUrl(url: String) {
        val oldUrl = this.jsonUrl
        Log.d("BBShortsView", "setJsonUrl: $url (current: $oldUrl)")

        // If URL changed and we already have a shorts view, recreate it
        if (oldUrl != url && shortsSetup) {
            Log.d("BBShortsView", "jsonUrl changed - recreating shorts view")
            this.jsonUrl = url
            removeShorts()
            createAndAddShorts()
        } else {
            this.jsonUrl = url
        }
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

    fun setupShorts() {
        Log.d("BBShortsView", "setupShorts called - jsonUrl: $jsonUrl, shortsSetup: $shortsSetup")

        if (jsonUrl.isEmpty()) {
            Log.w("BBShortsView", "Cannot setup shorts - jsonUrl is empty")
            return
        }

        if (!shortsSetup) {
            // Initial setup - create the shorts view with the initial URL
            Log.d("BBShortsView", "Initial setup - creating shorts view")
            createAndAddShorts()
        }
    }

    private fun createAndAddShorts() {
        debugLog("BBShortsView") { "Creating BBNativeShortsView with factory method" }

        // Convert options to HashMap for the native SDK
        val nativeOptions: HashMap<String, Any?>? = if (options.isNotEmpty()) options else null

        shortsView = BBNativeShorts.createShortsView(currentActivity, jsonUrl, nativeOptions)
        shortsView?.delegate = this@BBShortsView

        addView(shortsView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))

        shortsSetup = true
        debugLog("BBShortsView") { "Shorts setup complete with URL: $jsonUrl" }
    }

    private fun removeShorts() {
        debugLog("BBShortsView") { "removeShorts called" }
        shortsSetup = false
        removeAllViews()

        shortsView?.let {
            it.__destruct()
        }
        shortsView = null
    }

    fun destroy() {
        Log.d("BBShortsView", "destroy() called")
        removeShorts()
    }

    // BBNativeShortsViewDelegate implementations
    override fun didSetupWithJsonUrl(shortsView: BBNativeShortsView, url: String?) {
        debugLog("BBShortsView") { "didSetupWithJsonUrl: $url" }

        val params = Arguments.createMap().apply {
            putString("url", url)
        }
        sendEvent("onDidSetupWithJsonUrl", params)
    }

    override fun didFailWithError(shortsView: BBNativeShortsView, error: String?) {
        Log.e("BBShortsView", "didFailWithError: $error")

        val params = Arguments.createMap().apply {
            putString("error", error ?: "Unknown error occurred")
        }
        sendEvent("onDidFailWithError", params)
    }

    override fun onDetachedFromWindow() {
        debugLog("BBShortsView") { "onDetachedFromWindow - cleaning up shorts" }
        removeShorts()
        super.onDetachedFromWindow()
    }
}
