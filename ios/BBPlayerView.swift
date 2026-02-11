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

// MARK: - BBPlayerView
// Simplified architecture: BBPlayerView directly hosts BBNativePlayerView without intermediate view controller
// This reduces view hierarchy depth and eliminates extra layout passes for better performance/battery life

class BBPlayerView: UIView, BBNativePlayerViewDelegate {
  // Direct reference to SDK player view (no intermediate view controller)
  private var playerView: BBNativePlayerView?
  private var hasSetup: Bool = false

  // Timer for periodic time updates (opt-in for performance)
  private var timeUpdateTimer: Timer?
  private var isPlaying: Bool = false
  private var currentDuration: Double = 0.0
  private var lastKnownTime: Double = 0.0
  private var playbackStartTimestamp: CFTimeInterval = 0
  private var lastEmittedTime: Double = 0.0
  private var isInFullscreen: Bool = false
  private var backgroundObserver: NSObjectProtocol?
  private var foregroundObserver: NSObjectProtocol?
  // Independent Google Cast button for showing the cast picker
  private var independentCastButton: GCKUICastButton?
  // Store parent view controller reference for SDK
  private weak var parentViewController: UIViewController?

  // MARK: - Props (set from React Native)

  @objc var jsonUrl: String = "" {
    didSet {
      setupPlayerIfNeeded()
    }
  }

  @objc var options: NSDictionary = [:] {
    didSet {
      setupPlayerIfNeeded()
    }
  }

