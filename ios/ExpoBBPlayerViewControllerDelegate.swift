import bbnativeshared

enum BBPlayerEvent {
    case requestCollapse
    case requestExpand
    case failWithError(String?)
    case requestOpenUrl(String?)
    case setupWithJsonUrl(String?)
    case adError(String?)
    case adFinished
    case adLoaded
    case adLoadStart
    case adNotFound
    case adQuartile1
    case adQuartile2
    case adQuartile3
    case adStarted
    case allAdsCompleted
    case autoPause(String?)
    case autoPausePlay(String?)
    case canPlay
    case customStatistics(ident: String, ev: String, aux: [String: String])
    case durationChange(Double)
    case ended
    case fullscreen
    case mediaClipFailed
    case mediaClipLoaded(MediaClip)
    case modeChange(String?)
    case pause
    case phaseChange(Phase?)
    case play
    case playing
    case projectLoaded(Project)
    case retractFullscreen
    case seeked(Double?)
    case seeking
    case stall
    case stateChange(State?)
    case viewFinished
    case viewStarted
    case volumeChange(Double)
    case timeUpdate(currentTime: Double, duration: Double)
    case apiReady
}

protocol BBPlayerViewControllerDelegate: AnyObject {
    func bbPlayerViewController(
        _ controller: BBPlayerViewController, didTriggerEvent event: BBPlayerEvent)
}
