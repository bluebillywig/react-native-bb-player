---
sidebar_position: 4
title: Types
description: All exported TypeScript types and interfaces.
---

# Types

All types are exported from the package:

```tsx
import type {
  State,
  Phase,
  BBPlayerState,
  MediaClip,
  LoadClipOptions,
  LoadContext,
  // ...
} from '@bluebillywig/react-native-bb-player';
```

## Player State

### State

```typescript
type State = "IDLE" | "LOADING" | "PLAYING" | "PAUSED" | "ERROR";
```

### Phase

```typescript
type Phase = "INIT" | "PRE" | "MAIN" | "POST" | "EXIT";
```

### BBPlayerState

Complete player state returned by `getPlayerState()`:

```typescript
type BBPlayerState = {
  state: State;
  phase: Phase;
  mode: string | null;
  duration: number;
  muted: boolean;
  volume: number;
  clip: {
    id?: string;
    title?: string;
    description?: string;
    length?: number;
  } | null;
  project: {
    id?: string;
    name?: string;
  } | null;
  playout: {
    name?: string;
  } | null;
};
```

## Content Loading

### LoadClipOptions

```typescript
type LoadClipOptions = {
  playout?: string;       // Playout name/ID
  autoPlay?: boolean;     // Auto-play after loading
  seekTo?: number;        // Seek to position (seconds)
  initiator?: string;     // Analytics initiator
  context?: LoadContext;   // Playlist/collection context
};
```

### LoadContext

```typescript
type LoadContext = {
  contextEntityType?: 'MediaClipList';
  contextEntityId?: string;
  contextCollectionType?: 'MediaClipList';
  contextCollectionId?: string;
};
```

## Data Types

### MediaClip

Represents a video item:

```typescript
type MediaClip = {
  id?: string;
  title?: string;
  description?: string;
  length?: number;
  status?: string;
  type?: string;
  publicationDate?: string;
  createdDate?: string;
  thumbnails?: Thumbnail[];
  subtitles?: Subtitle[];
  assets?: MediaAsset[];
};
```

### MediaClipList

Represents a playlist:

```typescript
type MediaClipList = {
  id?: string;
  title?: string;
  deeplink?: string;
  numfound?: number;
  offset?: number;
  parentid?: string;
  status?: string;
  publication?: string[];
  mediatype?: string;
  usetype?: string;
  modifieddate?: string;
  createddate?: string;
  publishedDate?: string;
  count?: number;
  items?: MediaClip[];
};
```

### Project

Represents a collection of clips:

```typescript
type Project = {
  id?: string;
  name?: string;
  description?: string;
};
```

### Playout

Player configuration:

```typescript
type Playout = {
  name?: string;
  // Configuration fields managed by BB platform
};
```

## Media Variants

### Thumbnail

```typescript
type Thumbnail = {
  src?: string;
  width?: number;
  height?: number;
};
```

### Subtitle

```typescript
type Subtitle = {
  src?: string;
  language?: string;
  label?: string;
};
```

### MediaAsset

```typescript
type MediaAsset = {
  src?: string;
  type?: string;
  width?: number;
  height?: number;
  bitrate?: number;
};
```

## Component Props

### BBPlayerViewProps

All props for `BBPlayerView`:

```typescript
type BBPlayerViewProps = {
  jsonUrl: string;
  playerId?: string;
  jwt?: string;
  options?: Record<string, unknown>;
  style?: ViewStyle;
  // + all event callbacks (see Events page)
};
```

### BBPlayerViewMethods

All methods available via ref:

```typescript
type BBPlayerViewMethods = {
  // Playback
  play(): void;
  pause(): void;
  seek(position: number): void;
  seekRelative(offset: number): void;

  // Volume
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;

  // Layout
  enterFullscreen(): void;
  enterFullscreenLandscape(): void;
  exitFullscreen(): void;
  collapse(): void;
  expand(): void;

  // Content loading
  loadClip(clipId: string, options?: LoadClipOptions): void;
  loadWithClipId(clipId: string, ...): void;
  // ... other load methods

  // State
  getPlayerState(): Promise<BBPlayerState | null>;
  getDuration(): Promise<number | null>;
  // ... other getters

  // Lifecycle
  destroy(): void;
  autoPlayNextCancel(): void;
  showCastPicker(): void;
};
```

### BBShortsViewProps

```typescript
type BBShortsViewProps = {
  jsonUrl: string;
  options?: BBShortsViewOptions;
  style?: ViewStyle;
  onDidSetupWithJsonUrl?: (url: string) => void;
  onDidFailWithError?: (error: string) => void;
  onDidTriggerResize?: (width: number, height: number) => void;
};
```

### BBOutstreamViewProps

Extends `BBPlayerViewProps` plus:

```typescript
type BBOutstreamViewProps = BBPlayerViewProps & {
  expandedHeight?: number;
  collapsedHeight?: number;
  animation?: OutstreamAnimationConfig;
  onCollapsed?: () => void;
  onExpanded?: () => void;
  onAnimationStart?: (isCollapsing: boolean) => void;
};
```

### OutstreamAnimationConfig

```typescript
type OutstreamAnimationConfig =
  | { type: 'timing'; duration?: number }
  | { type: 'spring'; damping?: number; stiffness?: number }
  | { type: 'layout'; duration?: number }
  | { type: 'none' };
```

### ModalPlayerOptions

```typescript
type ModalPlayerOptions = {
  autoPlay?: boolean;
  playout?: string;
};
```

## Analytics

### CustomStatistics

```typescript
type CustomStatistics = {
  ident: string;
  ev: string;
  aux: Record<string, string>;
};
```

### BBPlayerEventPayloads

Typed event payloads for all player events:

```typescript
type BBPlayerEventPayloads = {
  play: void;
  pause: void;
  stateChange: { state: State };
  phaseChange: { phase: Phase };
  durationChange: { duration: number };
  volumeChange: { volume: number; muted: boolean };
  // ... and more
};
```

## Utility Functions

### convertPlayoutUrlToMediaclipUrl

```typescript
function convertPlayoutUrlToMediaclipUrl(url: string): string;
```

Converts a playout URL to a mediaclip API URL:

```typescript
convertPlayoutUrlToMediaclipUrl('https://demo.bbvms.com/p/default/c/6323522.json')
// → 'https://demo.bbvms.com/json/mediaclip/6323522'
```
