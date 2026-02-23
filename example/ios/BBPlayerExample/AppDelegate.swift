import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import BBNativePlayerKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // Pre-initialized player view for SDK warm-up (matches native demo pattern)
  private var preloadedPlayerView: BBNativePlayerView?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "BBPlayerExample",
      in: window,
      launchOptions: launchOptions
    )

    // Pre-initialize SDK with empty jsonUrl to warm up the player (reduces initialization overhead later)
    // Using noChromeCast to avoid GoogleCast SDK overhead
    DispatchQueue.main.async { [weak self] in
      if let rootVC = self?.window?.rootViewController {
        self?.preloadedPlayerView = BBNativePlayer.createPlayerView(
          uiViewController: rootVC,
          frame: .zero,
          jsonUrl: "",
          options: ["noChromeCast": true]
        )
        // Don't add to view hierarchy - just keep reference for pre-initialization
      }
    }

    return true
  }

  // Handle URL scheme deep links (bbplayer://watch/<clipId>)
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }

  // Handle universal links (https://www.bluebillywig.tv/watch/<clipId>)
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
