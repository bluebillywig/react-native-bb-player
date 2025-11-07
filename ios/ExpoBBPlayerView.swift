import BBNativePlayerKit
import ExpoModulesCore
import WebKit
import bbnativeshared
import os

class ExpoBBPlayerView: ExpoView, BBPlayerViewControllerDelegate {
  private var playerController: BBPlayerViewController = BBPlayerViewController()

  // Override intrinsicContentSize to tell React Native this view wants to fill available space
  override var intrinsicContentSize: CGSize {
    return CGSize(width: UIView.noIntrinsicMetric, height: UIView.noIntrinsicMetric)
  }

  private let onDidFailWithError = EventDispatcher()
  private let onDidRequestCollapse = EventDispatcher()
  private let onDidRequestExpand = EventDispatcher()
  private let onDidRequestOpenUrl = EventDispatcher()
  private let onDidSetupWithJsonUrl = EventDispatcher()
  private let onDidTriggerAdError = EventDispatcher()
  private let onDidTriggerAdFinished = EventDispatcher()
  private let onDidTriggerAdLoaded = EventDispatcher()
  private let onDidTriggerAdLoadStart = EventDispatcher()
  private let onDidTriggerAdNotFound = EventDispatcher()
  private let onDidTriggerAdQuartile1 = EventDispatcher()
  private let onDidTriggerAdQuartile2 = EventDispatcher()
  private let onDidTriggerAdQuartile3 = EventDispatcher()
  private let onDidTriggerAdStarted = EventDispatcher()
  private let onDidTriggerAllAdsCompleted = EventDispatcher()
  private let onDidTriggerAutoPause = EventDispatcher()
  private let onDidTriggerAutoPausePlay = EventDispatcher()
  private let onDidTriggerCanPlay = EventDispatcher()
  private let onDidTriggerCustomStatistics = EventDispatcher()
  private let onDidTriggerDurationChange = EventDispatcher()
  private let onDidTriggerEnded = EventDispatcher()
  private let onDidTriggerFullscreen = EventDispatcher()
  private let onDidTriggerMediaClipFailed = EventDispatcher()
  private let onDidTriggerMediaClipLoaded = EventDispatcher()
  private let onDidTriggerModeChange = EventDispatcher()
  private let onDidTriggerPause = EventDispatcher()
  private let onDidTriggerPhaseChange = EventDispatcher()
  private let onDidTriggerPlay = EventDispatcher()
  private let onDidTriggerPlaying = EventDispatcher()
  private let onDidTriggerProjectLoaded = EventDispatcher()
  private let onDidTriggerRetractFullscreen = EventDispatcher()
  private let onDidTriggerSeeked = EventDispatcher()
  private let onDidTriggerSeeking = EventDispatcher()
  private let onDidTriggerStall = EventDispatcher()
  private let onDidTriggerStateChange = EventDispatcher()
  private let onDidTriggerViewFinished = EventDispatcher()
  private let onDidTriggerViewStarted = EventDispatcher()
  private let onDidTriggerVolumeChange = EventDispatcher()
  private let onDidTriggerTimeUpdate = EventDispatcher()
  private let onDidTriggerApiReady = EventDispatcher()

  override func didMoveToWindow() {
    super.didMoveToWindow()

    if window != nil {
      // Ensure this view respects its frame from React Native layout
      self.clipsToBounds = false  // Allow settings overlay to render outside bounds

      addSubview(playerController.view)

      playerController.view.translatesAutoresizingMaskIntoConstraints = false

      NSLayoutConstraint.activate([
        playerController.view.topAnchor.constraint(equalTo: topAnchor),
        playerController.view.leadingAnchor.constraint(equalTo: leadingAnchor),
        playerController.view.trailingAnchor.constraint(equalTo: trailingAnchor),
        playerController.view.bottomAnchor.constraint(equalTo: bottomAnchor),
      ])

      playerController.setViewSize = self.setViewSize
      playerController.delegate = self

    } else if window == nil {
      playerController.view.removeFromSuperview()
      playerController.removeFromParent()

      playerController.delegate = nil
    }
  }

