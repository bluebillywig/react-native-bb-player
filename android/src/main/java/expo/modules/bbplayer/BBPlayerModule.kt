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

            // Events
            Events(
                "onPlayerSetup",
                "onMediaClipLoaded",
                "onProjectLoaded",
                "onPhaseChange",
                "onStateChange",
                "onError",
                "onMediaClipFailed",
                "onRequestOpenUrl",
                // Additional critical events for bidirectional communication
                "onPlay",
                "onPlaying",
                "onPause",
                "onEnded",
                "onSeeking",
                "onSeeked",
                "onTimeUpdate",
                "onDurationChange",
                "onVolumeChange",
                "onCanPlay",
                "onStall"
            )
        }
    }
}
