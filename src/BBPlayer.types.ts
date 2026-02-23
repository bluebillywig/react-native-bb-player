import type { ViewProps } from "react-native";

import type {
  CustomStatistics,
  MediaClip,
  Phase,
  Project,
  State,
} from "./types";

/**
 * Context for playlist/collection navigation.
 * Enables "next up" list and proper playlist navigation in the player.
 */
export type LoadContext = {
  /** Context entity type (always 'MediaClipList' for playlists) */
  contextEntityType?: 'MediaClipList';
  /** Playlist ID for "next up" list */
  contextEntityId?: string;
  /** Context collection type (always 'MediaClipList' for collections) */
  contextCollectionType?: 'MediaClipList';
  /** Collection ID if playing within a collection */
  contextCollectionId?: string;
};

/**
 * Options for loading a clip via loadClip()
 */
export type LoadClipOptions = {
  /** Playout name/ID to use */
  playout?: string;
  /** Auto-play after loading */
  autoPlay?: boolean;
  /** Seek to position after loading (seconds) */
  seekTo?: number;
  /** Initiator identifier for analytics */
  initiator?: string;
  /** Playlist/collection context for navigation */
  context?: LoadContext;
};

/**
 * Options for loading Shorts via loadShorts()
 */
export type LoadShortsOptions = {
  /** Initiator identifier for analytics */
  initiator?: string;
  /** Auto-play after loading (default: true) */
  autoPlay?: boolean;
  /** Seek to position after loading (seconds) */
  seekTo?: number;
};

export type BBPlayerViewMethods = {
  // Playback control methods
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

  /**
   * Load a clip by ID with optional configuration.
   * This is the primary method for loading content, matching the channel SDK pattern.
   *
   * @param clipId - The clip ID to load
   * @param options - Optional loading configuration
   *
   * @example
   * // Simple usage
   * playerRef.current?.loadClip('12345');
   *
   * // With options
   * playerRef.current?.loadClip('12345', { playout: 'default', autoPlay: true });
   */
  loadClip: (clipId: string, options?: LoadClipOptions) => void;

  // Note: For Shorts playback, use the BBShortsView component instead of BBPlayerView.

  // Load methods (legacy signatures - kept for backwards compatibility)
  loadWithClipId: (
    clipId: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number,
    context?: LoadContext
  ) => void;
  loadWithClipListId: (
    clipListId: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number,
    context?: LoadContext
  ) => void;
  loadWithProjectId: (
    projectId: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number,
    context?: LoadContext
  ) => void;
  loadWithClipJson: (
    clipJson: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number,
    context?: LoadContext
  ) => void;
  loadWithClipListJson: (
    clipListJson: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number,
    context?: LoadContext
  ) => void;
  loadWithProjectJson: (
    projectJson: string,
    initiator?: string,
    autoPlay?: boolean,
    seekTo?: number,
    context?: LoadContext
  ) => void;
  loadWithJsonUrl: (jsonUrl: string, autoPlay?: boolean, context?: LoadContext) => void;

  // Getter methods (async)
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
   * This is the primary method for getting player state, matching the channel SDK pattern.
   *
   * @returns Promise resolving to BBPlayerState or null if player not ready
   *
   * @example
   * const state = await playerRef.current?.getPlayerState();
   * if (state) {
   *   console.log(`Playing: ${state.state === 'PLAYING'}`);
   *   console.log(`Duration: ${state.duration}`);
   * }
   */
  getPlayerState: () => Promise<BBPlayerState | null>;
};

export type BBPlayerViewProps = {
  /**
   * Unique identifier for this player instance.
   * Used for multi-player scenarios and player identification in events.
   */
  playerId?: string;
  /**
   * JWT token for authenticated playback of protected content.
   * Will be merged into options.jwt automatically.
   */
  jwt?: string;
  /**
   * Player options passed to the native SDK.
   */
  options?: Record<string, unknown>;
  /**
   * JSON URL to load player configuration from.
   */
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
  onDidTriggerViewFinished?: () => void;
  onDidTriggerViewStarted?: () => void;
  onDidTriggerVolumeChange?: (volume: number) => void;
} & ViewProps;

// ============================================================================
// Structured Event Types (Channel SDK compatible)
// ============================================================================

/**
 * Player state object returned by getPlayerState().
 * Compatible with channel SDK BBPlayerState format.
 */
export type BBPlayerState = {
  /** Current playback state */
  state: State;
  /** Current phase */
  phase: Phase;
  /** Current playback mode */
  mode: string | null;
  /** Total duration in seconds */
  duration: number;
  /** Whether audio is muted */
  muted: boolean;
  /** Volume level (0-1) */
  volume: number;
  /** Currently loaded clip data */
  clip: {
    id?: string;
    title?: string;
    description?: string;
    length?: number;
  } | null;
  /** Currently loaded project data */
  project: {
    id?: string;
    name?: string;
  } | null;
  /** Current playout data */
  playout: {
    name?: string;
  } | null;
};

/**
 * Event payload types for structured event handling.
 * These provide typed payloads for event listeners.
 */
export type BBPlayerEventPayloads = {
  play: void;
  pause: void;
  playing: void;
  ended: void;
  stateChange: { state: State };
  phaseChange: { phase: Phase };
  modeChange: { mode: string };
  durationChange: { duration: number };
  volumeChange: { volume: number; muted: boolean };
  seeked: { position: number };
  seeking: void;
  stall: void;
  canPlay: void;
  fullscreen: void;
  retractFullscreen: void;
  mediaClipLoaded: MediaClip;
  mediaClipFailed: void;
  projectLoaded: Project;
  viewStarted: void;
  viewFinished: void;
  adLoadStart: void;
  adLoaded: void;
  adStarted: void;
  adQuartile1: void;
  adQuartile2: void;
  adQuartile3: void;
  adFinished: void;
  adNotFound: void;
  adError: { error: string };
  allAdsCompleted: void;
  apiReady: void;
  autoPause: { reason: string };
  autoPausePlay: { reason: string };
  customStatistics: CustomStatistics;
  error: { error: string };
};

/**
 * Event names for the player.
 */
export type BBPlayerEventName = keyof BBPlayerEventPayloads;

// For backwards compatibility
export type ExpoBBPlayerViewType = BBPlayerViewMethods;
export type ExpoBBPlayerViewProps = BBPlayerViewProps;