  @objc var enableTimeUpdates: Bool = false {
    didSet {
      log("Time updates \(enableTimeUpdates ? "enabled" : "disabled")")

      if !enableTimeUpdates && timeUpdateTimer != nil {
        stopTimeUpdates()
      } else if enableTimeUpdates && isPlaying && timeUpdateTimer == nil {
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

  override var intrinsicContentSize: CGSize {
    return CGSize(width: UIView.noIntrinsicMetric, height: UIView.noIntrinsicMetric)
  }

  private func setupPlayerIfNeeded() {
    guard !jsonUrl.isEmpty, window != nil, !hasSetup else { return }
    hasSetup = true
    setupPlayer()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()

    if window != nil {
      log("BBPlayerView.didMoveToWindow - view added to window")
      self.clipsToBounds = false

      // Optimize layer for video playback - reduce compositing overhead
      self.layer.isOpaque = true
      self.layer.drawsAsynchronously = true
      self.isOpaque = true

      // Register with view registry for command dispatch (supports New Architecture)
      if let tag = self.reactTag {
        BBPlayerViewRegistry.shared.register(self, tag: tag.intValue)
      }

      setupAppLifecycleObservers()

      // Find the parent view controller from the responder chain
      var responder = self.next
      while responder != nil {
        if let viewController = responder as? UIViewController {
          parentViewController = viewController
          break
        }
        responder = responder?.next
      }

      if parentViewController != nil {
        log("Found parent view controller: \(type(of: parentViewController!))")
      } else {
        log("WARNING - Could not find parent view controller!", level: .warning)
      }

      setupPlayerIfNeeded()
    } else {
      log("BBPlayerView.didMoveToWindow - view removed from window, isInFullscreen: \(isInFullscreen)")

      // Unregister from view registry when removed from window (unless in fullscreen)
      if !isInFullscreen, let tag = self.reactTag {
        BBPlayerViewRegistry.shared.unregister(tag: tag.intValue)
      }

      if !isInFullscreen {
        stopTimeUpdates()
      }
    }
  }

  // Start periodic time updates (1x per second, only if enabled)
  private func startTimeUpdates() {
    guard enableTimeUpdates, timeUpdateTimer == nil else { return }

    timeUpdateTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
      guard let self = self, self.isPlaying else { return }

      let elapsedSeconds = CACurrentMediaTime() - self.playbackStartTimestamp
      let estimatedTime = self.lastKnownTime + elapsedSeconds
      let currentTime = min(estimatedTime, self.currentDuration)

      if self.currentDuration > 0 && abs(currentTime - self.lastEmittedTime) >= 0.5 {
        self.lastEmittedTime = currentTime
        self.onDidTriggerTimeUpdate?([
          "currentTime": currentTime,
          "duration": self.currentDuration
        ])
      }
    }
  }

  private func stopTimeUpdates() {
    timeUpdateTimer?.invalidate()
    timeUpdateTimer = nil
  }

  deinit {
    // Unregister from view registry
    if let tag = self.reactTag {
      BBPlayerViewRegistry.shared.unregister(tag: tag.intValue)
    }
    stopTimeUpdates()
    removeAppLifecycleObservers()
    independentCastButton?.removeFromSuperview()
    independentCastButton = nil
  }

  // MARK: - App Lifecycle Management

  private func setupAppLifecycleObservers() {
    guard backgroundObserver == nil else { return }

    backgroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.didEnterBackgroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      guard let self = self else { return }
      if self.isPlaying {
        self.lastKnownTime = self.calculateCurrentTime()
      }
      self.stopTimeUpdates()
      log("Timer paused - app entered background", level: .debug)
    }

    foregroundObserver = NotificationCenter.default.addObserver(
      forName: UIApplication.willEnterForegroundNotification,
      object: nil,
      queue: .main
    ) { [weak self] _ in
      guard let self = self else { return }
      if self.isPlaying && self.enableTimeUpdates {
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

  // MARK: - Player Setup (Simplified - no intermediate view controller)

  func setupPlayer() {
    guard let parentVC = parentViewController else {
      log("ERROR - Cannot setup player without parent view controller", level: .error)
      return
    }

    log("BBPlayerView.setupPlayer() - creating player with jsonUrl: \(jsonUrl)")

    // Remove any existing player view
    playerView?.removeFromSuperview()

    // Convert options dictionary
    var optionsDict: [String: Any] = [:]
    if let opts = options as? [String: Any] {
      optionsDict = opts
    }

    // Create player view directly using SDK factory method
    // Pass the parent view controller so SDK can present fullscreen modals
    playerView = BBNativePlayer.createPlayerView(
      uiViewController: parentVC,
      frame: bounds,
      jsonUrl: jsonUrl,
      options: optionsDict
    )

    if let pv = playerView {
      // Add player view directly to BBPlayerView (no intermediate view controller)
      addSubview(pv)

      pv.translatesAutoresizingMaskIntoConstraints = false
      NSLayoutConstraint.activate([
        pv.topAnchor.constraint(equalTo: topAnchor),
        pv.leadingAnchor.constraint(equalTo: leadingAnchor),
        pv.trailingAnchor.constraint(equalTo: trailingAnchor),
        pv.bottomAnchor.constraint(equalTo: bottomAnchor)
      ])

      // Set ourselves as the delegate directly
      pv.delegate = self

      log("Player view created and added directly to BBPlayerView")
    } else {
      log("ERROR - playerView is nil after createPlayerView!", level: .error)
    }
  }

  // MARK: - BBNativePlayerViewDelegate Implementation

  func bbNativePlayerView(didRequestCollapse playerView: BBNativePlayerView) {
    onDidRequestCollapse?([:])
  }

  func bbNativePlayerView(didRequestExpand playerView: BBNativePlayerView) {
    onDidRequestExpand?([:])
  }

  func bbNativePlayerView(playerView: BBNativePlayerView, didFailWithError error: String?) {
    onDidFailWithError?(["payload": error as Any])
  }

  func didRequestOpenUrl(url: String?) {
    onDidRequestOpenUrl?(["payload": url as Any])
  }

  func didSetupWithJsonUrl(url: String?) {
    onDidSetupWithJsonUrl?(["payload": url as Any])
  }

  func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerAdError error: String?) {
    onDidTriggerAdError?(["payload": error as Any])
  }

  func bbNativePlayerView(didTriggerAdFinished playerView: BBNativePlayerView) {
    onDidTriggerAdFinished?([:])
  }

  func bbNativePlayerView(didTriggerAdLoadStart playerView: BBNativePlayerView) {
    onDidTriggerAdLoadStart?([:])
  }

  func bbNativePlayerView(didTriggerAdLoaded playerView: BBNativePlayerView) {
    onDidTriggerAdLoaded?([:])
  }

  func bbNativePlayerView(didTriggerAdNotFound playerView: BBNativePlayerView) {
    onDidTriggerAdNotFound?([:])
  }

  func bbNativePlayerView(didTriggerAdQuartile1 playerView: BBNativePlayerView) {
    onDidTriggerAdQuartile1?([:])
  }

  func bbNativePlayerView(didTriggerAdQuartile2 playerView: BBNativePlayerView) {
    onDidTriggerAdQuartile2?([:])
  }

  func bbNativePlayerView(didTriggerAdQuartile3 playerView: BBNativePlayerView) {
    onDidTriggerAdQuartile3?([:])
  }

  func bbNativePlayerView(didTriggerAdStarted playerView: BBNativePlayerView) {
    onDidTriggerAdStarted?([:])
  }

  func bbNativePlayerView(didTriggerAllAdsCompleted playerView: BBNativePlayerView) {
    onDidTriggerAllAdsCompleted?([:])
  }

  func bbNativePlayerView(didTriggerAutoPause playerView: BBNativePlayerView) {
    onDidTriggerAutoPause?([:])
  }

  func bbNativePlayerView(didTriggerAutoPausePlay playerView: BBNativePlayerView) {
    onDidTriggerAutoPausePlay?([:])
  }

  func bbNativePlayerView(didTriggerCanPlay playerView: BBNativePlayerView) {
    onDidTriggerCanPlay?([:])
  }

  func bbNativePlayerView(
    didTriggerCustomStatistics playerView: BBNativePlayerView, ident: String, ev: String,
    aux: [String: String]
  ) {
    onDidTriggerCustomStatistics?([
      "ident": ident,
      "ev": ev,
      "aux": aux,
    ])
  }

  func bbNativePlayerView(
    playerView: BBNativePlayerView, didTriggerDurationChange duration: Double
  ) {
    currentDuration = duration
    onDidTriggerDurationChange?(["duration": duration as Any])
  }

  func bbNativePlayerView(didTriggerEnded playerView: BBNativePlayerView) {
    isPlaying = false
    stopTimeUpdates()
    onDidTriggerEnded?([:])
  }

  func bbNativePlayerView(didTriggerFullscreen playerView: BBNativePlayerView) {
    isInFullscreen = true
    log("FULLSCREEN ENTRY")

    // Enable landscape orientation for fullscreen
    if let orientationLockClass = NSClassFromString("OrientationLock") as? NSObject.Type {
      orientationLockClass.setValue(true, forKey: "isFullscreen")
    }

    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
      guard let self = self, let parentVC = self.parentViewController else { return }
      if let presentedVC = parentVC.presentedViewController {
        if #available(iOS 16.0, *) {
          presentedVC.setNeedsUpdateOfSupportedInterfaceOrientations()
        }
        UIViewController.attemptRotationToDeviceOrientation()
      }
    }

    onDidTriggerFullscreen?([:])
  }

  func bbNativePlayerView(didTriggerMediaClipFailed playerView: BBNativePlayerView) {
    onDidTriggerMediaClipFailed?([:])
  }

  func bbNativePlayerView(
    playerView: BBNativePlayerView, didTriggerMediaClipLoaded data: MediaClip
  ) {
    onDidTriggerMediaClipLoaded?(data.toDictionary() as [String: Any])
  }

  func bbNativePlayerView(didTriggerModeChange playerView: BBNativePlayerView, mode: String?) {
    onDidTriggerModeChange?(["mode": mode as Any])
  }

  func bbNativePlayerView(didTriggerPause playerView: BBNativePlayerView) {
    isPlaying = false
    stopTimeUpdates()
    onDidTriggerPause?([:])
  }

  func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerPhaseChange phase: Phase?) {
    onDidTriggerPhaseChange?(["phase": (phase?.name ?? nil) as Any])
  }

