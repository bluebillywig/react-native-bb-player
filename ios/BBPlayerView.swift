import BBNativePlayerKit
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
  NSLog("BBPlayer: \(message)")
  #else
  // In release builds, only log warnings and errors
  if level == .warning || level == .error {
    NSLog("BBPlayer: \(message)")
  }
  #endif
}

class BBPlayerView: UIView, BBPlayerViewControllerDelegate {
  private var playerController: BBPlayerViewController = BBPlayerViewController()
  private var hasSetup: Bool = false

  // Timer for periodic time updates (opt-in for performance)
  private var timeUpdateTimer: Timer?
  private var isPlaying: Bool = false
  private var currentDuration: Double = 0.0
  private var lastKnownTime: Double = 0.0
  private var playbackStartTimestamp: CFTimeInterval = 0  // Use CFTimeInterval for CACurrentMediaTime
  private var lastEmittedTime: Double = 0.0
  private var isInFullscreen: Bool = false
  private var backgroundObserver: NSObjectProtocol?
  private var foregroundObserver: NSObjectProtocol?
  // Independent Google Cast button for showing the cast picker
  private var independentCastButton: GCKUICastButton?

  // MARK: - Props (set from React Native)

  @objc var jsonUrl: String = "" {
    didSet {
      playerController.jsonUrl = jsonUrl
      setupPlayerIfNeeded()
    }
  }

  @objc var options: NSDictionary = [:] {
    didSet {
      if let optionsDict = options as? [String: Any] {
        playerController.options = optionsDict
      }
      setupPlayerIfNeeded()
    }
  }

  @objc var enableTimeUpdates: Bool = false {
    didSet {
      log("Time updates \(enableTimeUpdates ? "enabled" : "disabled")")

      // If disabling while timer is running, stop it
      if !enableTimeUpdates && timeUpdateTimer != nil {
        stopTimeUpdates()
      }
      // If enabling while playing, start it
      else if enableTimeUpdates && isPlaying && timeUpdateTimer == nil {
        startTimeUpdates()
      }
    }
  }

  // MARK: - Event handlers (RCTDirectEventBlock)

  @objc var onDidFailWithError: RCTDirectEventBlock?
  @objc var onDidRequestCollapse: RCTDirectEventBlock?
  @objc var onDidRequestExpand: RCTDirectEventBlock?
  @objc var onDidRequestOpenUrl: RCTDirectEventBlock?
  @objc var onDidSetupWithJsonUrl: RCTDirectEventBlock?
  @objc var onDidTriggerAdError: RCTDirectEventBlock?
  @objc var onDidTriggerAdFinished: RCTDirectEventBlock?
  @objc var onDidTriggerAdLoaded: RCTDirectEventBlock?
  @objc var onDidTriggerAdLoadStart: RCTDirectEventBlock?
  @objc var onDidTriggerAdNotFound: RCTDirectEventBlock?
  @objc var onDidTriggerAdQuartile1: RCTDirectEventBlock?
  @objc var onDidTriggerAdQuartile2: RCTDirectEventBlock?
  @objc var onDidTriggerAdQuartile3: RCTDirectEventBlock?
  @objc var onDidTriggerAdStarted: RCTDirectEventBlock?
  @objc var onDidTriggerAllAdsCompleted: RCTDirectEventBlock?
  @objc var onDidTriggerAutoPause: RCTDirectEventBlock?
  @objc var onDidTriggerAutoPausePlay: RCTDirectEventBlock?
  @objc var onDidTriggerCanPlay: RCTDirectEventBlock?
  @objc var onDidTriggerCustomStatistics: RCTDirectEventBlock?
  @objc var onDidTriggerDurationChange: RCTDirectEventBlock?
  @objc var onDidTriggerEnded: RCTDirectEventBlock?
  @objc var onDidTriggerFullscreen: RCTDirectEventBlock?
  @objc var onDidTriggerMediaClipFailed: RCTDirectEventBlock?
  @objc var onDidTriggerMediaClipLoaded: RCTDirectEventBlock?
  @objc var onDidTriggerModeChange: RCTDirectEventBlock?
  @objc var onDidTriggerPause: RCTDirectEventBlock?
  @objc var onDidTriggerPhaseChange: RCTDirectEventBlock?
  @objc var onDidTriggerPlay: RCTDirectEventBlock?
  @objc var onDidTriggerPlaying: RCTDirectEventBlock?
  @objc var onDidTriggerProjectLoaded: RCTDirectEventBlock?
  @objc var onDidTriggerRetractFullscreen: RCTDirectEventBlock?
  @objc var onDidTriggerSeeked: RCTDirectEventBlock?
  @objc var onDidTriggerSeeking: RCTDirectEventBlock?
  @objc var onDidTriggerStall: RCTDirectEventBlock?
  @objc var onDidTriggerStateChange: RCTDirectEventBlock?
  @objc var onDidTriggerViewFinished: RCTDirectEventBlock?
  @objc var onDidTriggerViewStarted: RCTDirectEventBlock?
  @objc var onDidTriggerVolumeChange: RCTDirectEventBlock?
  @objc var onDidTriggerTimeUpdate: RCTDirectEventBlock?
  @objc var onDidTriggerApiReady: RCTDirectEventBlock?

