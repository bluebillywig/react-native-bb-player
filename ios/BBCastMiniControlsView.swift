import UIKit
import GoogleCast

class BBCastMiniControlsView: UIView {
    private var miniControlsViewController: GCKUIMiniMediaControlsViewController?

    override func didMoveToWindow() {
        super.didMoveToWindow()
        guard window != nil, miniControlsViewController == nil else { return }
        setupMiniControls()
    }

    private func setupMiniControls() {
        guard GCKCastContext.isSharedInstanceInitialized() else {
            NSLog("BBCastMiniControlsView: Google Cast SDK not initialized")
            return
        }

        let miniController = GCKCastContext.sharedInstance().createMiniMediaControlsViewController()
        miniControlsViewController = miniController

        let miniView = miniController.view!
        miniView.frame = bounds
        miniView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(miniView)
    }
}
