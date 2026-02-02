package com.bluebillywig.bbplayer

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType

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
    override fun getCurrentTime(viewTag: Double, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag.toInt())
            if (view != null) {
                val currentTime = view.getCurrentTime()
                promise.resolve(currentTime)
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
