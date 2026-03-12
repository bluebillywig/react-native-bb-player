import React

@objc(BBCastButtonViewManager)
class BBCastButtonViewManager: RCTViewManager {
    override func view() -> UIView! {
        return BBCastButtonView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
