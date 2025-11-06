import type { RefObject } from "react";
import type { ViewProps } from "react-native";

import type {
  CustomStatistics,
  MediaClip,
  Phase,
  Project,
  State,
} from "./types";

export type ExpoBBPlayerViewType = {
  // Getter methods
  adMediaHeight: () => Promise<number>;
  adMediaWidth: () => Promise<number>;
  adMediaClip: () => Promise<MediaClip>;
  controls: () => Promise<boolean>;
  duration: () => Promise<number>;
  inView: () => Promise<boolean>;
  mode: () => Promise<string>;
  muted: () => Promise<boolean>;
  phase: () => Promise<Phase>;
  playoutData: () => Promise<Project>;
  projectData: () => Promise<Project>;
  playerState: () => Promise<State>;
  state: () => Promise<State>;
  volume: () => Promise<number>;

  // Playback control methods
  autoPlayNextCancel: () => Promise<void>;
  collapse: () => Promise<void>;
  expand: () => Promise<void>;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  destroy: () => Promise<void>;

  // Load methods
  loadWithClipId: (
    clipId: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number
  ) => Promise<void>;
  loadWithClipListId: (
    clipListId: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number
  ) => Promise<void>;
  loadWithProjectId: (
    projectId: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number
  ) => Promise<void>;
  loadWithClipJson: (
    clipJson: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number
  ) => Promise<void>;
  loadWithClipListJson: (
    clipListJson: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number
  ) => Promise<void>;
  loadWithProjectJson: (
    projectJson: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number
  ) => Promise<void>;
};

export type ExpoBBPlayerViewProps = {
  ref: RefObject<ExpoBBPlayerViewType | null>;
  options?: Record<string, unknown>;
  jsonUrl?: string;
  onDidFailWithError?: (error: string) => void;
  onDidRequestCollapse?: () => void;
  onDidRequestExpand?: () => void;
  onDidRequestOpenUrl?: (url: string) => void;
  onDidSetupWithJsonUrl?: (url: string) => void;
  onDidTriggerAdError?: (error: string) => void;
  onDidTriggerAdFinished?: () => void;
  onDidTriggerAdLoaded?: () => void;
  onDidTriggerAdLoadStart?: () => void;
  onDidTriggerAdNotFound?: () => void;
  onDidTriggerAdQuartile1?: () => void;
  onDidTriggerAdQuartile2?: () => void;
  onDidTriggerAdQuartile3?: () => void;
  onDidTriggerAdStarted?: () => void;
  onDidTriggerAllAdsCompleted?: () => void;
  onDidTriggerApiReady?: () => void;
  onDidTriggerAutoPause?: (why: string) => void;
  onDidTriggerAutoPausePlay?: (why: string) => void;
  onDidTriggerCanPlay?: () => void;
  onDidTriggerCustomStatistics?: (customStatistics: CustomStatistics) => void;
  onDidTriggerDurationChange?: (duration: number) => void;
  onDidTriggerEnded?: () => void;
  onDidTriggerFullscreen?: () => void;
  onDidTriggerMediaClipFailed?: () => void;
  onDidTriggerMediaClipLoaded?: (mediaClip: MediaClip) => void;
  onDidTriggerModeChange?: (mode: string) => void;
  onDidTriggerPause?: () => void;
  onDidTriggerPhaseChange?: (phase: Phase) => void;
  onDidTriggerPlay?: () => void;
  onDidTriggerPlaying?: () => void;
  onDidTriggerProjectLoaded?: (project: Project) => void;
  onDidTriggerRetractFullscreen?: () => void;
  onDidTriggerSeeked?: (position: number) => void;
  onDidTriggerSeeking?: () => void;
  onDidTriggerStall?: () => void;
  onDidTriggerStateChange?: (state: State) => void;
  onDidTriggerTimeUpdate?: (currentTime: number, duration: number) => void;
  onDidTriggerViewFinished?: () => void;
  onDidTriggerViewStarted?: () => void;
  onDidTriggerVolumeChange?: (volume: number) => void;
} & ViewProps;
