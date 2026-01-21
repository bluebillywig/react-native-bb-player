package com.bluebillywig.bbplayer

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType

/**
 * Native Module for BBPlayer commands.
 * Works with both Old Architecture and New Architecture (Fabric).
 *
 * This module stores references to BBPlayerView instances and dispatches
 * commands to them by their React view tag.
 */
class BBPlayerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

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
    fun play(viewTag: Int) {
        runOnUiThread(viewTag) { it.play() }
    }

    @ReactMethod
    fun pause(viewTag: Int) {
        runOnUiThread(viewTag) { it.pause() }
    }

    @ReactMethod
    fun seek(viewTag: Int, position: Double) {
        runOnUiThread(viewTag) { it.seek(position) }
    }

    @ReactMethod
    fun seekRelative(viewTag: Int, offsetSeconds: Double) {
        runOnUiThread(viewTag) { it.seekRelative(offsetSeconds) }
    }

    @ReactMethod
    fun setVolume(viewTag: Int, volume: Double) {
        runOnUiThread(viewTag) { it.setVolume(volume) }
    }

    @ReactMethod
    fun setMuted(viewTag: Int, muted: Boolean) {
        runOnUiThread(viewTag) { it.setMuted(muted) }
    }

    @ReactMethod
    fun enterFullscreen(viewTag: Int) {
        runOnUiThread(viewTag) { it.enterFullscreen() }
    }

    @ReactMethod
    fun enterFullscreenLandscape(viewTag: Int) {
        runOnUiThread(viewTag) { it.enterFullscreenLandscape() }
    }

    @ReactMethod
    fun exitFullscreen(viewTag: Int) {
        runOnUiThread(viewTag) { it.exitFullscreen() }
    }

    @ReactMethod
    fun collapse(viewTag: Int) {
        runOnUiThread(viewTag) { it.collapse() }
    }

    @ReactMethod
    fun expand(viewTag: Int) {
        runOnUiThread(viewTag) { it.expand() }
    }

    @ReactMethod
    fun autoPlayNextCancel(viewTag: Int) {
        runOnUiThread(viewTag) { it.autoPlayNextCancel() }
    }

    @ReactMethod
    fun destroy(viewTag: Int) {
        runOnUiThread(viewTag) { it.destroy() }
    }

    @ReactMethod
    fun showCastPicker(viewTag: Int) {
        runOnUiThread(viewTag) { it.showCastPicker() }
    }

    @ReactMethod
    fun loadWithClipId(
        viewTag: Int,
        clipId: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double
    ) {
        Log.d("BBPlayerModule", "loadWithClipId called - viewTag: $viewTag, clipId: $clipId, autoPlay: $autoPlay")
        runOnUiThread(viewTag) {
            it.loadWithClipId(
                clipId,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null
            )
        }
    }

    @ReactMethod
    fun loadWithClipListId(
        viewTag: Int,
        clipListId: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double
    ) {
        runOnUiThread(viewTag) {
            it.loadWithClipListId(
                clipListId,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null
            )
        }
    }

    @ReactMethod
    fun loadWithProjectId(
        viewTag: Int,
        projectId: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double
    ) {
        runOnUiThread(viewTag) {
            it.loadWithProjectId(
                projectId,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null
            )
        }
    }

    @ReactMethod
    fun loadWithClipJson(
        viewTag: Int,
        clipJson: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double
    ) {
        runOnUiThread(viewTag) {
            it.loadWithClipJson(
                clipJson,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null
            )
        }
    }

    @ReactMethod
    fun loadWithClipListJson(
        viewTag: Int,
        clipListJson: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double
    ) {
        runOnUiThread(viewTag) {
            it.loadWithClipListJson(
                clipListJson,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null
            )
        }
    }

    @ReactMethod
    fun loadWithProjectJson(
        viewTag: Int,
        projectJson: String,
        initiator: String?,
        autoPlay: Boolean,
        seekTo: Double
    ) {
        runOnUiThread(viewTag) {
            it.loadWithProjectJson(
                projectJson,
                initiator,
                if (autoPlay) true else null,
                if (seekTo > 0) seekTo else null
            )
        }
    }

    @ReactMethod
    fun loadWithJsonUrl(
        viewTag: Int,
        jsonUrl: String,
        autoPlay: Boolean
    ) {
        runOnUiThread(viewTag) {
            it.loadWithJsonUrl(jsonUrl, autoPlay)
        }
    }

    // Note: loadWithShortsId is NOT supported on BBPlayerView.
    // For Shorts playback, use the BBShortsView component instead.

    // Getter methods with Promise support
    @ReactMethod
    fun getDuration(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val duration = view.getDuration()
                promise.resolve(duration)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getCurrentTime(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val currentTime = view.getCurrentTime()
                promise.resolve(currentTime)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getMuted(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val muted = view.getMuted()
                promise.resolve(muted)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getVolume(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val volume = view.getVolume()
                promise.resolve(volume)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getPhase(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val phase = view.getPhase()
                promise.resolve(phase?.name)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getState(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val state = view.getState()
                promise.resolve(state?.name)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getMode(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
            if (view != null) {
                val mode = view.getMode()
                promise.resolve(mode)
            } else {
                promise.resolve(null)
            }
        }
    }

    @ReactMethod
    fun getClipData(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
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
    fun getProjectData(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
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
    fun getPlayoutData(viewTag: Int, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val view = findPlayerView(viewTag)
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
