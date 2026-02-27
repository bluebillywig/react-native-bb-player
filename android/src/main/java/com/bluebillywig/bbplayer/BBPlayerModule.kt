package com.bluebillywig.bbplayer

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.bluebillywig.bbnativeplayersdk.BBNativePlayer
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerView
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerViewDelegate
import com.bluebillywig.bbnativeplayersdk.ModalPlayerViewHolder
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import org.json.JSONObject

/**
 * Native Module for BBPlayer commands.
 * Works with both Old Architecture (Paper) and New Architecture (Fabric/TurboModules).
 *
 * This module looks up BBPlayerView instances by their React view tag and dispatches
 * commands to them.
 */
@ReactModule(name = BBPlayerModule.NAME)
class BBPlayerModule(private val reactContext: ReactApplicationContext) :
    NativeBBPlayerModuleSpec(reactContext) {

    override fun getName(): String = NAME

    /**
     * Find BBPlayerView by its React tag.
     * Tries Fabric (New Architecture) first, then falls back to Paper (Old Architecture).
     */
    @Suppress("DEPRECATION")
    private fun findPlayerView(viewTag: Int): BBPlayerView? {
        // Try Fabric first (New Architecture)
        val fabricUIManager = UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC)
        val fabricView = fabricUIManager?.resolveView(viewTag)
        if (fabricView is BBPlayerView) {
            return fabricView
        }

        // Fall back to Paper (Old Architecture) - using LEGACY instead of deprecated DEFAULT
        val paperUIManager = UIManagerHelper.getUIManager(reactContext, UIManagerType.LEGACY)
        val paperView = paperUIManager?.resolveView(viewTag)
        if (paperView is BBPlayerView) {
            return paperView
        }

        return null
    }

    /**
     * Execute a command on the UI thread
     */
    private fun runOnUiThread(viewTag: Int, action: (BBPlayerView) -> Unit) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                action(view)
            } else {
                android.util.Log.w(NAME, "BBPlayerView not found for tag: $viewTag")
            }
        }
    }

    @ReactMethod
    override fun play(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.play() }
    }

    @ReactMethod
    override fun pause(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.pause() }
    }

    @ReactMethod
    override fun seek(viewTag: Double, position: Double) {
        runOnUiThread(viewTag.toInt()) { it.seek(position) }
    }

    @ReactMethod
    override fun seekRelative(viewTag: Double, offsetSeconds: Double) {
        runOnUiThread(viewTag.toInt()) { it.seekRelative(offsetSeconds) }
    }

    @ReactMethod
    override fun setVolume(viewTag: Double, volume: Double) {
        runOnUiThread(viewTag.toInt()) { it.setVolume(volume) }
    }

    @ReactMethod
    override fun setMuted(viewTag: Double, muted: Boolean) {
        runOnUiThread(viewTag.toInt()) { it.setMuted(muted) }
    }

    @ReactMethod
    override fun enterFullscreen(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.enterFullscreen() }
    }

    @ReactMethod
    override fun enterFullscreenLandscape(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.enterFullscreenLandscape() }
    }

    @ReactMethod
    override fun exitFullscreen(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.exitFullscreen() }
    }

    @ReactMethod
    override fun collapse(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.collapse() }
    }

    @ReactMethod
    override fun expand(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.expand() }
    }

    @ReactMethod
    override fun autoPlayNextCancel(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.autoPlayNextCancel() }
    }

    @ReactMethod
    override fun destroy(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.destroy() }
    }

    @ReactMethod
    override fun showCastPicker(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.showCastPicker() }
    }

    @ReactMethod
    override fun loadWithClipId(
        viewTag: Double,
        clipId: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double,
        contextJson: String?
    ) {
        Log.d("BBPlayerModule", "loadWithClipId called - viewTag: $viewTag, clipId: $clipId, autoPlay: $autoPlay, context: $contextJson")
        runOnUiThread(viewTag.toInt()) {
            it.loadWithClipId(
                clipId,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null,
                contextJson
            )
        }
    }

    @ReactMethod
    override fun loadWithClipListId(
        viewTag: Double,
        clipListId: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double,
        contextJson: String?
    ) {
        runOnUiThread(viewTag.toInt()) {
            it.loadWithClipListId(
                clipListId,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null,
                contextJson
            )
        }
    }

    @ReactMethod
    override fun loadWithProjectId(
        viewTag: Double,
        projectId: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double,
        contextJson: String?
    ) {
        runOnUiThread(viewTag.toInt()) {
            it.loadWithProjectId(
                projectId,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null,
                contextJson
            )
        }
    }

    @ReactMethod
    override fun loadWithClipJson(
        viewTag: Double,
        clipJson: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double,
        contextJson: String?
    ) {
        runOnUiThread(viewTag.toInt()) {
            it.loadWithClipJson(
                clipJson,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null,
                contextJson
            )
        }
    }

    @ReactMethod
    override fun loadWithClipListJson(
        viewTag: Double,
        clipListJson: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double,
        contextJson: String?
    ) {
        runOnUiThread(viewTag.toInt()) {
            it.loadWithClipListJson(
                clipListJson,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null,
                contextJson
            )
        }
    }

    @ReactMethod
    override fun loadWithProjectJson(
        viewTag: Double,
        projectJson: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double,
        contextJson: String?
    ) {
        runOnUiThread(viewTag.toInt()) {
            it.loadWithProjectJson(
                projectJson,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null,
                contextJson
            )
        }
    }

    @ReactMethod
    override fun loadWithJsonUrl(
        viewTag: Double,
        jsonUrl: String,
        autoPlay: Boolean,
        contextJson: String?
    ) {
        runOnUiThread(viewTag.toInt()) {
            it.loadWithJsonUrl(jsonUrl, autoPlay, contextJson)
        }
    }

    @ReactMethod
    override fun presentModal(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.presentModal() }
    }

    @ReactMethod
    override fun closeModal(viewTag: Double) {
        runOnUiThread(viewTag.toInt()) { it.closeModal() }
    }

    // MARK: - Modal Player API (module-level, no React view needed)

    private var modalPlayerView: BBNativePlayerView? = null
    private var pendingClipListLoad: (() -> Unit)? = null

    private fun emitEvent(eventName: String, params: com.facebook.react.bridge.WritableMap? = null) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params ?: Arguments.createMap())
    }

    private val modalPlayerDelegate = object : BBNativePlayerViewDelegate {
        override fun didTriggerPlay(playerView: BBNativePlayerView) {
            emitEvent("modalPlayerPlay")
        }
        override fun didTriggerPause(playerView: BBNativePlayerView) {
            emitEvent("modalPlayerPause")
        }
        override fun didTriggerEnded(playerView: BBNativePlayerView) {
            emitEvent("modalPlayerEnded")
        }
        override fun didFailWithError(playerView: BBNativePlayerView, error: String?) {
            emitEvent("modalPlayerError", Arguments.createMap().apply {
                putString("error", error ?: "Unknown error")
            })
        }
        override fun didTriggerApiReady(playerView: BBNativePlayerView) {
            // Load cliplist for auto-advance once player API is ready
            pendingClipListLoad?.invoke()
            pendingClipListLoad = null
            emitEvent("modalPlayerApiReady")
        }
        override fun didTriggerCanPlay(playerView: BBNativePlayerView) {
            emitEvent("modalPlayerCanPlay")
        }
        override fun didCloseModalPlayer(playerView: BBNativePlayerView) {
            emitEvent("modalPlayerDismissed")
            modalPlayerView = null
            pendingClipListLoad = null
        }
    }

    @ReactMethod
    override fun presentModalPlayer(jsonUrl: String, optionsJson: String?, contextJson: String?) {
        UiThreadUtil.runOnUiThread {
            val activity = reactContext.currentActivity as? AppCompatActivity
            if (activity == null) {
                Log.w(NAME, "presentModalPlayer: no AppCompatActivity")
                return@runOnUiThread
            }

            // Parse options from JSON string
            val options = mutableMapOf<String, Any?>()
            if (optionsJson != null) {
                try {
                    val json = JSONObject(optionsJson)
                    json.keys().forEach { key ->
                        options[key] = when {
                            json.isNull(key) -> null
                            else -> {
                                val value = json.get(key)
                                when (value) {
                                    is Boolean -> value
                                    is Int -> value
                                    is Double -> value
                                    is String -> value
                                    else -> value.toString()
                                }
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.w(NAME, "presentModalPlayer: failed to parse options JSON", e)
                }
            }

            val playerView = BBNativePlayer.createModalPlayerView(activity, jsonUrl, options)
            playerView.delegate = modalPlayerDelegate
            modalPlayerView = playerView

            // If context has a contextCollectionId (cliplist), load clip by ID with
            // cliplist context. ProgramController will swap to loading the cliplist
            // and find the clip by ID (matching web standardplayer pattern).
            if (contextJson != null) {
                try {
                    val ctxJson = JSONObject(contextJson)
                    val collectionId = ctxJson.optString("contextCollectionId", null)
                    val clipId = ctxJson.optString("contextEntityId", null)

                    if (collectionId != null && clipId != null) {
                        val context = mutableMapOf<String, Any?>(
                            "contextCollectionType" to (ctxJson.optString("contextCollectionType", null) ?: "MediaClipList"),
                            "contextCollectionId" to collectionId,
                        )
                        pendingClipListLoad = {
                            playerView.player?.loadWithClipId(clipId, "external", true, null, context)
                        }
                    }
                } catch (e: Exception) {
                    Log.w(NAME, "presentModalPlayer: failed to parse context", e)
                }
            }

            Log.d(NAME, "Modal player presented with URL: $jsonUrl, context: $contextJson")
        }
    }

    @ReactMethod
    override fun dismissModalPlayer() {
        UiThreadUtil.runOnUiThread {
            // ModalActivity is the top activity — finish it to close the modal
            val activity = reactContext.currentActivity
            if (activity is com.bluebillywig.bbnativeplayersdk.ModalActivity) {
                activity.finish()
            }
            modalPlayerView = null
        }
    }

    @ReactMethod
    override fun addListener(eventName: String) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    override fun removeListeners(count: Double) {
        // Required for NativeEventEmitter
    }

    // Note: loadWithShortsId is NOT supported on BBPlayerView.
    // For Shorts playback, use the BBShortsView component instead.

    // Getter methods with Promise support
    @ReactMethod
    override fun getDuration(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val duration = view.getDuration()
                promise.resolve(duration)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getMuted(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val muted = view.getMuted()
                promise.resolve(muted)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getVolume(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val volume = view.getVolume()
                promise.resolve(volume)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getPhase(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val phase = view.getPhase()
                promise.resolve(phase?.name)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getState(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val state = view.getState()
                promise.resolve(state?.name)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getMode(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val mode = view.getMode()
                promise.resolve(mode)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getClipData(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val clipData = view.getClipData()
                if (clipData != null) {
                    val map = Arguments.createMap().apply {
                        putString("id", clipData.id)
                        putString("title", clipData.title)
                        putString("description", clipData.description)
                        clipData.length?.let { putDouble("length", it.toDouble()) }
                    }
                    promise.resolve(map)
                } else {
                    promise.resolve(null)
                }
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getProjectData(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val projectData = view.getProjectData()
                if (projectData != null) {
                    val map = Arguments.createMap().apply {
                        putString("id", projectData.id)
                        putString("name", projectData.name)
                    }
                    promise.resolve(map)
                } else {
                    promise.resolve(null)
                }
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    override fun getPlayoutData(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val playoutData = view.getPlayoutData()
                if (playoutData != null) {
                    val map = Arguments.createMap().apply {
                        putString("name", playoutData.name)
                    }
                    promise.resolve(map)
                } else {
                    promise.resolve(null)
                }
            } else {
                promise.resolve(null)
            }
        }
    }

    companion object {
        const val NAME = "BBPlayerModule"
    }
}
