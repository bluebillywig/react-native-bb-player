---
sidebar_position: 2
title: Methods
description: All player methods available via ref.
---

# Methods

All methods are called on the player ref:

```tsx
const playerRef = useRef<BBPlayerViewMethods>(null);

<BBPlayerView ref={playerRef} jsonUrl="..." />

// Call methods
playerRef.current?.play();
```

## Playback Control

| Method | Description |
|--------|-------------|
| `play()` | Start or resume playback |
| `pause()` | Pause playback |
| `seek(position: number)` | Seek to absolute position (seconds) |
| `seekRelative(offset: number)` | Seek relative to current position (seconds, can be negative) |

## Volume Control

| Method | Description |
|--------|-------------|
| `setVolume(volume: number)` | Set volume (0.0–1.0) |
| `setMuted(muted: boolean)` | Mute or unmute |

## Layout Control

| Method | Description |
|--------|-------------|
| `enterFullscreen()` | Enter fullscreen in current orientation |
| `enterFullscreenLandscape()` | Enter fullscreen and force landscape |
| `exitFullscreen()` | Exit fullscreen and restore orientation |
| `collapse()` | Collapse the player (outstream) |
| `expand()` | Expand the player (outstream) |

## Content Loading

### Primary API

```tsx
loadClip(clipId: string, options?: LoadClipOptions): void
```

Load a clip with optional configuration:

```tsx
playerRef.current?.loadClip('123456', {
  playout: 'default',
  autoPlay: true,
  seekTo: 30,
  initiator: 'user',
  context: {
    contextEntityType: 'MediaClipList',
    contextEntityId: 'playlist-id',
    contextCollectionType: 'MediaClipList',
    contextCollectionId: 'playlist-id',
  },
});
```

### LoadClipOptions

| Option | Type | Description |
|--------|------|-------------|
| `playout` | `string` | Playout name/ID |
| `autoPlay` | `boolean` | Auto-play after loading |
| `seekTo` | `number` | Seek to position (seconds) |
| `initiator` | `string` | Analytics initiator |
| `context` | `LoadContext` | Playlist/collection context |

### LoadContext

Passing context enables playlist navigation (next up, previous/next):

| Field | Type | Description |
|-------|------|-------------|
| `contextEntityType` | `'MediaClipList'` | Type of containing entity |
| `contextEntityId` | `string` | Playlist ID for "next up" list |
| `contextCollectionType` | `'MediaClipList'` | Collection type |
| `contextCollectionId` | `string` | Collection ID |

### Legacy Load Methods

These are still supported for backward compatibility:

```tsx
loadWithClipId(clipId: string, initiator?, autoPlay?, seekTo?, context?): void
loadWithClipListId(clipListId: string, initiator?, autoPlay?, seekTo?, context?): void
loadWithProjectId(projectId: string, initiator?, autoPlay?, seekTo?, context?): void
loadWithClipJson(clipJson: string, initiator?, autoPlay?, seekTo?, context?): void
loadWithClipListJson(clipListJson: string, initiator?, autoPlay?, seekTo?, context?): void
loadWithProjectJson(projectJson: string, initiator?, autoPlay?, seekTo?, context?): void
loadWithJsonUrl(jsonUrl: string, autoPlay?, context?): void
```

## State Query

### Primary API

```tsx
getPlayerState(): Promise<BBPlayerState | null>
```

Returns complete player state in one call:

```tsx
const state = await playerRef.current?.getPlayerState();
if (state) {
  console.log(state.state);      // 'PLAYING'
  console.log(state.duration);   // 120.5
  console.log(state.clip?.title); // 'My Video'
  console.log(state.volume);     // 0.8
  console.log(state.muted);      // false
}
```

### Individual Getters

| Method | Return Type |
|--------|-------------|
| `getDuration()` | `Promise<number \| null>` |
| `getVolume()` | `Promise<number \| null>` |
| `getMuted()` | `Promise<boolean \| null>` |
| `getPhase()` | `Promise<string \| null>` |
| `getState()` | `Promise<string \| null>` |
| `getMode()` | `Promise<string \| null>` |
| `getClipData()` | `Promise<{ id?, title?, description?, length? } \| null>` |
| `getProjectData()` | `Promise<{ id?, name? } \| null>` |
| `getPlayoutData()` | `Promise<{ name? } \| null>` |

## Lifecycle

| Method | Description |
|--------|-------------|
| `destroy()` | Clean up the player and release all resources |
| `autoPlayNextCancel()` | Cancel auto-play of next clip |

## Casting

| Method | Description |
|--------|-------------|
| `showCastPicker()` | Open the Chromecast device picker |
