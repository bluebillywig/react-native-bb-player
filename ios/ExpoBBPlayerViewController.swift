import BBNativePlayerKit
import ExpoModulesCore
import bbnativeshared

class BBPlayerViewController: UIViewController, BBNativePlayerViewDelegate {
    var playerView: BBNativePlayerView?
    var setViewSize: ((CGSize) -> Void)?
    var lastHeight: CGFloat = 0
    var jsonUrl: String = ""
    var options: [String: Any] = [:]
    var allowCollapseExpand: Bool {
        return options["allowCollapseExpand"] as? Bool ?? false
    }

    weak var delegate: BBPlayerViewControllerDelegate?

    // MARK: - Orientation Support

    /// Keep the main view controller locked to portrait orientation
    /// The SDK's modal fullscreen player will handle its own landscape orientation independently
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .portrait
    }

    /// Allow auto-rotation
    override var shouldAutorotate: Bool {
        return true
    }

    func refreshPlayerViewHierarchy() {
        guard let playerView = playerView else {
            print("ExpoBBPlayer: refreshPlayerViewHierarchy - no playerView")
            return
        }

        print("ExpoBBPlayer: Starting view hierarchy refresh")

        // Force all sublayers to redraw by traversing the entire layer hierarchy
        func refreshLayerTree(_ layer: CALayer) {
            layer.setNeedsDisplay()
            layer.displayIfNeeded()
            for sublayer in layer.sublayers ?? [] {
                refreshLayerTree(sublayer)
            }
        }

        // Refresh the entire layer tree of the player view
        refreshLayerTree(playerView.layer)

        // Force the player view and all its subviews to re-layout
        playerView.setNeedsLayout()
        playerView.layoutIfNeeded()

        for subview in playerView.subviews {
            subview.setNeedsLayout()
            subview.layoutIfNeeded()
        }

        print("ExpoBBPlayer: View hierarchy refresh complete")
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        if allowCollapseExpand {
            return
        }

        // Report height changes back to React Native for layout
        let height = playerView?.bounds.size.height ?? 0
        let size = CGSize(width: Double.nan, height: height)

        if size.height != lastHeight {
            setViewSize?(size)
        }

        lastHeight = size.height
    }

    func setupPlayer() {
        NSLog("ExpoBBPlayer: setupPlayer called")
        playerView?.removeFromSuperview()

        // Use the SDK's factory method which properly sets up the view controller hierarchy
        playerView = BBNativePlayer.createPlayerView(
            uiViewController: self,
            frame: view.frame,
            jsonUrl: jsonUrl,
            options: options
        )

        if let playerView = playerView {
            view.addSubview(playerView)

            playerView.translatesAutoresizingMaskIntoConstraints = false

            // Use full edge constraints to ensure playerView fills the view controller's view
            // This is essential for fullscreen to work properly
            NSLayoutConstraint.activate([
                playerView.topAnchor.constraint(equalTo: view.topAnchor),
                playerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
                playerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
                playerView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
            ])

            playerView.delegate = self
            NSLog("ExpoBBPlayer: Player view created and delegate set to: \(String(describing: playerView.delegate))")
        } else {
            NSLog("ExpoBBPlayer: ERROR - playerView is nil after createPlayerView!")
        }
    }

    func bbNativePlayerView(didRequestCollapse playerView: BBNativePlayerView) {
        if allowCollapseExpand {
            let newSize = CGSize(width: Double.nan, height: 0)
            setViewSize?(newSize)
        }

        delegate?.bbPlayerViewController(self, didTriggerEvent: .requestCollapse)
    }

    func bbNativePlayerView(didRequestExpand playerView: BBNativePlayerView) {
        if allowCollapseExpand {
            let height = playerView.bounds.size.height
            let newSize = CGSize(width: Double.nan, height: height)
            setViewSize?(newSize)
        }

        delegate?.bbPlayerViewController(self, didTriggerEvent: .requestExpand)
    }

    func bbNativePlayerView(playerView: BBNativePlayerView, didFailWithError error: String?) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .failWithError(error))
    }

    func didRequestOpenUrl(url: String?) {
        // not available in the SDK
        delegate?.bbPlayerViewController(self, didTriggerEvent: .requestOpenUrl(url))
    }

    func didSetupWithJsonUrl(url: String?) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .setupWithJsonUrl(url))
    }

    func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerAdError error: String?) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adError(error))
    }

    func bbNativePlayerView(didTriggerAdFinished playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adFinished)
    }

    func bbNativePlayerView(didTriggerAdLoadStart playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adLoadStart)
    }

    func bbNativePlayerView(didTriggerAdLoaded playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adLoaded)
    }

    func bbNativePlayerView(didTriggerAdNotFound playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adNotFound)
    }

    func bbNativePlayerView(didTriggerAdQuartile1 playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adQuartile1)
    }

    func bbNativePlayerView(didTriggerAdQuartile2 playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adQuartile2)
    }

    func bbNativePlayerView(didTriggerAdQuartile3 playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adQuartile3)
    }

    func bbNativePlayerView(didTriggerAdStarted playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .adStarted)
    }

    func bbNativePlayerView(didTriggerAllAdsCompleted playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .allAdsCompleted)
    }

    func bbNativePlayerView(didTriggerAutoPause playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .autoPause(nil))
    }

    func bbNativePlayerView(didTriggerAutoPausePlay playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .autoPausePlay(nil))
    }

    func bbNativePlayerView(didTriggerCanPlay playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .canPlay)
    }

    func bbNativePlayerView(
        didTriggerCustomStatistics playerView: BBNativePlayerView, ident: String, ev: String,
        aux: [String: String]
    ) {
        delegate?.bbPlayerViewController(
            self, didTriggerEvent: .customStatistics(ident: ident, ev: ev, aux: aux))
    }

    func bbNativePlayerView(
        playerView: BBNativePlayerView, didTriggerDurationChange duration: Double
    ) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .durationChange(duration))
    }

    func bbNativePlayerView(didTriggerEnded playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .ended)
    }

    func bbNativePlayerView(didTriggerFullscreen playerView: BBNativePlayerView) {
        NSLog("ExpoBBPlayer: ⭐️ FULLSCREEN ENTRY DELEGATE CALLED ⭐️")

        // Notify the app to enable landscape orientation
        NotificationCenter.default.post(
            name: NSNotification.Name("BBPlayerFullscreenStateChanged"),
            object: nil,
            userInfo: ["isFullscreen": true]
        )

        delegate?.bbPlayerViewController(self, didTriggerEvent: .fullscreen)
    }

    func bbNativePlayerView(didTriggerMediaClipFailed playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .mediaClipFailed)
    }

    func bbNativePlayerView(
        playerView: BBNativePlayerView, didTriggerMediaClipLoaded data: MediaClip
    ) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .mediaClipLoaded(data))
    }

    func bbNativePlayerView(didTriggerModeChange playerView: BBNativePlayerView, mode: String?) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .modeChange(mode))
    }

    func bbNativePlayerView(didTriggerPause playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .pause)
    }

    func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerPhaseChange phase: Phase?) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .phaseChange(phase))
    }

    func bbNativePlayerView(didTriggerPlay playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .play)
    }

    func bbNativePlayerView(didTriggerPlaying playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .playing)
    }

    func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerProjectLoaded data: Project) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .projectLoaded(data))
    }

    func bbNativePlayerView(didTriggerRetractFullscreen playerView: BBNativePlayerView) {
        NSLog("ExpoBBPlayer: ⭐️ FULLSCREEN EXIT DELEGATE CALLED ⭐️")

        // Notify the app to disable landscape orientation
        NotificationCenter.default.post(
            name: NSNotification.Name("BBPlayerFullscreenStateChanged"),
            object: nil,
            userInfo: ["isFullscreen": false]
        )

        // The SDK's internal AVPlayerViewController needs time to restore itself
        // Wait for the modal dismissal animation to complete
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [weak self] in
            guard let self = self, let playerView = self.playerView else { return }

            NSLog("ExpoBBPlayer: Refreshing view hierarchy after fullscreen exit")

            // Force the CA layer to re-render by marking it as needing display
            func forceLayerRedraw(_ view: UIView) {
                // Remove and re-add the layer to force Core Animation to rebuild
                let layer = view.layer
                layer.setNeedsDisplay()
                layer.displayIfNeeded()

                // Force all sublayers to redraw
                layer.sublayers?.forEach { sublayer in
                    sublayer.setNeedsDisplay()
                    sublayer.displayIfNeeded()
                }

                // Recursively process subviews
                view.subviews.forEach { subview in
                    forceLayerRedraw(subview)
                }
            }

            forceLayerRedraw(playerView)

            // Force immediate layout
            playerView.setNeedsLayout()
            playerView.layoutIfNeeded()
            self.view.setNeedsLayout()
            self.view.layoutIfNeeded()

            // Log the player state for debugging
            let player = playerView.player
            NSLog("ExpoBBPlayer: Player state after fullscreen: \(String(describing: player.state?.name))")
        }

        delegate?.bbPlayerViewController(self, didTriggerEvent: .retractFullscreen)
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if presentingViewController == nil {
            print("ExpoBBPlayer: viewDidAppear after dismissing fullscreen")
        }
    }

    func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerSeeked seekOffset: Double) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .seeked(seekOffset))
    }

    func bbNativePlayerView(didTriggerSeeking playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .seeking)
    }

    func bbNativePlayerView(didTriggerStall playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .stall)
    }

    func bbNativePlayerView(playerView: BBNativePlayerView, didTriggerStateChange state: State?) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .stateChange(state))
    }

    func bbNativePlayerView(didTriggerViewFinished playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .viewFinished)
    }

    func bbNativePlayerView(didTriggerViewStarted playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .viewStarted)
    }

    func bbNativePlayerView(didTriggerVolumeChange playerView: BBNativePlayerView, volume: Double) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .volumeChange(volume))
    }

    func bbNativePlayerView(didTriggerApiReady playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .apiReady)
    }
}
