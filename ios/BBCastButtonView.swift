import UIKit
import GoogleCast

class BBCastButtonView: UIView {
    private var castButton: GCKUICastButton?

    override func didMoveToWindow() {
        super.didMoveToWindow()
        guard window != nil, castButton == nil else { return }
        setupCastButton()
    }

    private func setupCastButton() {
        guard GCKCastContext.isSharedInstanceInitialized() else {
            NSLog("BBCastButtonView: Google Cast SDK not initialized")
            return
        }

        let button = GCKUICastButton(frame: bounds)
        button.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        button.tintColor = tintColor
        addSubview(button)
        castButton = button
    }

    override func tintColorDidChange() {
        super.tintColorDidChange()
        castButton?.tintColor = tintColor
    }
}