  func bbNativePlayerView(didTriggerPlay playerView: BBNativePlayerView) {
    onDidTriggerPlay?([:])
  }

  func bbNativePlayerView(didTriggerPlaying playerView: BBNativePlayerView) {
    isPlaying = true
    playbackStartTimestamp = CACurrentMediaTime()
    lastEmittedTime = 0.0
    lastKnownTime = calculateCurrentTime()
    startTimeUpdates()
    onDidTriggerPlaying?([:])
  }

  func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerProjectLoaded data: Project) {
    onDidTriggerProjectLoaded?(data.toDictionary() as [String: Any])
  }

  func bbNativePlayerView(didTriggerRetractFullscreen playerView: BBNativePlayerView) {
    isInFullscreen = false
    log("FULLSCREEN EXIT")

    // Disable landscape orientation
    if let orientationLockClass = NSClassFromString("OrientationLock") as? NSObject.Type {
      orientationLockClass.setValue(false, forKey: "isFullscreen")
    }

    // Force rotation back to portrait
    if #available(iOS 16.0, *) {
      if let windowScene = window?.windowScene {
        windowScene.requestGeometryUpdate(.iOS(interfaceOrientations: .portrait))
      }
    } else {
      UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
    }

    UIViewController.attemptRotationToDeviceOrientation()

    onDidTriggerRetractFullscreen?([:])
  }

  func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerSeeked seekOffset: Double) {
    lastKnownTime = seekOffset
    playbackStartTimestamp = CACurrentMediaTime()
    lastEmittedTime = 0.0
    onDidTriggerSeeked?(["payload": seekOffset as Any])
  }

  func bbNativePlayerView(didTriggerSeeking playerView: BBNativePlayerView) {
    onDidTriggerSeeking?([:])
  }

  func bbNativePlayerView(didTriggerStall playerView: BBNativePlayerView) {
    onDidTriggerStall?([:])
  }

  func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerStateChange state: State?) {
    onDidTriggerStateChange?(["state": (state?.name ?? nil) as Any])
  }

  func bbNativePlayerView(didTriggerViewFinished playerView: BBNativePlayerView) {
    onDidTriggerViewFinished?([:])
  }

  func bbNativePlayerView(didTriggerViewStarted playerView: BBNativePlayerView) {
    onDidTriggerViewStarted?([:])
  }

  func bbNativePlayerView(didTriggerVolumeChange playerView: BBNativePlayerView, volume: Double) {
    onDidTriggerVolumeChange?([
      "volume": volume,
      "muted": (volume == 0.0)
    ])
  }

  func bbNativePlayerView(didTriggerApiReady playerView: BBNativePlayerView) {
    onDidTriggerApiReady?([:])
  }

  // MARK: - Cast Button Setup

  private func setupIndependentCastButton() {
    if !GCKCastContext.isSharedInstanceInitialized() {
      log("ERROR - Cannot create cast button: Google Cast SDK not initialized yet", level: .error)
      return
    }

    independentCastButton = GCKUICastButton(frame: CGRect(x: -1000, y: -1000, width: 1, height: 1))

    guard let castButton = independentCastButton else {
      log("ERROR - Failed to create independent cast button", level: .error)
      return
    }

    castButton.alpha = 0.0
    castButton.isUserInteractionEnabled = false
    addSubview(castButton)
  }

  // MARK: - Private Helper Methods

  private func calculateCurrentTime() -> Double {
    if isPlaying && playbackStartTimestamp > 0 {
      let elapsedSeconds = CACurrentMediaTime() - playbackStartTimestamp
      let estimatedTime = lastKnownTime + elapsedSeconds
      return min(estimatedTime, currentDuration)
    } else {
      return lastKnownTime
    }
  }

  // MARK: - Public API Methods

  func adMediaHeight() -> Int? {
    return playerView?.player.adMediaHeight
  }

  func adMediaWidth() -> Int? {
    return playerView?.player.adMediaWidth
  }

  func clipData() -> Any? {
    return playerView?.player.clipData?.toDictionary()
  }

  func controls() -> Bool? {
    return nil
  }

  func currentTime() -> Double? {
    return calculateCurrentTime()
  }

  func duration() -> Double? {
    return playerView?.player.duration
  }

  func inView() -> Bool? {
    return playerView?.player.inView
  }

  func mode() -> String? {
    return playerView?.player.mode
  }

  func muted() -> Bool? {
    return playerView?.player.muted
  }

  func phase() -> Any? {
    return playerView?.player.phase?.name
  }

  func playoutData() -> Any? {
    return playerView?.player.playoutData?.toDictionary()
  }

  func projectData() -> Any? {
    return playerView?.player.projectData?.toDictionary()
  }

  func state() -> Any? {
    return playerView?.player.state?.name
  }

  func volume() -> Float? {
    return playerView?.player.volume
  }

  func autoPlayNextCancel() {
    playerView?.player.autoPlayNextCancel()
  }

  func collapse() {
    playerView?.player.collapse()
  }

  func expand() {
    playerView?.player.expand()
  }

  func presentModal() {
    guard let parentVC = parentViewController else {
      log("Cannot present modal - no parent view controller", level: .warning)
      return
    }
    isInFullscreen = true
    playerView?.player.presentModal(uiViewController: parentVC, animated: true)
  }

  func closeModal() {
    playerView?.player.closeModalPlayer()
    isInFullscreen = false
  }

  func enterFullscreen() {
    enterFullscreenWithLandscapeForce(forceLandscape: false)
  }

  func enterFullscreenLandscape() {
    enterFullscreenWithLandscapeForce(forceLandscape: true)
  }

  private func enterFullscreenWithLandscapeForce(forceLandscape: Bool) {
    // Set goingFullScreen flag on BBNativePlayerViewController for proper orientation support
    if let player = playerView?.player as? NSObject {
      if let bbViewController = player.value(forKey: "bbNativePlayerViewController") as? NSObject {
        bbViewController.setValue(true, forKey: "goingFullScreen")
        log("Set goingFullScreen = true on BBNativePlayerViewController", level: .info)
      }
    }

    playerView?.player.enterFullScreen()

    if forceLandscape {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
        if #available(iOS 16.0, *) {
          if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            windowScene.requestGeometryUpdate(.iOS(interfaceOrientations: .landscape))
            log("Requested landscape rotation", level: .info)
          }
        }
      }
    }
  }

  func exitFullscreen() {
    playerView?.player.exitFullScreen()
  }

  func destroy() {
    // iOS SDK cleans up automatically when view is removed
  }

  func pause() {
    playerView?.player.pause()
  }

  func play() {
    playerView?.player.play()
  }

  func seek(_ offsetInSeconds: Int) {
    playerView?.player.seek(offsetInSeconds: offsetInSeconds as NSNumber)
  }

  func seekRelative(_ offsetInSeconds: Double) {
    let currentTime = calculateCurrentTime()
    let newPosition = max(0, min(currentDuration, currentTime + offsetInSeconds))
    playerView?.player.seek(offsetInSeconds: newPosition as NSNumber)
  }

  func setMuted(_ muted: Bool) {
    playerView?.setApiProperty(property: .muted, value: muted)
  }

  func setVolume(_ volume: Double) {
    playerView?.setApiProperty(property: .volume, value: Float(volume))
  }

  func loadWithClipId(_ clipId: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerView?.player.loadWithClipId(clipId: clipId, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithClipListId(_ clipListId: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerView?.player.loadWithClipListId(clipListId: clipListId, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithProjectId(_ projectId: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerView?.player.loadWithProjectId(projectId: projectId, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithClipJson(_ clipJson: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerView?.player.loadWithClipJson(clipJson: clipJson, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithClipListJson(_ clipListJson: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerView?.player.loadWithClipListJson(clipListJson: clipListJson, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  func loadWithProjectJson(_ projectJson: String, initiator: String?, autoPlay: Bool?, seekTo: Double?) {
    playerView?.player.loadWithProjectJson(projectJson: projectJson, initiator: initiator, autoPlay: autoPlay, seekTo: seekTo as NSNumber?)
  }

  /**
   * Load content from a JSON URL into the existing player.
   * Extracts IDs from the URL and uses the native SDK's loadWithXxxId methods.
   * This is more reliable than parsing JSON because the SDK handles all the loading internally.
   *
   * Note: Shorts URLs (/sh/{id}.json) are NOT supported here - use BBShortsView instead.
   */
  func loadWithJsonUrl(_ url: String, autoPlay: Bool) {
    NSLog("BBPlayerView.loadWithJsonUrl called - url: %@, autoPlay: %d", url, autoPlay)
    guard playerView != nil else {
      NSLog("BBPlayerView.loadWithJsonUrl ERROR - playerView not initialized")
      return
    }

    NSLog("BBPlayerView.loadWithJsonUrl - playerView exists, parsing URL")

    // Extract ID from URL patterns like:
    // /c/{id}.json or /mediaclip/{id}.json -> clip ID
    // /l/{id}.json or /mediacliplist/{id}.json -> clip list ID
    // /pj/{id}.json or /project/{id}.json -> project ID

    let clipIdPattern = "/c/([0-9]+)\\.json|/mediaclip/([0-9]+)"
    let clipListIdPattern = "/l/([0-9]+)\\.json|/mediacliplist/([0-9]+)"
    let projectIdPattern = "/pj/([0-9]+)\\.json|/project/([0-9]+)"
    let shortsIdPattern = "/sh/([0-9]+)\\.json"

    if let shortsMatch = url.range(of: shortsIdPattern, options: .regularExpression) {
      // Shorts require a separate BBShortsView component
      log("ERROR - Shorts URLs are not supported in BBPlayerView. Use BBShortsView instead.", level: .error)
      onDidFailWithError?(["payload": "Shorts URLs are not supported in BBPlayerView. Use BBShortsView instead."])
      return
    }

    if let match = url.range(of: clipListIdPattern, options: .regularExpression) {
      // Extract the cliplist ID
      if let clipListId = extractIdFromUrl(url, pattern: clipListIdPattern) {
        NSLog("BBPlayerView.loadWithJsonUrl - Loading ClipList by ID: %@", clipListId)
        playerView?.player.loadWithClipListId(clipListId: clipListId, initiator: "external", autoPlay: autoPlay, seekTo: nil)
      } else {
        NSLog("BBPlayerView.loadWithJsonUrl ERROR - Failed to extract cliplist ID from URL: %@", url)
      }
      return
    }

    if let match = url.range(of: projectIdPattern, options: .regularExpression) {
      // Extract the project ID
      if let projectId = extractIdFromUrl(url, pattern: projectIdPattern) {
        NSLog("BBPlayerView.loadWithJsonUrl - Loading Project by ID: %@", projectId)
        playerView?.player.loadWithProjectId(projectId: projectId, initiator: "external", autoPlay: autoPlay, seekTo: nil)
      } else {
        NSLog("BBPlayerView.loadWithJsonUrl ERROR - Failed to extract project ID from URL: %@", url)
      }
      return
    }

    if let match = url.range(of: clipIdPattern, options: .regularExpression) {
      // Extract the clip ID
      if let clipId = extractIdFromUrl(url, pattern: clipIdPattern) {
        NSLog("BBPlayerView.loadWithJsonUrl - Loading Clip by ID: %@", clipId)
        playerView?.player.loadWithClipId(clipId: clipId, initiator: "external", autoPlay: autoPlay, seekTo: nil)
      } else {
        NSLog("BBPlayerView.loadWithJsonUrl ERROR - Failed to extract clip ID from URL: %@", url)
      }
      return
    }

    NSLog("BBPlayerView.loadWithJsonUrl ERROR - Unknown URL format, cannot extract ID: %@", url)
    onDidFailWithError?(["payload": "Cannot load content: unsupported URL format"])
  }

  /**
   * Helper to extract numeric ID from URL using regex pattern with capture groups
   */
  private func extractIdFromUrl(_ url: String, pattern: String) -> String? {
    do {
      let regex = try NSRegularExpression(pattern: pattern, options: [])
      let range = NSRange(url.startIndex..., in: url)
      if let match = regex.firstMatch(in: url, options: [], range: range) {
        // Try each capture group (pattern has multiple alternatives with |)
        for i in 1..<match.numberOfRanges {
          if let groupRange = Range(match.range(at: i), in: url) {
            let extracted = String(url[groupRange])
            if !extracted.isEmpty {
              return extracted
            }
          }
        }
      }
    } catch {
      log("ERROR - Regex error: \(error)", level: .error)
    }
    return nil
  }

  func showCastPicker() {
    log("showCastPicker called")

    if !GCKCastContext.isSharedInstanceInitialized() {
      log("ERROR - showCastPicker called but Google Cast SDK not initialized yet", level: .error)
      return
    }

    if independentCastButton == nil {
      setupIndependentCastButton()
    }

    guard let castButton = independentCastButton else {
      log("ERROR - independentCastButton is nil in showCastPicker", level: .error)
      return
    }

    DispatchQueue.main.async {
      log("showCastPicker triggering independent GCKUICastButton")
      castButton.sendActions(for: .touchUpInside)
    }
  }
}
