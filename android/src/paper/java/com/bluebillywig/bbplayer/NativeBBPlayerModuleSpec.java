package com.bluebillywig.bbplayer;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

/**
 * Abstract base class for BBPlayerModule on Old Architecture (Paper).
 * This is used when codegen is not available (Old Architecture builds).
 * The actual implementation extends this class.
 */
public abstract class NativeBBPlayerModuleSpec extends ReactContextBaseJavaModule {
    public NativeBBPlayerModuleSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // Void methods - playback control
    public abstract void play(int viewTag);
    public abstract void pause(int viewTag);
    public abstract void seek(int viewTag, double position);
    public abstract void seekRelative(int viewTag, double offsetSeconds);
    public abstract void setMuted(int viewTag, boolean muted);
    public abstract void setVolume(int viewTag, double volume);

    // Void methods - fullscreen control
    public abstract void enterFullscreen(int viewTag);
    public abstract void enterFullscreenLandscape(int viewTag);
    public abstract void exitFullscreen(int viewTag);

    // Void methods - layout control
    public abstract void collapse(int viewTag);
    public abstract void expand(int viewTag);

    // Void methods - modal control
    public abstract void presentModal(int viewTag);
    public abstract void closeModal(int viewTag);

    // Void methods - other commands
    public abstract void autoPlayNextCancel(int viewTag);
    public abstract void destroy(int viewTag);
    public abstract void showCastPicker(int viewTag);

    // Modal player (module-level)
    public abstract void presentModalPlayer(String jsonUrl, String optionsJson);
    public abstract void dismissModalPlayer();

    // Event emitter support
    public abstract void addListener(String eventName);
    public abstract void removeListeners(double count);

    // Load methods
    public abstract void loadWithClipId(int viewTag, String clipId, String initiator, boolean autoPlay, double seekTo, String contextJson);
    public abstract void loadWithClipListId(int viewTag, String clipListId, String initiator, boolean autoPlay, double seekTo, String contextJson);
    public abstract void loadWithProjectId(int viewTag, String projectId, String initiator, boolean autoPlay, double seekTo, String contextJson);
    public abstract void loadWithClipJson(int viewTag, String clipJson, String initiator, boolean autoPlay, double seekTo, String contextJson);
    public abstract void loadWithClipListJson(int viewTag, String clipListJson, String initiator, boolean autoPlay, double seekTo, String contextJson);
    public abstract void loadWithProjectJson(int viewTag, String projectJson, String initiator, boolean autoPlay, double seekTo, String contextJson);
    public abstract void loadWithJsonUrl(int viewTag, String jsonUrl, boolean autoPlay, String contextJson);

    // Promise getters
    public abstract void getDuration(int viewTag, Promise promise);
    public abstract void getMuted(int viewTag, Promise promise);
    public abstract void getVolume(int viewTag, Promise promise);
    public abstract void getPhase(int viewTag, Promise promise);
    public abstract void getState(int viewTag, Promise promise);
    public abstract void getMode(int viewTag, Promise promise);
    public abstract void getClipData(int viewTag, Promise promise);
    public abstract void getProjectData(int viewTag, Promise promise);
    public abstract void getPlayoutData(int viewTag, Promise promise);
}