  // Override intrinsicContentSize to tell React Native this view wants to fill available space
  override var intrinsicContentSize: CGSize {
    return CGSize(width: UIView.noIntrinsicMetric, height: UIView.noIntrinsicMetric)
  }

  private func setupPlayerIfNeeded() {
    // Only setup once we have both jsonUrl and we're in the window
    guard !jsonUrl.isEmpty, window != nil, !hasSetup else { return }
    hasSetup = true
    setupPlayer()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()

    if window != nil {
      log("BBPlayerView.didMoveToWindow - view added to window")
      // Ensure this view respects its frame from React Native layout
      self.clipsToBounds = false  // Allow settings overlay to render outside bounds

      // Set up lifecycle observers to pause timer when app goes to background (saves battery)
      setupAppLifecycleObservers()

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
        log("Player controller added to parent VC, delegate set to BBPlayerView")

        // Try to setup if we have jsonUrl
        setupPlayerIfNeeded()
      } else {
        log("WARNING - Could not find parent view controller!", level: .warning)
      }

    } else if window == nil {
      log("BBPlayerView.didMoveToWindow - view removed from window, isInFullscreen: \(isInFullscreen)")

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

  // Callback for height changes (used with allowCollapseExpand)
  private func setViewSize(_ size: CGSize) {
    // This is called by the player controller when the view size changes
    // In React Native, we generally let the parent handle sizing
  }

  // Start periodic time updates (1x per second, only if enabled)
  private func startTimeUpdates() {
    // Skip if time updates are disabled or timer already running
    guard enableTimeUpdates, timeUpdateTimer == nil else { return }

    timeUpdateTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
      guard let self = self, self.isPlaying else { return }

      // Use CACurrentMediaTime() instead of Date() - much more efficient (no system call overhead)
      let elapsedSeconds = CACurrentMediaTime() - self.playbackStartTimestamp
      let estimatedTime = self.lastKnownTime + elapsedSeconds
      let currentTime = min(estimatedTime, self.currentDuration)

      // Only emit if we have valid time values and time changed significantly (>0.5s)
      // This reduces unnecessary bridge calls and React re-renders
      if self.currentDuration > 0 && abs(currentTime - self.lastEmittedTime) >= 0.5 {
        self.lastEmittedTime = currentTime
        self.onDidTriggerTimeUpdate?([
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

  // Clean up timers, observers, and views to prevent memory leaks
  deinit {
    stopTimeUpdates()
    removeAppLifecycleObservers()
    independentCastButton?.removeFromSuperview()
    independentCastButton = nil
  }

  // MARK: - App Lifecycle Management (Battery Optimization)

  private func setupAppLifecycleObservers() {
    // Only set up once
    guard backgroundObserver == nil else { return }

    // Pause timer when app goes to background to save battery
    backgroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.didEnterBackgroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      guard let self = self else { return }
      // Save current time before pausing timer so we can resume accurately
      if self.isPlaying {
        self.lastKnownTime = self.calculateCurrentTime()
      }
      self.stopTimeUpdates()
      log("Timer paused - app entered background", level: .debug)
    }

    // Resume timer when app comes back to foreground
    foregroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.willEnterForegroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      guard let self = self else { return }
      if self.isPlaying && self.enableTimeUpdates {
        // Reset timestamp to now for accurate time calculation after background
        self.playbackStartTimestamp = CACurrentMediaTime()
        self.startTimeUpdates()
        log("Timer resumed - app entered foreground", level: .debug)
      }
    }
  }

  private func removeAppLifecycleObservers() {
    if let observer = backgroundObserver {
      NotificationCenter.default.removeObserver(observer)
      backgroundObserver = nil
    }
    if let observer = foregroundObserver {
      NotificationCenter.default.removeObserver(observer)
      foregroundObserver = nil
    }
  }

  func bbPlayerViewController(
    _ controller: BBPlayerViewController, didTriggerEvent event: BBPlayerEvent
  ) {
    switch event {
    case .requestCollapse:
      onDidRequestCollapse?([:])

    case .requestExpand:
      onDidRequestExpand?([:])

    case .failWithError(let error):
      onDidFailWithError?(["payload": error as Any])

    case .requestOpenUrl(let url):
      onDidRequestOpenUrl?(["payload": url as Any])

    case .setupWithJsonUrl(let url):
      onDidSetupWithJsonUrl?(["payload": url as Any])

    case .adError(let error):
      onDidTriggerAdError?(["payload": error as Any])

    case .adFinished:
      onDidTriggerAdFinished?([:])

    case .adLoaded:
      onDidTriggerAdLoaded?([:])

    case .adLoadStart:
      onDidTriggerAdLoadStart?([:])

    case .adNotFound:
      onDidTriggerAdNotFound?([:])

    case .adQuartile1:
      onDidTriggerAdQuartile1?([:])

    case .adQuartile2:
      onDidTriggerAdQuartile2?([:])

    case .adQuartile3:
      onDidTriggerAdQuartile3?([:])

    case .adStarted:
      onDidTriggerAdStarted?([:])

    case .allAdsCompleted:
      onDidTriggerAllAdsCompleted?([:])

    case .autoPause(let why):
      onDidTriggerAutoPause?(["why": why as Any])

    case .autoPausePlay(let why):
      onDidTriggerAutoPausePlay?(["why": why as Any])

    case .canPlay:
      onDidTriggerCanPlay?([:])

    case .customStatistics(let ident, let ev, let aux):
      onDidTriggerCustomStatistics?([
        "ident": ident,
        "ev": ev,
        "aux": aux,
      ])

    case .durationChange(let duration):
      currentDuration = duration
      onDidTriggerDurationChange?(["duration": duration as Any])

    case .ended:
      isPlaying = false
      stopTimeUpdates()
      onDidTriggerEnded?([:])

    case .fullscreen:
      isInFullscreen = true
      onDidTriggerFullscreen?([:])

    case .mediaClipFailed:
      onDidTriggerMediaClipFailed?([:])

    case .mediaClipLoaded(let clipData):
      onDidTriggerMediaClipLoaded?(clipData.toDictionary() as [String: Any])

    case .modeChange(let mode):
      onDidTriggerModeChange?(["mode": mode as Any])

    case .pause:
      isPlaying = false
      stopTimeUpdates()
      onDidTriggerPause?([:])

    case .phaseChange(let phase):
      onDidTriggerPhaseChange?(["phase": (phase?.name ?? nil) as Any])

    case .play:
      onDidTriggerPlay?([:])

    case .playing:
      isPlaying = true
      playbackStartTimestamp = CACurrentMediaTime()  // More efficient than Date()
      lastEmittedTime = 0.0  // Reset to ensure immediate time update on play
      lastKnownTime = calculateCurrentTime()  // Update to ensure accuracy between events
      startTimeUpdates()
      onDidTriggerPlaying?([:])

    case .projectLoaded(let projectData):
      onDidTriggerProjectLoaded?(projectData.toDictionary() as [String: Any])

    case .retractFullscreen:
      isInFullscreen = false
      // Note: Orientation reset is handled by BBPlayerViewController.bbNativePlayerView(didTriggerRetractFullscreen:)
      // to avoid duplicate calls which cause unnecessary CPU/GPU work
      onDidTriggerRetractFullscreen?([:])

    case .seeked(let seekOffset):
      // Update lastKnownTime based on seek and reset playback timestamp
      lastKnownTime = seekOffset ?? 0.0
      playbackStartTimestamp = CACurrentMediaTime()  // More efficient than Date()
      lastEmittedTime = 0.0  // Reset to ensure immediate time update after seek
      onDidTriggerSeeked?(["payload": seekOffset as Any])

    case .seeking:
      onDidTriggerSeeking?([:])

    case .stall:
      onDidTriggerStall?([:])

    case .stateChange(let state):
      onDidTriggerStateChange?(["state": (state?.name ?? nil) as Any])

    case .viewFinished:
      onDidTriggerViewFinished?([:])

    case .viewStarted:
      onDidTriggerViewStarted?([:])

    case .volumeChange(let volume):
      onDidTriggerVolumeChange?([
        "volume": volume,
        "muted": (volume == 0.0)
      ])

    case .apiReady:
      // Note: We create the independent cast button lazily when needed, not during init
      // This avoids timing issues with Google Cast SDK initialization
      onDidTriggerApiReady?([:])
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

  func setupPlayer() {
    log("BBPlayerView.setupPlayer() called with jsonUrl: \(playerController.jsonUrl)")
    playerController.setupPlayer()
    log("BBPlayerView.setupPlayer() completed")
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

  // MARK: - Private Helper Methods

  /// Calculate estimated current time based on playback state
  /// iOS SDK doesn't expose direct currentTime property, so we estimate it
  private func calculateCurrentTime() -> Double {
    if isPlaying && playbackStartTimestamp > 0 {
      // Use CACurrentMediaTime() - more efficient than Date() (no system call overhead)
      let elapsedSeconds = CACurrentMediaTime() - playbackStartTimestamp
      let estimatedTime = lastKnownTime + elapsedSeconds
      return min(estimatedTime, currentDuration)
    } else {
      // When paused or not playing, return last known time
      return lastKnownTime
    }
  }

  func currentTime() -> Double? {
    return calculateCurrentTime()
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
    enterFullscreenWithLandscapeForce(forceLandscape: false)
  }

  func enterFullscreenLandscape() {
    enterFullscreenWithLandscapeForce(forceLandscape: true)
  }

  private func enterFullscreenWithLandscapeForce(forceLandscape: Bool) {
    // CRITICAL FIX: Set goingFullScreen flag on BBNativePlayerViewController
    // The SDK's BBNativePlayerViewController.supportedInterfaceOrientations only returns
    // .allButUpsideDown when goingFullScreen == true. Without this, the fullscreen modal
    // is stuck in portrait orientation.
    if let playerView = playerController.playerView?.player as? NSObject {
      // Access the private bbNativePlayerViewController using Key-Value Coding
      if let bbViewController = playerView.value(forKey: "bbNativePlayerViewController") as? NSObject {
        bbViewController.setValue(true, forKey: "goingFullScreen")
        log("Set goingFullScreen = true on BBNativePlayerViewController before enterFullScreen", level: .info)
      } else {
        log("WARNING: Could not access bbNativePlayerViewController to set goingFullScreen flag", level: .warning)
      }
    }

    // iOS SDK Note: The iOS SDK uses enterFullScreen() method
    playerController.playerView?.player.enterFullScreen()

    // For landscape mode, force rotation after fullscreen is presented
    if forceLandscape {
      // Use a small delay to ensure fullscreen modal is presented before rotating
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
        if #available(iOS 16.0, *) {
          if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            windowScene.requestGeometryUpdate(.iOS(interfaceOrientations: .landscape))
            log("Requested landscape rotation", level: .info)

            // Also update the supported orientations for the fullscreen view controller
            if let playerView = self?.playerController.playerView?.player as? NSObject {
              if let bbViewController = playerView.value(forKey: "bbNativePlayerViewController") as? NSObject {
                if let avPlayerVC = bbViewController.value(forKey: "avPlayerViewController") as? UIViewController {
                  avPlayerVC.setNeedsUpdateOfSupportedInterfaceOrientations()
                  log("Updated supported orientations for AVPlayerViewController", level: .info)
                }
              }
            }
          }
        } else {
          log("WARNING: requestGeometryUpdate requires iOS 16+, landscape rotation not available", level: .warning)
        }
      }
    }
  }

  func exitFullscreen() {
    // iOS SDK Note: The iOS SDK uses exitFullScreen() method
    // Orientation reset is handled by BBPlayerViewController.bbNativePlayerView(didTriggerRetractFullscreen:)
    // to avoid duplicate orientation update calls which cause unnecessary CPU/GPU work
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
    // Use the shared time calculation helper
    let currentTime = calculateCurrentTime()

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

  // Note: loadWithShortsId is NOT supported on BBPlayerView.
  // For Shorts playback, use the BBShortsView component instead.

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
