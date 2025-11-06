# expo-bb-player API Reference

Complete API documentation for the Blue Billywig Native Player Expo module.

## Table of Contents

- [Player Methods](#player-methods)
  - [Playback Control](#playback-control)
  - [Load Methods](#load-methods)
  - [Layout Control](#layout-control)
  - [Getter Methods](#getter-methods)
  - [Setter Methods](#setter-methods)
- [Player Events](#player-events)
  - [Setup & Lifecycle](#setup--lifecycle)
  - [Media Loading](#media-loading)
  - [Playback Events](#playback-events)
  - [State Changes](#state-changes)
  - [Ad Events](#ad-events)
  - [User Interaction](#user-interaction)
- [Platform Differences](#platform-differences)

---

## Player Methods

### Playback Control

#### `play()`
Start or resume video playback.

**Signature:**
```typescript
play(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.play();
```

**Platforms:** iOS, Android

---

#### `pause()`
Pause video playback.

**Signature:**
```typescript
pause(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.pause();
```

**Platforms:** iOS, Android

---

#### `seek(position: number)`
Seek to a specific position in the video (in seconds).

**Parameters:**
- `position` (number): Target position in seconds

**Signature:**
```typescript
seek(position: number): Promise<void>
```

**Example:**
```typescript
// Seek to 30 seconds
playerRef.current?.seek(30);
```

**Platforms:** iOS, Android

---

#### `autoPlayNextCancel()`
Cancel the auto-play next countdown timer.

**Signature:**
```typescript
autoPlayNextCancel(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.autoPlayNextCancel();
```

**Platforms:** iOS, Android

---

#### `destroy()`
Destroy the player instance and free up resources.

**Signature:**
```typescript
destroy(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.destroy();
```

**Platforms:** iOS, Android

**Note:** After calling destroy(), the player instance is no longer usable. Create a new instance if needed.

---

### Load Methods

#### `loadWithClipId(clipId, initiator?, autoPlay?, seekTo?)`
Load content by clip ID.

**Parameters:**
- `clipId` (string): The clip ID to load
- `initiator` (string, optional): Source of the load request. Default: `"external"`
- `autoPlay` (boolean, optional): Whether to auto-play after loading. Default: `true`
- `seekTo` (number, optional): Position to seek to after loading (in seconds)

**Signature:**
```typescript
loadWithClipId(
  clipId: string,
  initiator?: string,
  autoPlay?: boolean,
  seekTo?: number
): Promise<void>
```

**Example:**
```typescript
// Load and auto-play clip
playerRef.current?.loadWithClipId("1234567");

// Load clip without auto-play, seek to 10 seconds
playerRef.current?.loadWithClipId("1234567", "external", false, 10);
```

**Platforms:** iOS, Android

---

#### `loadWithClipListId(clipListId, initiator?, autoPlay?, seekTo?)`
Load a playlist by clip list ID.

**Parameters:**
- `clipListId` (string): The clip list ID to load
- `initiator` (string, optional): Source of the load request. Default: `"external"`
- `autoPlay` (boolean, optional): Whether to auto-play after loading. Default: `true`
- `seekTo` (number, optional): Position to seek to after loading (in seconds)

**Signature:**
```typescript
loadWithClipListId(
  clipListId: string,
  initiator?: string,
  autoPlay?: boolean,
  seekTo?: number
): Promise<void>
```

**Example:**
```typescript
playerRef.current?.loadWithClipListId("my-playlist");
```

**Platforms:** iOS, Android

---

#### `loadWithProjectId(projectId, initiator?, autoPlay?, seekTo?)`
Load content by project ID.

**Parameters:**
- `projectId` (string): The project ID to load
- `initiator` (string, optional): Source of the load request. Default: `"external"`
- `autoPlay` (boolean, optional): Whether to auto-play after loading. Default: `true`
- `seekTo` (number, optional): Position to seek to after loading (in seconds)

**Signature:**
```typescript
loadWithProjectId(
  projectId: string,
  initiator?: string,
  autoPlay?: boolean,
  seekTo?: number
): Promise<void>
```

**Example:**
```typescript
playerRef.current?.loadWithProjectId("project-123");
```

**Platforms:** iOS, Android

---

#### `loadWithClipJson(clipJson, initiator?, autoPlay?, seekTo?)`
Load content from clip JSON string.

**Parameters:**
- `clipJson` (string): JSON string containing clip data
- `initiator` (string, optional): Source of the load request. Default: `"external"`
- `autoPlay` (boolean, optional): Whether to auto-play after loading. Default: `true`
- `seekTo` (number, optional): Position to seek to after loading (in seconds)

**Signature:**
```typescript
loadWithClipJson(
  clipJson: string,
  initiator?: string,
  autoPlay?: boolean,
  seekTo?: number
): Promise<void>
```

**Example:**
```typescript
const clipData = JSON.stringify({
  id: "1234567",
  title: "My Video"
});
playerRef.current?.loadWithClipJson(clipData);
```

**Platforms:** iOS, Android

---

#### `loadWithClipListJson(clipListJson, initiator?, autoPlay?, seekTo?)`
Load playlist from clip list JSON string.

**Parameters:**
- `clipListJson` (string): JSON string containing clip list data
- `initiator` (string, optional): Source of the load request. Default: `"external"`
- `autoPlay` (boolean, optional): Whether to auto-play after loading. Default: `true`
- `seekTo` (number, optional): Position to seek to after loading (in seconds)

**Signature:**
```typescript
loadWithClipListJson(
  clipListJson: string,
  initiator?: string,
  autoPlay?: boolean,
  seekTo?: number
): Promise<void>
```

**Example:**
```typescript
const playlistData = JSON.stringify({
  clips: [
    { id: "1234567", title: "Video 1" },
    { id: "1234568", title: "Video 2" }
  ]
});
playerRef.current?.loadWithClipListJson(playlistData);
```

**Platforms:** iOS, Android

---

#### `loadWithProjectJson(projectJson, initiator?, autoPlay?, seekTo?)`
Load content from project JSON string.

**Parameters:**
- `projectJson` (string): JSON string containing project data
- `initiator` (string, optional): Source of the load request. Default: `"external"`
- `autoPlay` (boolean, optional): Whether to auto-play after loading. Default: `true`
- `seekTo` (number, optional): Position to seek to after loading (in seconds)

**Signature:**
```typescript
loadWithProjectJson(
  projectJson: string,
  initiator?: string,
  autoPlay?: boolean,
  seekTo?: number
): Promise<void>
```

**Example:**
```typescript
const projectData = JSON.stringify({
  id: "project-123",
  clips: [...]
});
playerRef.current?.loadWithProjectJson(projectData);
```

**Platforms:** iOS, Android

---

### Layout Control

#### `collapse()`
Collapse the player to a minimized state.

**Signature:**
```typescript
collapse(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.collapse();
```

**Platforms:** iOS, Android

---

#### `expand()`
Expand the player from a collapsed state to normal size.

**Signature:**
```typescript
expand(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.expand();
```

**Platforms:** iOS, Android

---

#### `enterFullscreen()`
Enter fullscreen mode.

**Signature:**
```typescript
enterFullscreen(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.enterFullscreen();
```

**Platforms:** iOS, Android

**Note:** On iOS, this calls the native SDK's `enterFullScreen()` method.

---

#### `exitFullscreen()`
Exit fullscreen mode.

**Signature:**
```typescript
exitFullscreen(): Promise<void>
```

**Example:**
```typescript
playerRef.current?.exitFullscreen();
```

**Platforms:** iOS, Android

**Note:** On iOS, this calls the native SDK's `exitFullScreen()` method.

---

### Getter Methods

All getter methods return a Promise that resolves with the current value.

#### `phase()`
Get the current player phase.

**Returns:** `Promise<Phase>` where Phase is one of: `PRE`, `MAIN`, `POST`, `EXIT`

**Signature:**
```typescript
phase(): Promise<Phase>
```

**Example:**
```typescript
const currentPhase = await playerRef.current?.phase();
console.log('Current phase:', currentPhase);
```

**Platforms:** iOS, Android

---

#### `state()` / `playerState()`
Get the current playback state.

**Returns:** `Promise<State>` where State is one of: `IDLE`, `LOADING`, `READY`, `PLAYING`, `PAUSED`, `ENDED`, `ERROR`

**Signature:**
```typescript
state(): Promise<State>
playerState(): Promise<State>  // Alias
```

**Example:**
```typescript
const currentState = await playerRef.current?.state();
console.log('Current state:', currentState);
```

**Platforms:** iOS, Android

**Note:** Both `state()` and `playerState()` return the same value. Use whichever you prefer.

---

#### `mode()`
Get the current player mode.

**Returns:** `Promise<string>` - typically `"video"` or `"audio"`

**Signature:**
```typescript
mode(): Promise<string>
```

**Example:**
```typescript
const mode = await playerRef.current?.mode();
console.log('Player mode:', mode);
```

**Platforms:** iOS, Android

---

#### `duration()`
Get the duration of the current media in seconds.

**Returns:** `Promise<number>`

**Signature:**
```typescript
duration(): Promise<number>
```

**Example:**
```typescript
const duration = await playerRef.current?.duration();
console.log('Video duration:', duration, 'seconds');
```

**Platforms:** iOS, Android

---

#### `volume()`
Get the current volume level.

**Returns:** `Promise<number>` - value between 0.0 (muted) and 1.0 (full volume)

**Signature:**
```typescript
volume(): Promise<number>
```

**Example:**
```typescript
const currentVolume = await playerRef.current?.volume();
console.log('Volume level:', currentVolume);
```

**Platforms:** iOS, Android

---

#### `muted()`
Get whether the player is currently muted.

**Returns:** `Promise<boolean>`

**Signature:**
```typescript
muted(): Promise<boolean>
```

**Example:**
```typescript
const isMuted = await playerRef.current?.muted();
console.log('Is muted:', isMuted);
```

**Platforms:** iOS, Android

---

#### `inView()`
Get whether the player is currently in the viewport.

**Returns:** `Promise<boolean>`

**Signature:**
```typescript
inView(): Promise<boolean>
```

**Example:**
```typescript
const isInView = await playerRef.current?.inView();
console.log('Player in view:', isInView);
```

**Platforms:** iOS, Android

---

#### `controls()`
Get whether player controls are currently visible.

**Returns:** `Promise<boolean>`

**Signature:**
```typescript
controls(): Promise<boolean>
```

**Example:**
```typescript
const controlsVisible = await playerRef.current?.controls();
console.log('Controls visible:', controlsVisible);
```

**Platforms:** iOS, Android

**Note:** On iOS, this may return `null` if the property is not available in the native SDK.

---

#### `playoutData()`
Get the playout configuration data.

**Returns:** `Promise<Project>` - object containing playout settings

**Signature:**
```typescript
playoutData(): Promise<Project>
```

**Example:**
```typescript
const playout = await playerRef.current?.playoutData();
console.log('Playout config:', playout);
```

**Platforms:** iOS, Android

---

#### `projectData()`
Get the project metadata.

**Returns:** `Promise<Project>` - object containing project information

**Signature:**
```typescript
projectData(): Promise<Project>
```

**Example:**
```typescript
const project = await playerRef.current?.projectData();
console.log('Project data:', project);
```

**Platforms:** iOS, Android

---

#### `adMediaWidth()`
Get the width of the current ad media.

**Returns:** `Promise<number>`

**Signature:**
```typescript
adMediaWidth(): Promise<number>
```

**Example:**
```typescript
const width = await playerRef.current?.adMediaWidth();
console.log('Ad width:', width);
```

**Platforms:** iOS, Android

---

#### `adMediaHeight()`
Get the height of the current ad media.

**Returns:** `Promise<number>`

**Signature:**
```typescript
adMediaHeight(): Promise<number>
```

**Example:**
```typescript
const height = await playerRef.current?.adMediaHeight();
console.log('Ad height:', height);
```

**Platforms:** iOS, Android

---

#### `adMediaClip()`
Get information about the current ad media clip.

**Returns:** `Promise<MediaClip>`

**Signature:**
```typescript
adMediaClip(): Promise<MediaClip>
```

**Example:**
```typescript
const adClip = await playerRef.current?.adMediaClip();
console.log('Ad clip:', adClip);
```

**Platforms:** iOS, Android

---

### Setter Methods

#### `setVolume(volume: number)`
Set the volume level.

**Parameters:**
- `volume` (number): Volume level between 0.0 (muted) and 1.0 (full volume)

**Signature:**
```typescript
setVolume(volume: number): Promise<void>
```

**Example:**
```typescript
// Set to 50% volume
playerRef.current?.setVolume(0.5);

// Set to full volume
playerRef.current?.setVolume(1.0);
```

**Platforms:** iOS, Android

---

#### `setMuted(muted: boolean)`
Set whether the player is muted.

**Parameters:**
- `muted` (boolean): `true` to mute, `false` to unmute

**Signature:**
```typescript
setMuted(muted: boolean): Promise<void>
```

**Example:**
```typescript
// Mute the player
playerRef.current?.setMuted(true);

// Unmute the player
playerRef.current?.setMuted(false);
```

**Platforms:** iOS, Android

---

## Player Events

### Setup & Lifecycle

#### `onDidSetupWithJsonUrl`
Fired when the player has completed setup with a JSON URL.

**Parameters:**
- `url` (string): The JSON URL that was used for setup

**Example:**
```typescript
<ExpoBBPlayerView
  onDidSetupWithJsonUrl={(url) => {
    console.log('Player setup complete with URL:', url);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerApiReady`
Fired when the player API is ready to use.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerApiReady={() => {
    console.log('Player API is ready');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerViewStarted`
Fired when a view session starts.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerViewStarted={() => {
    console.log('View started');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerViewFinished`
Fired when a view session finishes.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerViewFinished={() => {
    console.log('View finished');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidFailWithError`
Fired when the player encounters an error.

**Parameters:**
- `error` (string): Error message

**Example:**
```typescript
<ExpoBBPlayerView
  onDidFailWithError={(error) => {
    console.error('Player error:', error);
  }}
/>
```

**Platforms:** iOS, Android

---

### Media Loading

#### `onDidTriggerMediaClipLoaded`
Fired when a media clip has been loaded.

**Parameters:**
- `mediaClip` (MediaClip): The loaded media clip information

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerMediaClipLoaded={(clip) => {
    console.log('Clip loaded:', clip.title, clip.id);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerMediaClipFailed`
Fired when a media clip fails to load.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerMediaClipFailed={() => {
    console.log('Clip failed to load');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerProjectLoaded`
Fired when project data has been loaded.

**Parameters:**
- `project` (Project): The loaded project information

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerProjectLoaded={(project) => {
    console.log('Project loaded:', project.id);
  }}
/>
```

**Platforms:** iOS, Android

---

### Playback Events

#### `onDidTriggerCanPlay`
Fired when the player is ready to begin playback.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerCanPlay={() => {
    console.log('Player ready - can play');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerPlay`
Fired when playback is triggered (play button pressed or play() called).

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerPlay={() => {
    console.log('Play triggered');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerPlaying`
Fired when playback actually starts.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerPlaying={() => {
    console.log('Now playing');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerPause`
Fired when playback is paused.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerPause={() => {
    console.log('Playback paused');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerEnded`
Fired when playback reaches the end.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerEnded={() => {
    console.log('Playback ended');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerSeeking`
Fired when a seek operation starts.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerSeeking={() => {
    console.log('Seeking...');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerSeeked`
Fired when a seek operation completes.

**Parameters:**
- `position` (number): The position seeked to (in seconds)

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerSeeked={(position) => {
    console.log('Seeked to:', position);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerStall`
Fired when playback stalls (buffering).

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerStall={() => {
    console.log('Playback stalled - buffering');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerTimeUpdate`
Fired periodically during playback (4 times per second).

**Parameters:**
- `currentTime` (number): Current playback position (in seconds)
- `duration` (number): Total duration (in seconds)

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerTimeUpdate={(currentTime, duration) => {
    console.log(`Progress: ${currentTime}/${duration}`);
  }}
/>
```

**Platforms:** iOS, Android

**Note:** On iOS, duration is fetched from the player to match Android's event structure.

---

#### `onDidTriggerDurationChange`
Fired when the duration changes (e.g., when loading new content).

**Parameters:**
- `duration` (number): New duration in seconds

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerDurationChange={(duration) => {
    console.log('Duration:', duration, 'seconds');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerVolumeChange`
Fired when the volume level changes.

**Parameters:**
- `volume` (number): New volume level (0.0 to 1.0)

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerVolumeChange={(volume) => {
    console.log('Volume:', volume);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAutoPause`
Fired when the player auto-pauses.

**Parameters:**
- `why` (string): Reason for auto-pause

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAutoPause={(why) => {
    console.log('Auto-paused:', why);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAutoPausePlay`
Fired when auto-pause is canceled and playback resumes.

**Parameters:**
- `why` (string): Reason for resuming

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAutoPausePlay={(why) => {
    console.log('Auto-pause canceled:', why);
  }}
/>
```

**Platforms:** iOS, Android

---

### State Changes

#### `onDidTriggerPhaseChange`
Fired when the player phase changes.

**Parameters:**
- `phase` (Phase): New phase (`PRE`, `MAIN`, `POST`, or `EXIT`)

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerPhaseChange={(phase) => {
    console.log('Phase changed to:', phase);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerStateChange`
Fired when the playback state changes.

**Parameters:**
- `state` (State): New state (`IDLE`, `LOADING`, `READY`, `PLAYING`, `PAUSED`, `ENDED`, `ERROR`)

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerStateChange={(state) => {
    console.log('State changed to:', state);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerModeChange`
Fired when the player mode changes.

**Parameters:**
- `mode` (string): New mode (typically `"video"` or `"audio"`)

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerModeChange={(mode) => {
    console.log('Mode changed to:', mode);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerFullscreen`
Fired when entering fullscreen mode.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerFullscreen={() => {
    console.log('Entered fullscreen');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerRetractFullscreen`
Fired when exiting fullscreen mode.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerRetractFullscreen={() => {
    console.log('Exited fullscreen');
  }}
/>
```

**Platforms:** iOS, Android

---

### Ad Events

#### `onDidTriggerAdLoadStart`
Fired when an ad starts loading.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdLoadStart={() => {
    console.log('Ad loading started');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdLoaded`
Fired when an ad has loaded successfully.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdLoaded={() => {
    console.log('Ad loaded');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdNotFound`
Fired when no ad is available.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdNotFound={() => {
    console.log('No ad available');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdError`
Fired when an ad encounters an error.

**Parameters:**
- `error` (string): Error message

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdError={(error) => {
    console.error('Ad error:', error);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdStarted`
Fired when ad playback starts.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdStarted={() => {
    console.log('Ad started');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdQuartile1`
Fired when ad reaches 25% completion.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdQuartile1={() => {
    console.log('Ad 25% complete');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdQuartile2`
Fired when ad reaches 50% completion.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdQuartile2={() => {
    console.log('Ad 50% complete');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdQuartile3`
Fired when ad reaches 75% completion.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdQuartile3={() => {
    console.log('Ad 75% complete');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAdFinished`
Fired when ad playback completes.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAdFinished={() => {
    console.log('Ad finished');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerAllAdsCompleted`
Fired when all ads in an ad break have completed.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerAllAdsCompleted={() => {
    console.log('All ads completed');
  }}
/>
```

**Platforms:** iOS, Android

---

### User Interaction

#### `onDidRequestCollapse`
Fired when the user requests the player to collapse.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidRequestCollapse={() => {
    console.log('Collapse requested');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidRequestExpand`
Fired when the user requests the player to expand.

**Example:**
```typescript
<ExpoBBPlayerView
  onDidRequestExpand={() => {
    console.log('Expand requested');
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidRequestOpenUrl`
Fired when the user clicks a link in the player.

**Parameters:**
- `url` (string): The URL to open

**Example:**
```typescript
<ExpoBBPlayerView
  onDidRequestOpenUrl={(url) => {
    console.log('Open URL:', url);
    Linking.openURL(url);
  }}
/>
```

**Platforms:** iOS, Android

---

#### `onDidTriggerCustomStatistics`
Fired for custom statistics events.

**Parameters:**
- `customStatistics` (CustomStatistics): Custom statistics data

**Example:**
```typescript
<ExpoBBPlayerView
  onDidTriggerCustomStatistics={(stats) => {
    console.log('Custom statistics:', stats);
  }}
/>
```

**Platforms:** iOS, Android

---

## Platform Differences

### iOS-Specific Notes

1. **Time Updates**: iOS SDK sends time updates with only `currentTime` parameter. The wrapper fetches `duration` from the player to provide a consistent event structure across platforms.

2. **Fullscreen Methods**: iOS SDK uses `enterFullScreen()` and `exitFullScreen()` methods (camelCase 'Screen'), but the Expo module exposes them as `enterFullscreen()` and `exitFullscreen()` (lowercase 'screen') for consistency with Android.

3. **Volume Type**: iOS SDK returns `Float` for volume, while Android returns `Double`. Both are compatible with JavaScript numbers.

4. **Controls Property**: The `controls()` getter may return `null` on iOS if this property is not available in the native SDK.

### Android-Specific Notes

1. **Layout System**: Android implementation uses `shouldUseAndroidLayout = true` to ensure native Android layout is used instead of React Native's Yoga layout system. This is critical for native player controls to work properly.

2. **Time Updates**: Android calculates time updates client-side using a timer (4 times per second) for smooth progress tracking.

### Event Naming

- iOS uses the prefix `onDidTrigger` for most events (e.g., `onDidTriggerPlay`)
- Android internally uses simpler names (e.g., `onPlay`)
- Both platforms expose events with the `onDidTrigger` prefix to React Native for consistency

---

## Complete Example

```typescript
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export default function App() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  return (
    <View style={styles.container}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/6323522.json"
        options={{
          autoPlay: true,
          allowCollapseExpand: true,
        }}
        // Setup & Lifecycle
        onDidSetupWithJsonUrl={(url) => {
          console.log('Setup complete:', url);
          playerRef.current?.play();
        }}
        onDidTriggerApiReady={() => {
          console.log('API ready');
        }}
        onDidFailWithError={(error) => {
          console.error('Error:', error);
        }}
        // Media Loading
        onDidTriggerMediaClipLoaded={(clip) => {
          console.log('Clip loaded:', clip.title);
        }}
        onDidTriggerProjectLoaded={(project) => {
          console.log('Project loaded:', project.id);
        }}
        // Playback
        onDidTriggerPlaying={() => {
          console.log('Playing');
        }}
        onDidTriggerPause={() => {
          console.log('Paused');
        }}
        onDidTriggerTimeUpdate={(currentTime, duration) => {
          console.log(`${currentTime}/${duration}`);
        }}
        // State Changes
        onDidTriggerPhaseChange={(phase) => {
          console.log('Phase:', phase);
        }}
        onDidTriggerStateChange={(state) => {
          console.log('State:', state);
        }}
        // Ads
        onDidTriggerAdStarted={() => {
          console.log('Ad started');
        }}
        onDidTriggerAdFinished={() => {
          console.log('Ad finished');
        }}
        style={styles.player}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    flex: 1,
  },
});
```

---

## License

See the main README.md for license information.
