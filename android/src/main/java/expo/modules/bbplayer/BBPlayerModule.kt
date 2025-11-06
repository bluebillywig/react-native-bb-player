package expo.modules.bbplayer

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Expo Module for Blue Billywig Native Player
 *
 * This module defines the BBPlayerView component and its props/events
 * using the Expo Modules API. This allows us to use ExpoView with
 * shouldUseAndroidLayout = true for proper native layout handling.
 */
class BBPlayerModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoBBPlayer")

        View(BBPlayerView::class) {
            // Props
            Prop("jsonUrl") { view: BBPlayerView, url: String ->
                view.setJsonUrl(url)
            }

            Prop("autoPlay") { view: BBPlayerView, autoPlay: Boolean ->
                view.setAutoPlay(autoPlay)
            }

            // Setup player when props are updated
            OnViewDidUpdateProps { view ->
                view.setupPlayer()
            }

            // Async functions for playback control
            AsyncFunction("play") { view: BBPlayerView ->
                view.play()
            }

            AsyncFunction("pause") { view: BBPlayerView ->
                view.pause()
            }

            AsyncFunction("seek") { view: BBPlayerView, offsetInSeconds: Double ->
                view.seek(offsetInSeconds)
            }

            AsyncFunction("setVolume") { view: BBPlayerView, volume: Double ->
                view.setVolume(volume)
            }

            AsyncFunction("setMuted") { view: BBPlayerView, muted: Boolean ->
                view.setMuted(muted)
            }

            AsyncFunction("autoPlayNextCancel") { view: BBPlayerView ->
                view.autoPlayNextCancel()
            }

            AsyncFunction("collapse") { view: BBPlayerView ->
                view.collapse()
            }

            AsyncFunction("expand") { view: BBPlayerView ->
                view.expand()
            }

            AsyncFunction("enterFullscreen") { view: BBPlayerView ->
                view.enterFullscreen()
            }

            AsyncFunction("exitFullscreen") { view: BBPlayerView ->
                view.exitFullscreen()
            }

            AsyncFunction("destroy") { view: BBPlayerView ->
                view.destroy()
            }

            // Getter methods
            AsyncFunction("phase") { view: BBPlayerView ->
                view.getPhase()?.name
            }

            AsyncFunction("state") { view: BBPlayerView ->
                view.getState()?.name
            }

            AsyncFunction("playerState") { view: BBPlayerView ->
                view.getState()?.name
            }

            AsyncFunction("mode") { view: BBPlayerView ->
                view.getMode()
            }

            AsyncFunction("playoutData") { view: BBPlayerView ->
                view.getPlayoutData()
            }

            AsyncFunction("projectData") { view: BBPlayerView ->
                view.getProjectData()
            }

            AsyncFunction("duration") { view: BBPlayerView ->
                view.getDuration()
            }

            AsyncFunction("volume") { view: BBPlayerView ->
                view.getVolume()
            }

            AsyncFunction("muted") { view: BBPlayerView ->
                view.getMuted()
            }

            AsyncFunction("inView") { view: BBPlayerView ->
                view.getInView()
            }

            AsyncFunction("controls") { view: BBPlayerView ->
                view.getControls()
            }

            AsyncFunction("adMediaWidth") { view: BBPlayerView ->
                view.getAdMediaWidth()
            }

            AsyncFunction("adMediaHeight") { view: BBPlayerView ->
                view.getAdMediaHeight()
            }

            AsyncFunction("adMediaClip") { view: BBPlayerView ->
                view.getAdMediaClip()
            }

            // Load methods
            AsyncFunction("loadWithClipId") { view: BBPlayerView, clipId: String, initiator: String?, autoPlay: Boolean?, seekTo: Double? ->
                view.loadWithClipId(clipId, initiator, autoPlay, seekTo)
            }

            AsyncFunction("loadWithClipListId") { view: BBPlayerView, clipListId: String, initiator: String?, autoPlay: Boolean?, seekTo: Double? ->
                view.loadWithClipListId(clipListId, initiator, autoPlay, seekTo)
            }

            AsyncFunction("loadWithProjectId") { view: BBPlayerView, projectId: String, initiator: String?, autoPlay: Boolean?, seekTo: Double? ->
                view.loadWithProjectId(projectId, initiator, autoPlay, seekTo)
            }

            AsyncFunction("loadWithClipJson") { view: BBPlayerView, clipJson: String, initiator: String?, autoPlay: Boolean?, seekTo: Double? ->
                view.loadWithClipJson(clipJson, initiator, autoPlay, seekTo)
            }

            AsyncFunction("loadWithClipListJson") { view: BBPlayerView, clipListJson: String, initiator: String?, autoPlay: Boolean?, seekTo: Double? ->
                view.loadWithClipListJson(clipListJson, initiator, autoPlay, seekTo)
            }

            AsyncFunction("loadWithProjectJson") { view: BBPlayerView, projectJson: String, initiator: String?, autoPlay: Boolean?, seekTo: Double? ->
                view.loadWithProjectJson(projectJson, initiator, autoPlay, seekTo)
            }

            // Events
            Events(
                "onDidSetupWithJsonUrl",
                "onDidTriggerMediaClipLoaded",
                "onDidTriggerProjectLoaded",
                "onDidTriggerPhaseChange",
                "onDidTriggerStateChange",
                "onDidFailWithError",
                "onDidTriggerMediaClipFailed",
                "onDidRequestOpenUrl",
                // Additional critical events for bidirectional communication
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
                // Additional missing events
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
                // Ad events
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
        }
    }
}
