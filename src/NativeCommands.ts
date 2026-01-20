import { NativeModules, findNodeHandle } from "react-native";

const { BBPlayerModule } = NativeModules;

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
  };
}
