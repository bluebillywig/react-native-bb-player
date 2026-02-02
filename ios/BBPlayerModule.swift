import Foundation
import React

/**
 * Global registry for BBPlayerView instances.
 * This is needed because the bridge.uiManager.view(forReactTag:) doesn't work
 * with the New Architecture (Fabric). Views register themselves when created.
 */
class BBPlayerViewRegistry: NSObject {
    static let shared = BBPlayerViewRegistry()

    private var views: [Int: BBPlayerView] = [:]
    private let lock = NSLock()

    private override init() {
        super.init()
    }

    func register(_ view: BBPlayerView, tag: Int) {
        lock.lock()
        defer { lock.unlock() }
        views[tag] = view
        NSLog("BBPlayerViewRegistry: Registered view with tag %d (total: %d)", tag, views.count)
    }

    func unregister(tag: Int) {
        lock.lock()
        defer { lock.unlock() }
        views.removeValue(forKey: tag)
        NSLog("BBPlayerViewRegistry: Unregistered view with tag %d (total: %d)", tag, views.count)
    }

    func getView(tag: Int) -> BBPlayerView? {
        lock.lock()
        defer { lock.unlock() }
        return views[tag]
    }
}

/**
 * Native Module for BBPlayer commands.
 * This module looks up BBPlayerView instances by their React tag and dispatches commands to them.
 */
@objc(BBPlayerModule)
class BBPlayerModule: NSObject {

    @objc var bridge: RCTBridge?

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc static func moduleName() -> String {
        return "BBPlayerModule"
    }

    // MARK: - Helper to get view by tag

    private func getView(_ reactTag: NSNumber) -> BBPlayerView? {
        // First try the view registry (works with both old and new architecture)
        if let view = BBPlayerViewRegistry.shared.getView(tag: reactTag.intValue) {
            return view
        }

        // Fallback to bridge.uiManager for old architecture
        if let bridge = self.bridge {
            if let view = bridge.uiManager.view(forReactTag: reactTag) as? BBPlayerView {
                return view
            }
        }

        NSLog("BBPlayerModule: Could not find view with tag %@", reactTag)
        return nil
    }

    // MARK: - Commands

    @objc func play(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.play()
        }
    }

    @objc func pause(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.pause()
        }
    }

    @objc func seek(_ viewTag: NSNumber, position: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.seek(position.intValue)
        }
    }

    @objc func seekRelative(_ viewTag: NSNumber, offsetSeconds: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.seekRelative(offsetSeconds.doubleValue)
        }
    }

    @objc func setMuted(_ viewTag: NSNumber, muted: Bool) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.setMuted(muted)
        }
    }

    @objc func setVolume(_ viewTag: NSNumber, volume: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.setVolume(volume.doubleValue)
        }
    }

    @objc func enterFullscreen(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.enterFullscreen()
        }
    }

    @objc func enterFullscreenLandscape(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.enterFullscreenLandscape()
        }
    }

    @objc func exitFullscreen(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.exitFullscreen()
        }
    }

    @objc func collapse(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.collapse()
        }
    }

    @objc func expand(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.expand()
        }
    }

    @objc func autoPlayNextCancel(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.autoPlayNextCancel()
        }
    }

    @objc func destroy(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.destroy()
        }
    }

    @objc func showCastPicker(_ viewTag: NSNumber) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.showCastPicker()
        }
    }

    @objc func loadWithClipId(_ viewTag: NSNumber, clipId: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?, contextJson: String?) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.loadWithClipId(clipId ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue, contextJson: contextJson)
        }
    }

    @objc func loadWithClipListId(_ viewTag: NSNumber, clipListId: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?, contextJson: String?) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.loadWithClipListId(clipListId ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue, contextJson: contextJson)
        }
    }

    @objc func loadWithProjectId(_ viewTag: NSNumber, projectId: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?, contextJson: String?) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.loadWithProjectId(projectId ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue, contextJson: contextJson)
        }
    }

    @objc func loadWithClipJson(_ viewTag: NSNumber, clipJson: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?, contextJson: String?) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.loadWithClipJson(clipJson ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue, contextJson: contextJson)
        }
    }

    @objc func loadWithClipListJson(_ viewTag: NSNumber, clipListJson: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?, contextJson: String?) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.loadWithClipListJson(clipListJson ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue, contextJson: contextJson)
        }
    }

    @objc func loadWithProjectJson(_ viewTag: NSNumber, projectJson: String?, initiator: String?, autoPlay: Bool, seekTo: NSNumber?, contextJson: String?) {
        DispatchQueue.main.async {
            self.getView(viewTag)?.loadWithProjectJson(projectJson ?? "", initiator: initiator, autoPlay: autoPlay, seekTo: seekTo?.doubleValue, contextJson: contextJson)
        }
    }

    @objc func loadWithJsonUrl(_ viewTag: NSNumber, jsonUrl: String?, autoPlay: Bool, contextJson: String?) {
        NSLog("BBPlayerModule.loadWithJsonUrl called - viewTag: %@, jsonUrl: %@, autoPlay: %d, context: %@", viewTag, jsonUrl ?? "nil", autoPlay, contextJson ?? "nil")
        DispatchQueue.main.async {
            let view = self.getView(viewTag)
            NSLog("BBPlayerModule.loadWithJsonUrl - view found: %@", view != nil ? "YES" : "NO")
            if let view = view, let url = jsonUrl {
                NSLog("BBPlayerModule.loadWithJsonUrl - calling view.loadWithJsonUrl with url: %@", url)
                view.loadWithJsonUrl(url, autoPlay: autoPlay, contextJson: contextJson)
            } else {
                NSLog("BBPlayerModule.loadWithJsonUrl - FAILED: view=%@, url=%@", view != nil ? "found" : "nil", jsonUrl ?? "nil")
            }
        }
    }

    // MARK: - Getter methods with Promise support

    @objc func getDuration(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let duration = self.getView(viewTag)?.duration()
            resolver(duration)
        }
    }

    @objc func getCurrentTime(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let currentTime = self.getView(viewTag)?.currentTime()
            resolver(currentTime)
        }
    }

    @objc func getMuted(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let muted = self.getView(viewTag)?.muted()
            resolver(muted)
        }
    }

    @objc func getVolume(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let volume = self.getView(viewTag)?.volume()
            resolver(volume)
        }
    }

    @objc func getPhase(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let phase = self.getView(viewTag)?.phase()
            resolver(phase)
        }
    }

    @objc func getState(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let state = self.getView(viewTag)?.state()
            resolver(state)
        }
    }

    @objc func getMode(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let mode = self.getView(viewTag)?.mode()
            resolver(mode)
        }
    }

    @objc func getClipData(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let clipData = self.getView(viewTag)?.clipData()
            resolver(clipData)
        }
    }

    @objc func getProjectData(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let projectData = self.getView(viewTag)?.projectData()
            resolver(projectData)
        }
    }

    @objc func getPlayoutData(_ viewTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let playoutData = self.getView(viewTag)?.playoutData()
            resolver(playoutData)
        }
    }
}
