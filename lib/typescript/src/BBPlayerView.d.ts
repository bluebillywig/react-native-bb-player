import React from "react";
import { type ViewProps } from "react-native";
import type { BBPlayerViewMethods } from "./BBPlayer.types";
import type { CustomStatistics, MediaClip, Phase, Project, State } from "./types";
/**
 * BBPlayerView - React Native Video Player component for Blue Billywig
 *
 * This component wraps the native Blue Billywig player SDK for iOS and Android,
 * providing a seamless video playback experience with full native performance.
 */
declare const BBPlayerView: React.ForwardRefExoticComponent<{
    playerId?: string | undefined;
    jwt?: string | undefined;
    options?: Record<string, unknown> | undefined;
    jsonUrl?: string | undefined;
    enableTimeUpdates?: boolean | undefined;
    onDidFailWithError?: ((error: string) => void) | undefined;
    onDidRequestCollapse?: (() => void) | undefined;
    onDidRequestExpand?: (() => void) | undefined;
    onDidRequestOpenUrl?: ((url: string) => void) | undefined;
    onDidSetupWithJsonUrl?: ((url: string) => void) | undefined;
    onDidTriggerAdError?: ((error: string) => void) | undefined;
    onDidTriggerAdFinished?: (() => void) | undefined;
    onDidTriggerAdLoaded?: (() => void) | undefined;
    onDidTriggerAdLoadStart?: (() => void) | undefined;
    onDidTriggerAdNotFound?: (() => void) | undefined;
    onDidTriggerAdQuartile1?: (() => void) | undefined;
    onDidTriggerAdQuartile2?: (() => void) | undefined;
    onDidTriggerAdQuartile3?: (() => void) | undefined;
    onDidTriggerAdStarted?: (() => void) | undefined;
    onDidTriggerAllAdsCompleted?: (() => void) | undefined;
    onDidTriggerApiReady?: (() => void) | undefined;
    onDidTriggerAutoPause?: ((why: string) => void) | undefined;
    onDidTriggerAutoPausePlay?: ((why: string) => void) | undefined;
    onDidTriggerCanPlay?: (() => void) | undefined;
    onDidTriggerCustomStatistics?: ((customStatistics: CustomStatistics) => void) | undefined;
    onDidTriggerDurationChange?: ((duration: number) => void) | undefined;
    onDidTriggerEnded?: (() => void) | undefined;
    onDidTriggerFullscreen?: (() => void) | undefined;
    onDidTriggerMediaClipFailed?: (() => void) | undefined;
    onDidTriggerMediaClipLoaded?: ((mediaClip: MediaClip) => void) | undefined;
    onDidTriggerModeChange?: ((mode: string) => void) | undefined;
    onDidTriggerPause?: (() => void) | undefined;
    onDidTriggerPhaseChange?: ((phase: Phase) => void) | undefined;
    onDidTriggerPlay?: (() => void) | undefined;
    onDidTriggerPlaying?: (() => void) | undefined;
    onDidTriggerProjectLoaded?: ((project: Project) => void) | undefined;
    onDidTriggerRetractFullscreen?: (() => void) | undefined;
    onDidTriggerSeeked?: ((position: number) => void) | undefined;
    onDidTriggerSeeking?: (() => void) | undefined;
    onDidTriggerStall?: (() => void) | undefined;
    onDidTriggerStateChange?: ((state: State) => void) | undefined;
    onDidTriggerTimeUpdate?: ((currentTime: number, duration: number) => void) | undefined;
    onDidTriggerViewFinished?: (() => void) | undefined;
    onDidTriggerViewStarted?: (() => void) | undefined;
    onDidTriggerVolumeChange?: ((volume: number) => void) | undefined;
} & ViewProps & React.RefAttributes<BBPlayerViewMethods>>;
export default BBPlayerView;
export { BBPlayerView as ExpoBBPlayerView };
//# sourceMappingURL=BBPlayerView.d.ts.map