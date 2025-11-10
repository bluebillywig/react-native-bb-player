import BBNativePlayerKit
import ExpoModulesCore
import WebKit
import bbnativeshared
import os
import GoogleCast

// MARK: - Logging Helper
private enum LogLevel {
  case debug
  case info
  case warning
  case error

  var osLogType: OSLogType {
    switch self {
    case .debug: return .debug
    case .info: return .info
    case .warning: return .default
    case .error: return .error
    }
  }
}

private func log(_ message: String, level: LogLevel = .debug) {
  #if DEBUG
  // In debug builds, log everything
  NSLog("ExpoBBPlayer: \(message)")
  #else
  // In release builds, only log warnings and errors
  if level == .warning || level == .error {
    NSLog("ExpoBBPlayer: \(message)")
  }
  #endif
}

class ExpoBBPlayerView: ExpoView, BBPlayerViewControllerDelegate {
  private var playerController: BBPlayerViewController = BBPlayerViewController()

  // Timer for periodic time updates (opt-in for performance)
  private var timeUpdateTimer: Timer?
  private var isPlaying: Bool = false
  private var currentDuration: Double = 0.0
  private var lastKnownTime: Double = 0.0
  private var enableTimeUpdates: Bool = false  // Default: disabled for better performance
  private var playbackStartTimestamp: TimeInterval = 0
  private var lastEmittedTime: Double = 0.0
  private var isInFullscreen: Bool = false
  // Independent Google Cast button for showing the cast picker
  private var independentCastButton: GCKUICastButton?

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
      log("ExpoBBPlayerView.didMoveToWindow - view added to window")
      // Ensure this view respects its frame from React Native layout
      self.clipsToBounds = false  // Allow settings overlay to render outside bounds

      // Find the parent view controller from the responder chain
      var parentVC: UIViewController?
      var responder = self.next
      while responder != nil {
        if let viewController = responder as? UIViewController {
          parentVC = viewController
          break
        }
        responder = responder?.next
      }

