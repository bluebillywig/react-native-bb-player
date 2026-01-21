import BBNativePlayerKit
import bbnativeshared
import os

// MARK: - Logging Helper
private func log(_ message: String, level: LogLevel = .debug) {
  #if DEBUG
  // In debug builds, log everything
  NSLog("BBShorts: \(message)")
  #else
  // In release builds, only log warnings and errors
  if level == .warning || level == .error {
    NSLog("BBShorts: \(message)")
  }
  #endif
}

private enum LogLevel {
  case debug
  case info
  case warning
  case error
}

/**
 * React Native View for Blue Billywig Native Shorts
 *
 * This is a separate component from BBPlayerView specifically for Shorts playback.
 * Shorts use a different native SDK view (BBNativeShortsView) that supports
 * vertical swipe navigation and TikTok-style full-screen video experience.
 *
 * Usage:
 * ```tsx
 * <BBShortsView
 *   jsonUrl="https://demo.bbvms.com/sh/58.json"
 *   onDidSetupWithJsonUrl={(url) => console.log('Shorts loaded:', url)}
 *   onDidFailWithError={(error) => console.error('Error:', error)}
 * />
 * ```
 */
class BBShortsView: UIView, BBNativeShortsViewDelegate {
  private var shortsView: BBNativeShortsView?
  private var hasSetup: Bool = false

  // MARK: - Props (set from React Native)

  @objc var jsonUrl: String = "" {
    didSet {
      // If URL changed and we already have a shorts view, recreate it
      if oldValue != jsonUrl && hasSetup {
        log("jsonUrl changed from \(oldValue) to \(jsonUrl) - recreating shorts view")
        destroy()
        setupShortsIfNeeded()
      } else {
        setupShortsIfNeeded()
      }
    }
  }

  @objc var options: NSDictionary = [:] {
    didSet {
      setupShortsIfNeeded()
    }
  }

  // MARK: - Event handlers (RCTDirectEventBlock)

  @objc var onDidSetupWithJsonUrl: RCTDirectEventBlock?
  @objc var onDidFailWithError: RCTDirectEventBlock?
  @objc var onDidTriggerResize: RCTDirectEventBlock?

  // Override intrinsicContentSize to tell React Native this view wants to fill available space
  override var intrinsicContentSize: CGSize {
    return CGSize(width: UIView.noIntrinsicMetric, height: UIView.noIntrinsicMetric)
  }

  private func setupShortsIfNeeded() {
    // Only setup once we have both jsonUrl and we're in the window
    guard !jsonUrl.isEmpty, window != nil, !hasSetup else { return }
    hasSetup = true
    setupShorts()
  }

  override func didMoveToWindow() {
    super.didMoveToWindow()

    if window != nil {
      log("BBShortsView.didMoveToWindow - view added to window")
      // Ensure this view respects its frame from React Native layout
      self.clipsToBounds = true

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

      if parentVC != nil {
        log("Found parent view controller: \(type(of: parentVC!))")
        // Try to setup if we have jsonUrl
        setupShortsIfNeeded()
      } else {
        log("WARNING - Could not find parent view controller!", level: .warning)
      }
    } else {
      log("BBShortsView.didMoveToWindow - view removed from window")
    }
  }

  private func setupShorts() {
    log("BBShortsView.setupShorts() called with jsonUrl: \(jsonUrl)")

    guard !jsonUrl.isEmpty else {
      log("Cannot setup shorts - jsonUrl is empty", level: .warning)
      return
    }

    // Find the parent view controller
    var parentVC: UIViewController?
    var responder = self.next
    while responder != nil {
      if let viewController = responder as? UIViewController {
        parentVC = viewController
        break
      }
      responder = responder?.next
    }

    guard let viewController = parentVC else {
      log("ERROR - Cannot setup shorts without parent view controller", level: .error)
      return
    }

    // Convert options to Swift dictionary
    var optionsDict: [String: Any]? = nil
    if let dict = options as? [String: Any], !dict.isEmpty {
      optionsDict = dict
    }

    // Create the shorts view using the factory method
    shortsView = BBNativeShorts.createShortsView(
      uiViewController: viewController,
      frame: bounds,
      jsonUrl: jsonUrl,
      options: optionsDict
    )

    guard let shorts = shortsView else {
      log("ERROR - Failed to create BBNativeShortsView", level: .error)
      onDidFailWithError?(["error": "Failed to create shorts view"])
      return
    }

    shorts.delegate = self

    // Add to view hierarchy with autolayout
    addSubview(shorts)
    shorts.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      shorts.topAnchor.constraint(equalTo: topAnchor),
      shorts.leadingAnchor.constraint(equalTo: leadingAnchor),
      shorts.trailingAnchor.constraint(equalTo: trailingAnchor),
      shorts.bottomAnchor.constraint(equalTo: bottomAnchor)
    ])

    log("BBShortsView.setupShorts() completed")
  }

  func destroy() {
    log("BBShortsView.destroy() called")
    shortsView?.destroy()
    shortsView?.removeFromSuperview()
    shortsView = nil
    hasSetup = false
  }

  deinit {
    destroy()
  }

  // MARK: - BBNativeShortsViewDelegate

  func bbNativeShortsView(shortsView: BBNativeShortsView, didSetupWithJsonUrl url: String?) {
    log("didSetupWithJsonUrl: \(url ?? "nil")")
    onDidSetupWithJsonUrl?(["url": url as Any])
  }

  func bbNativeShortsView(shortsView: BBNativeShortsView, didFailWithError error: String?) {
    log("didFailWithError: \(error ?? "nil")", level: .error)
    onDidFailWithError?(["error": error ?? "Unknown error"])
  }

  func bbNativeShortsView(shortsView: BBNativeShortsView, didTriggerResize width: Int, height: Int) {
    log("didTriggerResize: \(width)x\(height)")
    onDidTriggerResize?([
      "width": width,
      "height": height
    ])
  }
}
