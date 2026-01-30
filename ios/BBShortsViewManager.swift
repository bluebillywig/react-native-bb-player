import Foundation
import React

@objc(BBShortsViewManager)
class BBShortsViewManager: RCTViewManager {

    override func view() -> UIView! {
        return BBShortsView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // Override moduleName to expose as "BBShortsView" instead of default "BBShorts"
    // This is required for Fabric interop to find the component correctly
    @objc override static func moduleName() -> String! {
        return "BBShortsView"
    }

    // MARK: - Helper to get view by tag

    private func getView(_ reactTag: NSNumber) -> BBShortsView? {
        return self.bridge.uiManager.view(forReactTag: reactTag) as? BBShortsView
    }

    // MARK: - Commands

    @objc func destroy(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.destroy()
        }
    }
}