      // Add playerController as a child view controller for proper fullscreen support
      if let parentVC = parentVC {
        log("Found parent view controller: \(type(of: parentVC))")
        parentVC.addChild(playerController)
        addSubview(playerController.view)

        playerController.view.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
          playerController.view.topAnchor.constraint(equalTo: topAnchor),
          playerController.view.leadingAnchor.constraint(equalTo: leadingAnchor),
          playerController.view.trailingAnchor.constraint(equalTo: trailingAnchor),
          playerController.view.bottomAnchor.constraint(equalTo: bottomAnchor),
        ])

        playerController.didMove(toParent: parentVC)
        playerController.setViewSize = self.setViewSize
        playerController.delegate = self
        log("Player controller added to parent VC, delegate set to ExpoBBPlayerView")
      } else {
        log("WARNING - Could not find parent view controller!", level: .warning)
      }

    } else if window == nil {
      log("ExpoBBPlayerView.didMoveToWindow - view removed from window, isInFullscreen: \(isInFullscreen)")

      // Stop time update timer to save CPU/battery when view is not visible
      // Skip this during fullscreen transitions to avoid interrupting playback
      if !isInFullscreen {
        stopTimeUpdates()
      }

      // Don't tear down the view controller hierarchy when the view is removed from the window.
      // This happens during fullscreen transitions, and the SDK needs the hierarchy intact
      // to properly restore the player after exiting fullscreen.
      // React Native will handle actual cleanup when the component unmounts.
    }
  }

  // Start periodic time updates (1x per second, only if enabled)
  private func startTimeUpdates() {
    // Skip if time updates are disabled or timer already running
    guard enableTimeUpdates, timeUpdateTimer == nil else { return }

    timeUpdateTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
      guard let self = self, self.isPlaying else { return }

      // Calculate current time based on elapsed time since playback started
      let elapsedSeconds = Date().timeIntervalSince1970 - self.playbackStartTimestamp
      let estimatedTime = self.lastKnownTime + elapsedSeconds
      let currentTime = min(estimatedTime, self.currentDuration)

      // Only emit if we have valid time values and time changed significantly (>0.5s)
      // This reduces unnecessary bridge calls and React re-renders
      if self.currentDuration > 0 && abs(currentTime - self.lastEmittedTime) >= 0.5 {
        self.lastEmittedTime = currentTime
        self.onDidTriggerTimeUpdate([
          "currentTime": currentTime,
          "duration": self.currentDuration
        ])
      }
    }
  }

  // Stop periodic time updates
  private func stopTimeUpdates() {
    timeUpdateTimer?.invalidate()
    timeUpdateTimer = nil
  }

  // Clean up timers
  deinit {
    stopTimeUpdates()
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
      currentDuration = duration
      onDidTriggerDurationChange(["duration": duration as Any])

    case .ended:
      isPlaying = false
      stopTimeUpdates()
      onDidTriggerEnded()

    case .fullscreen:
      isInFullscreen = true
      onDidTriggerFullscreen()

    case .mediaClipFailed:
      onDidTriggerMediaClipFailed()

    case .mediaClipLoaded(let clipData):
      onDidTriggerMediaClipLoaded(clipData.toDictionary() as [String: Any])

    case .modeChange(let mode):
      onDidTriggerModeChange(["mode": mode as Any])

    case .pause:
      isPlaying = false
      stopTimeUpdates()
      onDidTriggerPause()

    case .phaseChange(let phase):
      onDidTriggerPhaseChange(["phase": (phase?.name ?? nil) as Any])

    case .play:
      onDidTriggerPlay()

    case .playing:
      isPlaying = true
      playbackStartTimestamp = Date().timeIntervalSince1970
      lastEmittedTime = 0.0  // Reset to ensure immediate time update on play
      startTimeUpdates()
      onDidTriggerPlaying()

    case .projectLoaded(let projectData):
      onDidTriggerProjectLoaded(projectData.toDictionary() as [String: Any])

    case .retractFullscreen:
      isInFullscreen = false
      onDidTriggerRetractFullscreen()

    case .seeked(let seekOffset):
      // Update lastKnownTime based on seek and reset playback timestamp
      lastKnownTime = seekOffset ?? 0.0
      playbackStartTimestamp = Date().timeIntervalSince1970
      lastEmittedTime = 0.0  // Reset to ensure immediate time update after seek
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
      // Note: We create the independent cast button lazily when needed, not during init
      // This avoids timing issues with Google Cast SDK initialization
      onDidTriggerApiReady()
    }
  }

  // Setup independent cast button that works alongside the SDK
  private func setupIndependentCastButton() {
    // CRITICAL: Check if Google Cast SDK is initialized before creating button
    if !GCKCastContext.isSharedInstanceInitialized() {
      log("ERROR - Cannot create cast button: Google Cast SDK not initialized yet", level: .error)
      return
    }

    log("Creating independent GCKUICastButton (SDK confirmed initialized)")

    // Create an independent GCKUICastButton separate from the SDK
    // This button will interact with the Google Cast SDK's session manager
    // The Blue Billywig SDK already listens to GCKSessionManager notifications
    // so it will automatically detect and handle any cast sessions we create
    independentCastButton = GCKUICastButton(frame: CGRect(x: -1000, y: -1000, width: 1, height: 1))

    guard let castButton = independentCastButton else {
      log("ERROR - Failed to create independent cast button", level: .error)
      return
    }

    // Add it to the view hierarchy but keep it invisible and offscreen
    // We need it in the hierarchy so it can present dialogs, but we don't want to see it
    castButton.alpha = 0.0  // Completely transparent
    castButton.isUserInteractionEnabled = false  // Can't be tapped
    addSubview(castButton)

    log("Successfully created and added independent GCKUICastButton to view hierarchy")
  }

  // Safe handler for cast button taps - uses an independent GCKUICastButton
  @objc private func handleCastButtonTap() {
    log("Cast button tapped")

    // CRITICAL: Verify Google Cast SDK is initialized before proceeding
    if !GCKCastContext.isSharedInstanceInitialized() {
      log("ERROR - Cast button tapped but Google Cast SDK not initialized yet", level: .error)
      return
    }

    // Create the button lazily on first use
    if independentCastButton == nil {
      setupIndependentCastButton()
    }

    guard let castButton = independentCastButton else {
      log("ERROR - Failed to create independent cast button", level: .error)
      return
    }

    // Trigger the button to show the cast device picker
    // When a device is selected, GCKSessionManager will notify the SDK
    log("Triggering independent GCKUICastButton to show cast picker")
    castButton.sendActions(for: .touchUpInside)
  }

  func setJsonUrl(_ url: String) {
    playerController.jsonUrl = url
  }

  func setOptions(_ options: [String: Any]) {
    playerController.options = options
  }

  func setEnableTimeUpdates(_ enabled: Bool) {
    enableTimeUpdates = enabled
    log("Time updates \(enabled ? "enabled" : "disabled")")

    // If disabling while timer is running, stop it
    if !enabled && timeUpdateTimer != nil {
      stopTimeUpdates()
    }
    // If enabling while playing, start it
    else if enabled && isPlaying && timeUpdateTimer == nil {
      startTimeUpdates()
    }
  }

  func setupPlayer() {
    log("ExpoBBPlayerView.setupPlayer() called with jsonUrl: \(playerController.jsonUrl)")
    playerController.setupPlayer()
    log("ExpoBBPlayerView.setupPlayer() completed")
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

  func currentTime() -> Double? {
    // Calculate estimated current time based on playback state
    // iOS SDK doesn't expose direct currentTime property, so we estimate it
    if isPlaying && playbackStartTimestamp > 0 {
      let elapsedSeconds = Date().timeIntervalSince1970 - playbackStartTimestamp
      let estimatedTime = lastKnownTime + elapsedSeconds
      return min(estimatedTime, currentDuration)
    } else {
      // When paused or not playing, return last known time
      return lastKnownTime
    }
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

  func seekRelative(_ offsetInSeconds: Double) {
    // Calculate current time based on playback state (similar to currentTime() method)
    let currentTime: Double
    if isPlaying && playbackStartTimestamp > 0 {
      let elapsedSeconds = Date().timeIntervalSince1970 - playbackStartTimestamp
      let estimatedTime = lastKnownTime + elapsedSeconds
      currentTime = min(estimatedTime, currentDuration)
    } else {
      // When paused or not playing, use last known time
      currentTime = lastKnownTime
    }

    // Calculate new position and clamp to valid range [0, duration]
    let newPosition = max(0, min(currentDuration, currentTime + offsetInSeconds))

    // Seek to the new position using the standard seek method
    playerController.playerView?.player.seek(offsetInSeconds: newPosition as NSNumber)
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
    log("showCastPicker called")

    // CRITICAL: Verify Google Cast SDK is initialized before proceeding
    if !GCKCastContext.isSharedInstanceInitialized() {
      log("ERROR - showCastPicker called but Google Cast SDK not initialized yet", level: .error)
      return
    }

    // Create the button lazily if it doesn't exist yet
    if independentCastButton == nil {
      setupIndependentCastButton()
    }

    guard let castButton = independentCastButton else {
      log("ERROR - independentCastButton is nil in showCastPicker", level: .error)
      return
    }

    // Trigger the independent cast button to show the cast device picker
    // This works with the SDK because they both use the shared GCKSessionManager
    DispatchQueue.main.async {
      log("showCastPicker triggering independent GCKUICastButton")
      castButton.sendActions(for: .touchUpInside)
    }
  }
}
