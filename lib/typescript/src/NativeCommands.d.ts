/// <reference types="react" />
import type { LoadClipOptions, LoadContext, BBPlayerState } from "./BBPlayer.types";
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
    presentModal: () => void;
    closeModal: () => void;
    collapse: () => void;
    expand: () => void;
    autoPlayNextCancel: () => void;
    destroy: () => void;
    showCastPicker: () => void;
    /**
     * Load a clip by ID with optional configuration.
     * This is the primary method for loading content, matching the channel SDK pattern.
     */
    loadClip: (clipId: string, options?: LoadClipOptions) => void;
    loadWithClipId: (clipId: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext) => void;
    loadWithClipListId: (clipListId: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext) => void;
    loadWithProjectId: (projectId: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext) => void;
    loadWithClipJson: (clipJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext) => void;
    loadWithClipListJson: (clipListJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext) => void;
    loadWithProjectJson: (projectJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext) => void;
    loadWithJsonUrl: (jsonUrl: string, autoPlay?: boolean, context?: LoadContext) => void;
    getDuration: () => Promise<number | null>;
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
    /**
     * Get the complete player state as a structured object.
     * Aggregates all individual getter calls into a single BBPlayerState object.
     */
    getPlayerState: () => Promise<BBPlayerState | null>;
};
//# sourceMappingURL=NativeCommands.d.ts.map