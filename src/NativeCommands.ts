import { NativeModules, findNodeHandle } from "react-native";

import type { LoadClipOptions, BBPlayerState } from "./BBPlayer.types";
import type { State, Phase } from "./types";

// Try TurboModule first, fallback to legacy NativeModules
let BBPlayerModule: typeof import("./specs/NativeBBPlayerModule").default | null =
  null;

try {
  // Try to use TurboModule (New Architecture)
  BBPlayerModule = require("./specs/NativeBBPlayerModule").default;
} catch {
  // Fallback to legacy NativeModules (Old Architecture)
  BBPlayerModule = NativeModules.BBPlayerModule;
}

// Final fallback if both fail
if (!BBPlayerModule) {
  BBPlayerModule = NativeModules.BBPlayerModule;
}

/**
 * Get the view tag (node handle) for a ref
 */
function getViewTag(viewRef: React.RefObject<any>): number | null {
  const node = viewRef.current;
  if (node == null) {
    console.warn("BBPlayerView: View ref is null");
    return null;
  }

  const nodeHandle = findNodeHandle(node);
  if (nodeHandle == null) {
    console.warn("BBPlayerView: Could not find node handle");
    return null;
  }

  return nodeHandle;
}

/**
 * Creates command functions for the BBPlayerView ref.
 * Uses NativeModule for reliable command dispatch on both Old and New Architecture.
 */
