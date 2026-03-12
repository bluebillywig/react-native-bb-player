import React

@objc(BBCastMiniControlsViewManager)
class BBCastMiniControlsViewManager: RCTViewManager {
    override func view() -> UIView! {
        return BBCastMiniControlsView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
