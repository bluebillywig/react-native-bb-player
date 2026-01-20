/// <reference types="react" />
/**
 * Creates command functions for the BBPlayerView ref.
 * Uses NativeModule for reliable command dispatch on both Old and New Architecture.
 */
export declare function createCommands(viewRef: React.RefObject<any>): {
    play: () => void;
    pause: () => void;
    seek: (position: number) => void;
    seekRelative: (offsetSeconds: number) => void;
    setMuted: (muted: boolean) => void;
    setVolume: (volume: number) => void;
    enterFullscreen: () => void;
    enterFullscreenLandscape: () => void;
    exitFullscreen: () => void;
    collapse: () => void;
    expand: () => void;
    autoPlayNextCancel: () => void;
    destroy: () => void;
    showCastPicker: () => void;
    loadWithClipId: (clipId: string, initiator?: string, autoPlay?: boolean, seekTo?: number) => void;
    loadWithClipListId: (clipListId: string, initiator?: string, autoPlay?: boolean, seekTo?: number) => void;
    loadWithProjectId: (projectId: string, initiator?: string, autoPlay?: boolean, seekTo?: number) => void;
    loadWithClipJson: (clipJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number) => void;
    loadWithClipListJson: (clipListJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number) => void;
    loadWithProjectJson: (projectJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number) => void;
    loadWithJsonUrl: (jsonUrl: string, autoPlay?: boolean) => void;
    getDuration: () => Promise<number | null>;
    getCurrentTime: () => Promise<number | null>;
    getMuted: () => Promise<boolean | null>;
    getVolume: () => Promise<number | null>;
    getPhase: () => Promise<string | null>;
    getState: () => Promise<string | null>;
    getMode: () => Promise<string | null>;
    getClipData: () => Promise<{
        id?: string;
        title?: string;
        description?: string;
        length?: number;
    } | null>;
    getProjectData: () => Promise<{
        id?: string;
        name?: string;
    } | null>;
    getPlayoutData: () => Promise<{
        name?: string;
    } | null>;
};
//# sourceMappingURL=NativeCommands.d.ts.map