export function createCommands(viewRef: React.RefObject<any>) {
  return {
    play: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.play(tag);
    },
    pause: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.pause(tag);
    },
    seek: (position: number) => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.seek(tag, position);
    },
    seekRelative: (offsetSeconds: number) => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.seekRelative(tag, offsetSeconds);
    },
    setMuted: (muted: boolean) => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.setMuted(tag, muted);
    },
    setVolume: (volume: number) => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.setVolume(tag, volume);
    },
    enterFullscreen: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.enterFullscreen(tag);
    },
    enterFullscreenLandscape: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.enterFullscreenLandscape(tag);
    },
    exitFullscreen: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.exitFullscreen(tag);
    },
    presentModal: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.presentModal(tag);
    },
    closeModal: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.closeModal(tag);
    },
    collapse: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.collapse(tag);
    },
    expand: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.expand(tag);
    },
    autoPlayNextCancel: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.autoPlayNextCancel(tag);
    },
    destroy: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.destroy(tag);
    },
    showCastPicker: () => {
      const tag = getViewTag(viewRef);
      if (tag != null) BBPlayerModule?.showCastPicker(tag);
    },

    /**
     * Load a clip by ID with optional configuration.
     * This is the primary method for loading content, matching the channel SDK pattern.
     */
    loadClip: (clipId: string, options?: LoadClipOptions) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        // Use loadWithClipId under the hood, passing playout as initiator if provided
        BBPlayerModule?.loadWithClipId(
          tag,
          clipId,
          options?.initiator ?? options?.playout ?? null,
          options?.autoPlay ?? false,
          options?.seekTo ?? 0
        );
      }
    },

    // Legacy load methods (kept for backwards compatibility)
    loadWithClipId: (
      clipId: string,
      initiator?: string,
      autoPlay?: boolean,
      seekTo?: number
    ) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithClipId(
          tag,
          clipId,
          initiator ?? null,
          autoPlay ?? false,
          seekTo ?? 0
        );
      }
    },
    loadWithClipListId: (
      clipListId: string,
      initiator?: string,
      autoPlay?: boolean,
      seekTo?: number
    ) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithClipListId(
          tag,
          clipListId,
          initiator ?? null,
          autoPlay ?? false,
          seekTo ?? 0
        );
      }
    },
    loadWithProjectId: (
      projectId: string,
      initiator?: string,
      autoPlay?: boolean,
      seekTo?: number
    ) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithProjectId(
          tag,
          projectId,
          initiator ?? null,
          autoPlay ?? false,
          seekTo ?? 0
        );
      }
    },
    loadWithClipJson: (
      clipJson: string,
      initiator?: string,
      autoPlay?: boolean,
      seekTo?: number
    ) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithClipJson(
          tag,
          clipJson,
          initiator ?? null,
          autoPlay ?? false,
          seekTo ?? 0
        );
      }
    },
    loadWithClipListJson: (
      clipListJson: string,
      initiator?: string,
      autoPlay?: boolean,
      seekTo?: number
    ) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithClipListJson(
          tag,
          clipListJson,
          initiator ?? null,
          autoPlay ?? false,
          seekTo ?? 0
        );
      }
    },
    loadWithProjectJson: (
      projectJson: string,
      initiator?: string,
      autoPlay?: boolean,
      seekTo?: number
    ) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithProjectJson(
          tag,
          projectJson,
          initiator ?? null,
          autoPlay ?? false,
          seekTo ?? 0
        );
      }
    },
    loadWithJsonUrl: (jsonUrl: string, autoPlay?: boolean) => {
      const tag = getViewTag(viewRef);
      if (tag != null) {
        BBPlayerModule?.loadWithJsonUrl(tag, jsonUrl, autoPlay ?? true);
      }
    },

    // Note: For Shorts playback, use the BBShortsView component instead of BBPlayerView.

    // Getter methods (async)
    getDuration: async (): Promise<number | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getDuration) {
        return BBPlayerModule.getDuration(tag);
      }
      return null;
    },
    getCurrentTime: async (): Promise<number | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getCurrentTime) {
        return BBPlayerModule.getCurrentTime(tag);
      }
      return null;
    },
    getMuted: async (): Promise<boolean | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getMuted) {
        return BBPlayerModule.getMuted(tag);
      }
      return null;
    },
    getVolume: async (): Promise<number | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getVolume) {
        return BBPlayerModule.getVolume(tag);
      }
      return null;
    },
    getPhase: async (): Promise<string | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getPhase) {
        return BBPlayerModule.getPhase(tag);
      }
      return null;
    },
    getState: async (): Promise<string | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getState) {
        return BBPlayerModule.getState(tag);
      }
      return null;
    },
    getMode: async (): Promise<string | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getMode) {
        return BBPlayerModule.getMode(tag);
      }
      return null;
    },
    getClipData: async (): Promise<{
      id?: string;
      title?: string;
      description?: string;
      length?: number;
    } | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getClipData) {
        return BBPlayerModule.getClipData(tag);
      }
      return null;
    },
    getProjectData: async (): Promise<{
      id?: string;
      name?: string;
    } | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getProjectData) {
        return BBPlayerModule.getProjectData(tag);
      }
      return null;
    },
    getPlayoutData: async (): Promise<{
      name?: string;
    } | null> => {
      const tag = getViewTag(viewRef);
      if (tag != null && BBPlayerModule?.getPlayoutData) {
        return BBPlayerModule.getPlayoutData(tag);
      }
      return null;
    },

    /**
     * Get the complete player state as a structured object.
     * Aggregates all individual getter calls into a single BBPlayerState object.
     */
    getPlayerState: async (): Promise<BBPlayerState | null> => {
      const tag = getViewTag(viewRef);
      if (tag == null || !BBPlayerModule) {
        return null;
      }

      try {
        // Fetch all state in parallel for efficiency
        const [
          state,
          phase,
          mode,
          currentTime,
          duration,
          muted,
          volume,
          clipData,
          projectData,
          playoutData,
        ] = await Promise.all([
          BBPlayerModule.getState?.(tag) ?? null,
          BBPlayerModule.getPhase?.(tag) ?? null,
          BBPlayerModule.getMode?.(tag) ?? null,
          BBPlayerModule.getCurrentTime?.(tag) ?? 0,
          BBPlayerModule.getDuration?.(tag) ?? 0,
          BBPlayerModule.getMuted?.(tag) ?? false,
          BBPlayerModule.getVolume?.(tag) ?? 1,
          BBPlayerModule.getClipData?.(tag) ?? null,
          BBPlayerModule.getProjectData?.(tag) ?? null,
          BBPlayerModule.getPlayoutData?.(tag) ?? null,
        ]);

        return {
          state: (state as State) ?? "IDLE",
          phase: (phase as Phase) ?? "INIT",
          mode: mode ?? null,
          currentTime: currentTime ?? 0,
          duration: duration ?? 0,
          muted: muted ?? false,
          volume: volume ?? 1,
          clip: clipData,
          project: projectData,
          playout: playoutData,
        };
      } catch (error) {
        console.warn("BBPlayerView: Failed to get player state", error);
        return null;
      }
    },
  };
}
