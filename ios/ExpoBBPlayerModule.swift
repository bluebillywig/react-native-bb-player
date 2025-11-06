import ExpoModulesCore

public class ExpoBBPlayerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoBBPlayer")

    View(ExpoBBPlayerView.self) {
      Prop("jsonUrl") { (view, url: String) in
        view.setJsonUrl(url)
      }

      Prop("options") { (view, options: [String: Any]) in
        view.setOptions(options)
      }

      OnViewDidUpdateProps { view in
        view.setupPlayer()
      }

      AsyncFunction("adMediaHeight") { (view: ExpoBBPlayerView) in
        return view.adMediaHeight()
      }

      AsyncFunction("adMediaWidth") { (view: ExpoBBPlayerView) in
        return view.adMediaWidth()
      }

      AsyncFunction("adMediaClip") { (view: ExpoBBPlayerView) in
        return view.adMediaClip()
      }

      AsyncFunction("controls") { (view: ExpoBBPlayerView) in
        return view.controls()
      }

      AsyncFunction("duration") { (view: ExpoBBPlayerView) in
        return view.duration()
      }

      AsyncFunction("inView") { (view: ExpoBBPlayerView) in
        return view.inView()
      }

      AsyncFunction("mode") { (view: ExpoBBPlayerView) in
        return view.mode()
      }

      AsyncFunction("muted") { (view: ExpoBBPlayerView) in
        return view.muted()
      }

      AsyncFunction("phase") { (view: ExpoBBPlayerView) in
        return view.phase()
      }

      AsyncFunction("playoutData") { (view: ExpoBBPlayerView) in
        return view.playoutData()
      }

      AsyncFunction("projectData") { (view: ExpoBBPlayerView) in
        return view.projectData()
      }

      AsyncFunction("playerState") { (view: ExpoBBPlayerView) in
        return view.state()
      }

      AsyncFunction("volume") { (view: ExpoBBPlayerView) in
        return view.volume()
      }

      AsyncFunction("autoPlayNextCancel") { (view: ExpoBBPlayerView) in
        return view.autoPlayNextCancel()
      }

      AsyncFunction("collapse") { (view: ExpoBBPlayerView) in
        return view.collapse()
      }

      AsyncFunction("expand") { (view: ExpoBBPlayerView) in
        return view.expand()
      }

      AsyncFunction("enterFullscreen") { (view: ExpoBBPlayerView) in
        return view.enterFullscreen()
      }

      AsyncFunction("exitFullscreen") { (view: ExpoBBPlayerView) in
        return view.exitFullscreen()
      }

      AsyncFunction("pause") { (view: ExpoBBPlayerView) in
        return view.pause()
      }

      AsyncFunction("play") { (view: ExpoBBPlayerView) in
        return view.play()
      }

      AsyncFunction("seek") { (view: ExpoBBPlayerView, offsetInSeconds: Int) in
        return view.seek(offsetInSeconds)
      }

      AsyncFunction("setMuted") { (view: ExpoBBPlayerView, muted: Bool) in
        return view.setMuted(muted)
      }

      AsyncFunction("setVolume") { (view: ExpoBBPlayerView, volume: Double) in
        return view.setVolume(volume)
      }

      Events([
        "onDidFailWithError",
        "onDidRequestCollapse",
        "onDidRequestExpand",
        "onDidRequestOpenUrl",
        "onDidSetupWithJsonUrl",
        "onDidTriggerAdError",
        "onDidTriggerAdFinished",
        "onDidTriggerAdLoaded",
        "onDidTriggerAdLoadStart",
        "onDidTriggerAdNotFound",
        "onDidTriggerAdQuartile1",
        "onDidTriggerAdQuartile2",
        "onDidTriggerAdQuartile3",
        "onDidTriggerAdStarted",
        "onDidTriggerAllAdsCompleted",
        "onDidTriggerAutoPause",
        "onDidTriggerAutoPausePlay",
        "onDidTriggerCanPlay",
        "onDidTriggerCustomStatistics",
        "onDidTriggerDurationChange",
        "onDidTriggerEnded",
        "onDidTriggerFullscreen",
        "onDidTriggerMediaClipFailed",
        "onDidTriggerMediaClipLoaded",
        "onDidTriggerModeChange",
        "onDidTriggerPause",
        "onDidTriggerPhaseChange",
        "onDidTriggerPlay",
        "onDidTriggerPlaying",
        "onDidTriggerProjectLoaded",
        "onDidTriggerRetractFullscreen",
        "onDidTriggerSeeked",
        "onDidTriggerSeeking",
        "onDidTriggerStall",
        "onDidTriggerStateChange",
        "onDidTriggerViewFinished",
        "onDidTriggerViewStarted",
        "onDidTriggerVolumeChange",
      ])
    }
  }
}
