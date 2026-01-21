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
