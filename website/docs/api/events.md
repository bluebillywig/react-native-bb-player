---
sidebar_position: 3
title: Events
description: All player event callbacks.
---

# Events

All events are passed as callback props on `BBPlayerView`. They fire when the native player triggers the corresponding action.

```tsx
<BBPlayerView
  jsonUrl="..."
  onDidTriggerPlay={() => console.log('Playing')}
  onDidTriggerPause={() => console.log('Paused')}
  onDidTriggerStateChange={(state) => console.log('State:', state)}
/>
```

## Setup & Lifecycle

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidSetupWithJsonUrl` | `url: string` | Player initialized with URL |
| `onDidTriggerApiReady` | — | Player API is ready for method calls |
| `onDidFailWithError` | `error: string` | Player setup failed |

## Playback

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerPlay` | — | Playback started |
| `onDidTriggerPause` | — | Playback paused |
| `onDidTriggerPlaying` | — | Actively playing (after buffering) |
| `onDidTriggerEnded` | — | Playback reached the end |
| `onDidTriggerCanPlay` | — | Enough data buffered to play |
| `onDidTriggerSeeking` | — | Seek operation started |
| `onDidTriggerSeeked` | `position: number` | Seek completed |
| `onDidTriggerStall` | — | Playback stalled (buffering) |
| `onDidTriggerDurationChange` | `duration: number` | Media duration available/changed |
| `onDidTriggerVolumeChange` | `volume: number, muted: boolean` | Volume or mute state changed |

## State Changes

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerStateChange` | `state: State` | Player state changed |
| `onDidTriggerPhaseChange` | `phase: Phase` | Player phase changed |
| `onDidTriggerModeChange` | `mode: string` | Player mode changed |

### State Values

```typescript
type State = "IDLE" | "LOADING" | "PLAYING" | "PAUSED" | "ERROR";
```

| State | Description |
|-------|-------------|
| `IDLE` | No media loaded |
| `LOADING` | Media is loading |
| `PLAYING` | Actively playing |
| `PAUSED` | Playback paused |
| `ERROR` | An error occurred |

### Phase Values

```typescript
type Phase = "INIT" | "PRE" | "MAIN" | "POST" | "EXIT";
```

| Phase | Description |
|-------|-------------|
| `INIT` | Player initializing |
| `PRE` | Pre-roll ads playing |
| `MAIN` | Main content playing |
| `POST` | Post-roll ads playing |
| `EXIT` | Playback session ended |

## Media Loading

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerMediaClipLoaded` | `clip: MediaClip` | Media clip loaded successfully |
| `onDidTriggerMediaClipFailed` | — | Media clip failed to load |
| `onDidTriggerProjectLoaded` | `project: Project` | Project data loaded |

## View Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerViewStarted` | — | View session started (for analytics) |
| `onDidTriggerViewFinished` | — | View session completed |

## Fullscreen

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerFullscreen` | — | Entered fullscreen |
| `onDidTriggerRetractFullscreen` | — | Exited fullscreen (any method) |

## Layout

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidRequestCollapse` | — | Player requests collapse (outstream) |
| `onDidRequestExpand` | — | Player requests expand (outstream) |
| `onDidRequestOpenUrl` | `url: string` | Player requests opening a URL (ad click-through) |

## Auto-Pause

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerAutoPause` | `why: string` | Playback auto-paused (reason provided) |
| `onDidTriggerAutoPausePlay` | `why: string` | Auto-pause resumed |

## Ads

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerAdLoadStart` | — | Ad request started |
| `onDidTriggerAdLoaded` | — | Ad loaded successfully |
| `onDidTriggerAdStarted` | — | Ad playback began |
| `onDidTriggerAdFinished` | — | Single ad completed |
| `onDidTriggerAdNotFound` | — | No ad returned from server |
| `onDidTriggerAdError` | `error: string` | Ad playback failed |
| `onDidTriggerAdQuartile1` | — | Ad reached 25% |
| `onDidTriggerAdQuartile2` | — | Ad reached 50% |
| `onDidTriggerAdQuartile3` | — | Ad reached 75% |
| `onDidTriggerAllAdsCompleted` | — | All scheduled ads completed |

## Custom Statistics

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerCustomStatistics` | `stats: CustomStatistics` | Custom analytics event from native SDK |

```typescript
type CustomStatistics = {
  ident: string;                    // Event identifier
  ev: string;                       // Event type/name
  aux: Record<string, string>;      // Additional data
};
```

See [Analytics Guide](../guides/analytics.md) for integration examples.
