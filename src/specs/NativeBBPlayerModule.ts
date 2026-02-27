import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Void methods - playback control
  play(viewTag: number): void;
  pause(viewTag: number): void;
  seek(viewTag: number, position: number): void;
  seekRelative(viewTag: number, offsetSeconds: number): void;
  setMuted(viewTag: number, muted: boolean): void;
  setVolume(viewTag: number, volume: number): void;

  // Void methods - fullscreen control
  enterFullscreen(viewTag: number): void;
  enterFullscreenLandscape(viewTag: number): void;
  exitFullscreen(viewTag: number): void;
  presentModal(viewTag: number): void;
  closeModal(viewTag: number): void;

  // Void methods - layout control
  collapse(viewTag: number): void;
  expand(viewTag: number): void;

  // Void methods - other commands
  autoPlayNextCancel(viewTag: number): void;
  destroy(viewTag: number): void;
  showCastPicker(viewTag: number): void;

  // Load methods
  loadWithClipId(
    viewTag: number,
    clipId: string,
    initiator: string | null,
    autoPlay: boolean,
    seekTo: number,
    contextJson: string | null
  ): void;
  loadWithClipListId(
    viewTag: number,
    clipListId: string,
    initiator: string | null,
    autoPlay: boolean,
    seekTo: number,
    contextJson: string | null
  ): void;
  loadWithProjectId(
    viewTag: number,
    projectId: string,
    initiator: string | null,
    autoPlay: boolean,
    seekTo: number,
    contextJson: string | null
  ): void;
  loadWithClipJson(
    viewTag: number,
    clipJson: string,
    initiator: string | null,
    autoPlay: boolean,
    seekTo: number,
    contextJson: string | null
  ): void;
  loadWithClipListJson(
    viewTag: number,
    clipListJson: string,
    initiator: string | null,
    autoPlay: boolean,
    seekTo: number,
    contextJson: string | null
  ): void;
  loadWithProjectJson(
    viewTag: number,
    projectJson: string,
    initiator: string | null,
    autoPlay: boolean,
    seekTo: number,
    contextJson: string | null
  ): void;
  loadWithJsonUrl(viewTag: number, jsonUrl: string, autoPlay: boolean, contextJson: string | null): void;

  // Promise getters
  getDuration(viewTag: number): Promise<number | null>;
  getMuted(viewTag: number): Promise<boolean | null>;
  getVolume(viewTag: number): Promise<number | null>;
  getPhase(viewTag: number): Promise<string | null>;
  getState(viewTag: number): Promise<string | null>;
  getMode(viewTag: number): Promise<string | null>;
  getClipData(viewTag: number): Promise<Object | null>;
  getProjectData(viewTag: number): Promise<Object | null>;
  getPlayoutData(viewTag: number): Promise<Object | null>;

  // Modal player (module-level, no React view needed)
  presentModalPlayer(jsonUrl: string, optionsJson: string | null, contextJson: string | null): void;
  dismissModalPlayer(): void;

  // Event emitter support (required for NativeEventEmitter)
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Use get() instead of getEnforcing() to avoid crash when module not registered
export default TurboModuleRegistry.get<Spec>("BBPlayerModule");