  func bbPlayerViewController(
    _ controller: BBPlayerViewController, didTriggerEvent event: BBPlayerEvent
  ) {
    switch event {
    case .requestCollapse:
      onDidRequestCollapse()

    case .requestExpand:
      onDidRequestExpand()

    case .failWithError(let error):
      onDidFailWithError(["payload": error as Any])

    case .requestOpenUrl(let url):
      onDidRequestOpenUrl(["payload": url as Any])

    case .setupWithJsonUrl(let url):
      onDidSetupWithJsonUrl(["payload": url as Any])

    case .adError(let error):
      onDidTriggerAdError(["payload": error as Any])

    case .adFinished:
      onDidTriggerAdFinished()

    case .adLoaded:
      onDidTriggerAdLoaded()

    case .adLoadStart:
      onDidTriggerAdLoadStart()

    case .adNotFound:
      onDidTriggerAdNotFound()

    case .adQuartile1:
      onDidTriggerAdQuartile1()

    case .adQuartile2:
      onDidTriggerAdQuartile2()

    case .adQuartile3:
      onDidTriggerAdQuartile3()

    case .adStarted:
      onDidTriggerAdStarted()

    case .allAdsCompleted:
      onDidTriggerAllAdsCompleted()

    case .autoPause(let why):
      onDidTriggerAutoPause(["why": why as Any])

    case .autoPausePlay(let why):
      onDidTriggerAutoPausePlay(["why": why as Any])

    case .canPlay:
      onDidTriggerCanPlay()

    case .customStatistics(let ident, let ev, let aux):
      onDidTriggerCustomStatistics([
        "ident": ident,
        "ev": ev,
        "aux": aux,
      ])

    case .durationChange(let duration):
      onDidTriggerDurationChange(["duration": duration as Any])

    case .ended:
      onDidTriggerEnded()

    case .fullscreen:
      onDidTriggerFullscreen()

    case .mediaClipFailed:
      onDidTriggerMediaClipFailed()

    case .mediaClipLoaded(let clipData):
      onDidTriggerMediaClipLoaded(clipData.toDictionary() as [String: Any])

    case .modeChange(let mode):
      onDidTriggerModeChange(["mode": mode as Any])

    case .pause:
      onDidTriggerPause()

    case .phaseChange(let phase):
      onDidTriggerPhaseChange(["phase": (phase?.name ?? nil) as Any])

    case .play:
      onDidTriggerPlay()

    case .playing:
      onDidTriggerPlaying()

    case .projectLoaded(let projectData):
      onDidTriggerProjectLoaded(projectData.toDictionary() as [String: Any])

    case .retractFullscreen:
      onDidTriggerRetractFullscreen()

    case .seeked(let seekOffset):
      onDidTriggerSeeked(["payload": seekOffset as Any])

    case .seeking:
      onDidTriggerSeeking()

    case .stall:
      onDidTriggerStall()

    case .stateChange(let state):
      onDidTriggerStateChange(["state": (state?.name ?? nil) as Any])

    case .viewFinished:
      onDidTriggerViewFinished()

    case .viewStarted:
      onDidTriggerViewStarted()

    case .volumeChange(let volume):
      onDidTriggerVolumeChange([
        "volume": volume,
        "muted": (volume == 0.0)
      ])

    case .apiReady:
      onDidTriggerApiReady()
    }
  }

  func setJsonUrl(_ url: String) {
    playerController.jsonUrl = url
  }

  func setOptions(_ options: [String: Any]) {
    playerController.options = options
  }

  func setupPlayer() {
    playerController.setupPlayer()
  }

  func adMediaHeight() -> Int? {
    return playerController.playerView?.player.adMediaHeight
  }

  func adMediaWidth() -> Int? {
    return playerController.playerView?.player.adMediaWidth
  }

  func adMediaClip() -> Any? {
    return playerController.playerView?.player.clipData?.toDictionary()
  }

  func controls() -> Bool? {
    return nil
  }

  func duration() -> Double? {
    return playerController.playerView?.player.duration
  }

  func inView() -> Bool? {
    return playerController.playerView?.player.inView
  }

  func mode() -> String? {
    return playerController.playerView?.player.mode
  }

  func muted() -> Bool? {
    return playerController.playerView?.player.muted
  }

  func phase() -> Any? {
    return playerController.playerView?.player.phase?.name
  }

  func playoutData() -> Any? {
    return playerController.playerView?.player.playoutData?.toDictionary()
  }

  func projectData() -> Any? {
    return playerController.playerView?.player.projectData?.toDictionary()
  }

  func state() -> Any? {
    return playerController.playerView?.player.state?.name
  }

  func volume() -> Float? {
    return playerController.playerView?.player.volume
  }

  func autoPlayNextCancel() {
    playerController.playerView?.player.autoPlayNextCancel()
  }

  func collapse() {
    playerController.playerView?.player.collapse()
  }

  func expand() {
    playerController.playerView?.player.expand()
  }

  func enterFullscreen() {
    // iOS SDK Note: The iOS SDK uses enterFullScreen() method
    playerController.playerView?.player.enterFullScreen()
  }

  func exitFullscreen() {
    // iOS SDK Note: The iOS SDK uses exitFullScreen() method
    playerController.playerView?.player.exitFullScreen()
  }

  func destroy() {
    // iOS SDK Note: The iOS SDK doesn't have a destroy() method
    // The player is automatically cleaned up when the view is removed
  }

  func pause() {
    playerController.playerView?.player.pause()
  }

  func play() {
    playerController.playerView?.player.play()
  }

  func seek(_ offsetInSeconds: Int) {
    playerController.playerView?.player.seek(offsetInSeconds: offsetInSeconds as NSNumber)
  }

  func setMuted(_ muted: Bool) {
    // Call setApiProperty directly to match setVolume pattern
    playerController.playerView?.setApiProperty(property: .muted, value: muted)
  }

  func setVolume(_ volume: Double) {
    // Call setApiProperty directly with Float to avoid Double->Float cast crash in SDK
    playerController.playerView?.setApiProperty(property: .volume, value: Float(volume))
  }

  func loadWithClipId(_ clipId: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerController.playerView?.player.loadWithClipId(clipId: clipId, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithClipListId(_ clipListId: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerController.playerView?.player.loadWithClipListId(clipListId: clipListId, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithProjectId(_ projectId: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerController.playerView?.player.loadWithProjectId(projectId: projectId, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithClipJson(_ clipJson: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerController.playerView?.player.loadWithClipJson(clipJson: clipJson, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithClipListJson(_ clipListJson: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerController.playerView?.player.loadWithClipListJson(clipListJson: clipListJson, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithProjectJson(_ projectJson: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerController.playerView?.player.loadWithProjectJson(projectJson: projectJson, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func showCastPicker() {
    // iOS SDK Note: Chromecast picker is shown via the cast button in the player UI
    // Direct programmatic access not available in current SDK version
  }
}
