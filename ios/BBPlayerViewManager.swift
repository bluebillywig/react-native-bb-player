import Foundation
import React

@objc(BBPlayerViewManager)
class BBPlayerViewManager: RCTViewManager {

    override func view() -> UIView! {
        return BBPlayerView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    // MARK: - Helper to get view by tag

    private func getView(_ reactTag: NSNumber) -> BBPlayerView? {
        return self.bridge.uiManager.view(forReactTag: reactTag) as? BBPlayerView
    }

    // MARK: - Commands

    @objc func play(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.play()
        }
    }

    @objc func pause(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.pause()
        }
    }

    @objc func seek(_ reactTag: NSNumber, offsetInSeconds: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.seek(offsetInSeconds.intValue)
        }
    }

    @objc func seekRelative(_ reactTag: NSNumber, offsetInSeconds: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.seekRelative(offsetInSeconds.doubleValue)
        }
    }

    @objc func setMuted(_ reactTag: NSNumber, muted: Bool) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.setMuted(muted)
        }
    }

    @objc func setVolume(_ reactTag: NSNumber, volume: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.setVolume(volume.doubleValue)
        }
    }

    @objc func enterFullscreen(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.enterFullscreen()
        }
    }

    @objc func enterFullscreenLandscape(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.enterFullscreenLandscape()
        }
    }

    @objc func exitFullscreen(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.exitFullscreen()
        }
    }

    @objc func collapse(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.collapse()
        }
    }

    @objc func expand(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.expand()
        }
    }

    @objc func autoPlayNextCancel(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.autoPlayNextCancel()
        }
    }

    @objc func destroy(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.destroy()
        }
    }

    @objc func showCastPicker(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.showCastPicker()
        }
    }

    @objc func loadWithClipId(_ reactTag: NSNumber, clipId: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.loadWithClipId(clipId ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue)
        }
    }

    @objc func loadWithClipListId(_ reactTag: NSNumber, clipListId: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.loadWithClipListId(clipListId ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue)
        }
    }

    @objc func loadWithProjectId(_ reactTag: NSNumber, projectId: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.loadWithProjectId(projectId ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue)
        }
    }

    @objc func loadWithClipJson(_ reactTag: NSNumber, clipJson: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.loadWithClipJson(clipJson ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue)
        }
    }

    @objc func loadWithClipListJson(_ reactTag: NSNumber, clipListJson: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.loadWithClipListJson(clipListJson ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue)
        }
    }

    @objc func loadWithProjectJson(_ reactTag: NSNumber, projectJson: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?) {
        DispatchQueue.main.async {
            self.getView(reactTag)?.loadWithProjectJson(projectJson ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue)
        }
    }

    // Note: loadWithShortsId is NOT supported on BBPlayerView.
    // For Shorts playback, use the BBShortsView component instead.
}
