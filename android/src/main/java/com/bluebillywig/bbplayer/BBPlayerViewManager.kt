package com.bluebillywig.bbplayer

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

/**
 * ViewGroupManager for BBPlayerView.
 *
 * Uses ViewGroupManager instead of SimpleViewManager because BBPlayerView contains
 * child views (BBNativePlayerView with ExoPlayer). The needsCustomLayoutForChildren()
 * override tells React Native that this view handles its own child layout, which is
 * necessary for ExoPlayer's controlbar to work correctly.
 *
 * See: https://github.com/facebook/react-native/issues/17968
 * See: https://github.com/reactwg/react-native-new-architecture/discussions/52
 */
class BBPlayerViewManager : ViewGroupManager<BBPlayerView>() {

    /**
     * Tell React Native that this view handles its own child layout.
     * This prevents Yoga from interfering with native child view layout,
     * which is necessary for ExoPlayer's controlbar to work.
     */
    override fun needsCustomLayoutForChildren(): Boolean = true

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): BBPlayerView {
        return BBPlayerView(reactContext)
    }

    // Props
    @ReactProp(name = "jsonUrl")
    fun setJsonUrl(view: BBPlayerView, url: String?) {
        view.setJsonUrl(url ?: "")
    }

    @ReactProp(name = "autoPlay")
    fun setAutoPlay(view: BBPlayerView, autoPlay: Boolean) {
        view.setAutoPlay(autoPlay)
    }

    @ReactProp(name = "enableTimeUpdates")
    fun setEnableTimeUpdates(view: BBPlayerView, enabled: Boolean) {
        view.setEnableTimeUpdates(enabled)
    }

    @ReactProp(name = "options")
    fun setOptions(view: BBPlayerView, options: ReadableMap?) {
        view.setOptions(options)
    }

    // Commands - using Kotlin's mapOf instead of deprecated MapBuilder
    override fun getCommandsMap(): Map<String, Int> = mapOf(
        "play" to COMMAND_PLAY,
        "pause" to COMMAND_PAUSE,
        "seek" to COMMAND_SEEK,
        "seekRelative" to COMMAND_SEEK_RELATIVE,
        "setVolume" to COMMAND_SET_VOLUME,
        "setMuted" to COMMAND_SET_MUTED,
        "autoPlayNextCancel" to COMMAND_AUTO_PLAY_NEXT_CANCEL,
        "collapse" to COMMAND_COLLAPSE,
        "expand" to COMMAND_EXPAND,
        "enterFullscreen" to COMMAND_ENTER_FULLSCREEN,
        "enterFullscreenLandscape" to COMMAND_ENTER_FULLSCREEN_LANDSCAPE,
        "exitFullscreen" to COMMAND_EXIT_FULLSCREEN,
        "showCastPicker" to COMMAND_SHOW_CAST_PICKER,
        "destroy" to COMMAND_DESTROY,
        "loadWithClipId" to COMMAND_LOAD_WITH_CLIP_ID,
        "loadWithClipListId" to COMMAND_LOAD_WITH_CLIP_LIST_ID,
        "loadWithProjectId" to COMMAND_LOAD_WITH_PROJECT_ID,
        "loadWithClipJson" to COMMAND_LOAD_WITH_CLIP_JSON,
        "loadWithClipListJson" to COMMAND_LOAD_WITH_CLIP_LIST_JSON,
        "loadWithProjectJson" to COMMAND_LOAD_WITH_PROJECT_JSON,
        "presentModal" to COMMAND_PRESENT_MODAL,
        "closeModal" to COMMAND_CLOSE_MODAL
    )

    // Override for Old Architecture (numeric command IDs)
    @Deprecated("Deprecated in favor of receiveCommand with String commandId")
    override fun receiveCommand(view: BBPlayerView, commandId: Int, args: ReadableArray?) {
        // Convert numeric command ID to string and delegate
        val commandName = when (commandId) {
            COMMAND_PLAY -> "play"
            COMMAND_PAUSE -> "pause"
            COMMAND_SEEK -> "seek"
            COMMAND_SEEK_RELATIVE -> "seekRelative"
            COMMAND_SET_VOLUME -> "setVolume"
            COMMAND_SET_MUTED -> "setMuted"
            COMMAND_AUTO_PLAY_NEXT_CANCEL -> "autoPlayNextCancel"
            COMMAND_COLLAPSE -> "collapse"
            COMMAND_EXPAND -> "expand"
            COMMAND_ENTER_FULLSCREEN -> "enterFullscreen"
            COMMAND_ENTER_FULLSCREEN_LANDSCAPE -> "enterFullscreenLandscape"
            COMMAND_EXIT_FULLSCREEN -> "exitFullscreen"
            COMMAND_SHOW_CAST_PICKER -> "showCastPicker"
            COMMAND_DESTROY -> "destroy"
            COMMAND_LOAD_WITH_CLIP_ID -> "loadWithClipId"
            COMMAND_LOAD_WITH_CLIP_LIST_ID -> "loadWithClipListId"
            COMMAND_LOAD_WITH_PROJECT_ID -> "loadWithProjectId"
            COMMAND_LOAD_WITH_CLIP_JSON -> "loadWithClipJson"
            COMMAND_LOAD_WITH_CLIP_LIST_JSON -> "loadWithClipListJson"
            COMMAND_LOAD_WITH_PROJECT_JSON -> "loadWithProjectJson"
            COMMAND_PRESENT_MODAL -> "presentModal"
            COMMAND_CLOSE_MODAL -> "closeModal"
            else -> return
        }
        receiveCommand(view, commandName, args)
    }

    // Override for New Architecture (string command names)
    override fun receiveCommand(view: BBPlayerView, commandId: String?, args: ReadableArray?) {
        when (commandId) {
            "play" -> view.play()
            "pause" -> view.pause()
            "seek" -> args?.getDouble(0)?.let { view.seek(it) }
            "seekRelative" -> args?.getDouble(0)?.let { view.seekRelative(it) }
            "setVolume" -> args?.getDouble(0)?.let { view.setVolume(it) }
            "setMuted" -> args?.getBoolean(0)?.let { view.setMuted(it) }
            "autoPlayNextCancel" -> view.autoPlayNextCancel()
            "collapse" -> view.collapse()
            "expand" -> view.expand()
            "enterFullscreen" -> view.enterFullscreen()
            "enterFullscreenLandscape" -> view.enterFullscreenLandscape()
            "exitFullscreen" -> view.exitFullscreen()
            "showCastPicker" -> view.showCastPicker()
            "destroy" -> view.destroy()
            "presentModal" -> view.presentModal()
            "closeModal" -> view.closeModal()
            "loadWithClipId" -> {
                val clipId = args?.getString(0) ?: return
                val initiator = args.getString(1)
                val autoPlay = if (args.size() > 2 && !args.isNull(2)) args.getBoolean(2) else null
                val seekTo = if (args.size() > 3 && !args.isNull(3)) args.getDouble(3) else null
                view.loadWithClipId(clipId, initiator, autoPlay, seekTo)
            }
            "loadWithClipListId" -> {
                val clipListId = args?.getString(0) ?: return
                val initiator = args.getString(1)
                val autoPlay = if (args.size() > 2 && !args.isNull(2)) args.getBoolean(2) else null
                val seekTo = if (args.size() > 3 && !args.isNull(3)) args.getDouble(3) else null
                view.loadWithClipListId(clipListId, initiator, autoPlay, seekTo)
            }
            "loadWithProjectId" -> {
                val projectId = args?.getString(0) ?: return
                val initiator = args.getString(1)
                val autoPlay = if (args.size() > 2 && !args.isNull(2)) args.getBoolean(2) else null
                val seekTo = if (args.size() > 3 && !args.isNull(3)) args.getDouble(3) else null
                view.loadWithProjectId(projectId, initiator, autoPlay, seekTo)
            }
            "loadWithClipJson" -> {
                val clipJson = args?.getString(0) ?: return
                val initiator = args.getString(1)
                val autoPlay = if (args.size() > 2 && !args.isNull(2)) args.getBoolean(2) else null
                val seekTo = if (args.size() > 3 && !args.isNull(3)) args.getDouble(3) else null
                view.loadWithClipJson(clipJson, initiator, autoPlay, seekTo)
            }
            "loadWithClipListJson" -> {
                val clipListJson = args?.getString(0) ?: return
                val initiator = args.getString(1)
                val autoPlay = if (args.size() > 2 && !args.isNull(2)) args.getBoolean(2) else null
                val seekTo = if (args.size() > 3 && !args.isNull(3)) args.getDouble(3) else null
                view.loadWithClipListJson(clipListJson, initiator, autoPlay, seekTo)
            }
            "loadWithProjectJson" -> {
                val projectJson = args?.getString(0) ?: return
                val initiator = args.getString(1)
                val autoPlay = if (args.size() > 2 && !args.isNull(2)) args.getBoolean(2) else null
                val seekTo = if (args.size() > 3 && !args.isNull(3)) args.getDouble(3) else null
                view.loadWithProjectJson(projectJson, initiator, autoPlay, seekTo)
            }
        }
    }

    // Event registration - using Kotlin's mapOf instead of deprecated MapBuilder
    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
        val eventNames = listOf(
            "onDidSetupWithJsonUrl",
            "onDidTriggerMediaClipLoaded",
            "onDidTriggerProjectLoaded",
            "onDidTriggerPhaseChange",
            "onDidTriggerStateChange",
            "onDidFailWithError",
            "onDidTriggerMediaClipFailed",
            "onDidRequestOpenUrl",
            "onDidTriggerPlay",
            "onDidTriggerPlaying",
            "onDidTriggerPause",
            "onDidTriggerEnded",
            "onDidTriggerSeeking",
            "onDidTriggerSeeked",
            "onDidTriggerTimeUpdate",
            "onDidTriggerDurationChange",
            "onDidTriggerVolumeChange",
            "onDidTriggerCanPlay",
            "onDidTriggerStall",
            "onDidTriggerModeChange",
            "onDidTriggerAutoPause",
            "onDidTriggerAutoPausePlay",
            "onDidTriggerFullscreen",
            "onDidTriggerRetractFullscreen",
            "onDidRequestCollapse",
            "onDidRequestExpand",
            "onDidTriggerCustomStatistics",
            "onDidTriggerViewStarted",
            "onDidTriggerViewFinished",
            "onDidTriggerApiReady",
            "onDidTriggerAdLoadStart",
            "onDidTriggerAdLoaded",
            "onDidTriggerAdNotFound",
            "onDidTriggerAdError",
            "onDidTriggerAdStarted",
            "onDidTriggerAdQuartile1",
            "onDidTriggerAdQuartile2",
            "onDidTriggerAdQuartile3",
            "onDidTriggerAdFinished",
            "onDidTriggerAllAdsCompleted"
        )

        return eventNames.associateWith { eventName ->
            mapOf("registrationName" to eventName)
        }
    }

    // Called after props are set - trigger player setup
    override fun onAfterUpdateTransaction(view: BBPlayerView) {
        super.onAfterUpdateTransaction(view)
        view.setupPlayer()
    }

    companion object {
        const val REACT_CLASS = "BBPlayerView"

        // Command IDs
        private const val COMMAND_PLAY = 1
        private const val COMMAND_PAUSE = 2
        private const val COMMAND_SEEK = 3
        private const val COMMAND_SEEK_RELATIVE = 4
        private const val COMMAND_SET_VOLUME = 5
        private const val COMMAND_SET_MUTED = 6
        private const val COMMAND_AUTO_PLAY_NEXT_CANCEL = 7
        private const val COMMAND_COLLAPSE = 8
        private const val COMMAND_EXPAND = 9
        private const val COMMAND_ENTER_FULLSCREEN = 10
        private const val COMMAND_ENTER_FULLSCREEN_LANDSCAPE = 11
        private const val COMMAND_EXIT_FULLSCREEN = 12
        private const val COMMAND_SHOW_CAST_PICKER = 13
        private const val COMMAND_DESTROY = 14
        private const val COMMAND_LOAD_WITH_CLIP_ID = 15
        private const val COMMAND_LOAD_WITH_CLIP_LIST_ID = 16
        private const val COMMAND_LOAD_WITH_PROJECT_ID = 17
        private const val COMMAND_LOAD_WITH_CLIP_JSON = 18
        private const val COMMAND_LOAD_WITH_CLIP_LIST_JSON = 19
        private const val COMMAND_LOAD_WITH_PROJECT_JSON = 20
        private const val COMMAND_PRESENT_MODAL = 21
        private const val COMMAND_CLOSE_MODAL = 22
    }
}
