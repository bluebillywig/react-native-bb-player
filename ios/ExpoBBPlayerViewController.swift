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

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        if allowCollapseExpand {
            return
        }

        let height = playerView?.bounds.size.height ?? 0
        let size = CGSize(width: Double.nan, height: height)

        if size.height != lastHeight {
            setViewSize?(size)
        }

        lastHeight = size.height
    }

    func setupPlayer() {
        playerView?.removeFromSuperview()

        playerView = BBNativePlayer.createPlayerView(
            uiViewController: self, frame: view.frame,
            jsonUrl: jsonUrl,
            options: options
        )

        if let playerView = playerView {
            view.addSubview(playerView)

            playerView.translatesAutoresizingMaskIntoConstraints = false

            playerView.topAnchor.constraint(equalTo: view.topAnchor, constant: 0).isActive = true
            playerView.centerXAnchor.constraint(equalTo: view.centerXAnchor, constant: 0).isActive =
                true
            playerView.widthAnchor.constraint(equalTo: view.widthAnchor).isActive = true

            playerView.delegate = self
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
        delegate?.bbPlayerViewController(self, didTriggerEvent: .retractFullscreen)
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

    func bbNativePlayerView(didTriggerTimeUpdate playerView: BBNativePlayerView, currentTime: Double) {
        // iOS SDK Note: Time updates are sent with currentTime parameter
        // We need to get duration from the player to match Android's event structure
        let duration = playerView.player.duration ?? 0.0
        delegate?.bbPlayerViewController(self, didTriggerEvent: .timeUpdate(currentTime: currentTime, duration: duration))
    }

    func bbNativePlayerView(didTriggerApiReady playerView: BBNativePlayerView) {
        delegate?.bbPlayerViewController(self, didTriggerEvent: .apiReady)
    }
}
