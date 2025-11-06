# expo-bb-player

React Native implementation of the Blue Billywig Outstream Native Player for Expo and bare React Native apps.

## Compatibility

This package works with:
- ✅ **Expo apps** (managed or bare workflow)
- ✅ **Bare React Native apps** (requires Expo Modules - see installation below)

> **Note for Bare React Native Apps**: This package uses Expo Modules for native integration. If you're not using Expo, you'll need to install `expo-modules-core` first (one-time setup, ~1 minute). See "For Bare React Native Projects" below.

## Installation

### For Expo Managed Projects

If you're using an Expo managed project (created with `create-expo-app`), simply install the package:

```bash
npx expo install expo-bb-player
```

Then run prebuild to generate native directories:

```bash
# For iOS
npx expo prebuild -p ios

# For Android
npx expo prebuild -p android
```

### For Bare React Native Projects

#### Prerequisites

This library is an Expo module, so you need to have Expo modules installed in your project first. If you haven't installed Expo modules yet, follow these steps:

1. **Automatic Setup (Recommended):**

```bash
npx install-expo-modules@latest
```

This command will automatically configure your project to use Expo modules. For more details, see the [official Expo documentation](https://docs.expo.dev/bare/installing-expo-modules/).

2. **Manual Setup:**

If the automatic installation fails, follow the [manual installation guide](https://docs.expo.dev/bare/installing-expo-modules/#manual-installation) in the Expo documentation.

#### Installing expo-bb-player

Once Expo modules are installed in your project:

1. Install the package:

```bash
npx expo install expo-bb-player
# or
npm install expo-bb-player
```

2. **For iOS**, install CocoaPods dependencies:

```bash
npx pod-install
```

3. **For Android**, the dependencies will be automatically linked through autolinking.

4. Rebuild your app:

```bash
# For iOS
npx expo run:ios
# or
npx react-native run-ios

# For Android
npx expo run:android
# or
npx react-native run-android
```

## Basic Usage

Here's a simple example of how to use the Blue Billywig Player:

```tsx
import React, { useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export default function App() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  return (
    <View style={styles.container}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="YOUR_BLUE_BILLYWIG_JSON_URL"
        options={{
          autoPlay: false,
          allowCollapseExpand: true,
        }}
        onDidTriggerPlay={() => {
          console.log('Player started playing');
        }}
        onDidTriggerPause={() => {
          console.log('Player paused');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

## Advanced Example

Here's a more advanced example with event handlers and player controls:

```tsx
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { 
  ExpoBBPlayerView, 
  type ExpoBBPlayerViewType,
  type State,
  type Phase 
} from 'expo-bb-player';

export default function AdvancedPlayer() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);
  const [playerState, setPlayerState] = useState<State>('IDLE');
  const [playerPhase, setPlayerPhase] = useState<Phase>('INIT');
  const [duration, setDuration] = useState(0);

  const handleEnterFullscreen = () => {
    playerRef.current?.enterFullscreen();
  };

  const handleSeek = (position: number) => {
    playerRef.current?.seek(position);
  };

  const handleSetVolume = (volume: number) => {
    playerRef.current?.setVolume(volume);
  };

  return (
    <View style={styles.container}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="YOUR_BLUE_BILLYWIG_JSON_URL"
        options={{
          autoPlay: true,
          autoMute: false,
          allowCollapseExpand: true,
        }}
        onDidTriggerStateChange={(state) => {
          setPlayerState(state);
          console.log('State changed:', state);
        }}
        onDidTriggerPhaseChange={(phase) => {
          setPlayerPhase(phase);
          console.log('Phase changed:', phase);
        }}
        onDidTriggerDurationChange={(duration) => {
          setDuration(duration);
          console.log('Duration:', duration);
        }}
        onDidTriggerProjectLoaded={(project) => {
          console.log('Project loaded:', project);
        }}
        onDidTriggerMediaClipLoaded={(mediaClip) => {
          console.log('Media clip loaded:', mediaClip);
        }}
        onDidFailWithError={(error) => {
          console.error('Player error:', error);
        }}
        onDidTriggerAdStarted={() => {
          console.log('Ad started');
        }}
        onDidTriggerAdFinished={() => {
          console.log('Ad finished');
        }}
      />
      <View style={styles.info}>
        <Text>State: {playerState}</Text>
        <Text>Phase: {playerPhase}</Text>
        <Text>Duration: {duration.toFixed(2)}s</Text>
      </View>
      <View style={styles.controls}>
        <Button title="Fullscreen" onPress={handleEnterFullscreen} />
        <Button title="Seek to 10s" onPress={() => handleSeek(10)} />
        <Button title="Volume 50%" onPress={() => handleSetVolume(0.5)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  info: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
});
```

## API Reference

### Props

| Prop | Type | Description |
|------|------|-------------|
| `jsonUrl` | `string` | The Blue Billywig JSON URL for the media |
| `options` | `Record<string, unknown>` | Player configuration options passed through to the native SDK |
| `style` | `ViewStyle` | Styling for the player container |
| Event props | See Events | Subscribe to native player events (see Events section below) |

### Player Options

Common options you can pass to the `options` prop:

```typescript
{
  autoPlay: boolean;           // Auto-play the video
  allowCollapseExpand: boolean; // Allow collapse/expand functionality
  autoLoop: boolean;            // Loop the video

}
```

### Methods

Access these methods via the player ref:

```typescript
// Playback controls
play(): Promise<void>
pause(): Promise<void>
seek(position: number): Promise<void>

// Volume controls
setVolume(volume: number): Promise<void>  // 0.0 - 1.0
setMuted(muted: boolean): Promise<void>

// Fullscreen controls
// Android: implemented. iOS: currently no-op.
enterFullscreen(): Promise<void>
exitFullscreen(): Promise<void>

// Expand/Collapse controls (outstream sizing)
expand(): Promise<void>
collapse(): Promise<void>

// Ad/clip data
adMediaHeight(): Promise<number | undefined>
adMediaWidth(): Promise<number | undefined>
adMediaClip(): Promise<MediaClip | undefined>
autoPlayNextCancel(): Promise<void>

// State getters
playerState(): Promise<State>
phase(): Promise<Phase>
duration(): Promise<number | undefined>
volume(): Promise<number | undefined>
muted(): Promise<boolean | undefined>
inView(): Promise<boolean | undefined>
mode(): Promise<string | undefined>
controls(): Promise<boolean | undefined> // Android only; iOS returns undefined
playoutData(): Promise<Playout | undefined>
projectData(): Promise<Project | undefined>
```

Platform notes:

- iOS: `enterFullscreen` and `exitFullscreen` are currently not supported.
- iOS: `controls()` is not exposed by the native SDK and will return `undefined`.

### Events

All events below are exposed as optional props on `ExpoBBPlayerView`. Payload types are indicated in parentheses.

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidFailWithError` | `string` | A fatal or setup error occurred |
| `onDidRequestCollapse` | - | Player requested to collapse (outstream) |
| `onDidRequestExpand` | - | Player requested to expand (outstream) |
| `onDidRequestOpenUrl` | `string` | Player requested to open a URL |
| `onDidSetupWithJsonUrl` | `string` | Player finished initial setup with the provided JSON URL |
| `onDidTriggerCanPlay` | - | Player is ready; API getters should now be available |
| `onDidTriggerPlay` | - | Playback started |
| `onDidTriggerPause` | - | Playback paused |
| `onDidTriggerPlaying` | - | Playback is progressing |
| `onDidTriggerEnded` | - | Playback ended |
| `onDidTriggerStateChange` | `State` | Player state changed |
| `onDidTriggerPhaseChange` | `Phase` | Player phase changed |
| `onDidTriggerDurationChange` | `number` | Media duration changed |
| `onDidTriggerVolumeChange` | `number` | Volume changed |
| `onDidTriggerSeeked` | `number` | Seek completed to the provided position (seconds) |
| `onDidTriggerSeeking` | - | Seek started |
| `onDidTriggerFullscreen` | - | Entered fullscreen |
| `onDidTriggerRetractFullscreen` | - | Exited fullscreen |
| `onDidTriggerModeChange` | `string` | Player mode changed |
| `onDidTriggerProjectLoaded` | `Project` | Project loaded |
| `onDidTriggerMediaClipLoaded` | `MediaClip` | Media clip loaded |
| `onDidTriggerMediaClipFailed` | - | Media clip failed to load |
| `onDidTriggerStall` | - | Playback stalled |
| `onDidTriggerCustomStatistics` | `{ ident: string; ev: string; aux: Record<string,string>; }` | Custom statistics event |
| `onDidTriggerAutoPause` | Android: `string` (why) · iOS: `void` | Auto-pause was triggered |
| `onDidTriggerAutoPausePlay` | Android: `string` (why) · iOS: `void` | Auto-pause resume was triggered |
| `onDidTriggerAdLoadStart` | - | Ad load started |
| `onDidTriggerAdLoaded` | - | Ad loaded |
| `onDidTriggerAdStarted` | - | Ad started |
| `onDidTriggerAdQuartile1` | - | Ad reached 25% |
| `onDidTriggerAdQuartile2` | - | Ad reached 50% |
| `onDidTriggerAdQuartile3` | - | Ad reached 75% |
| `onDidTriggerAdFinished` | - | Ad finished |
| `onDidTriggerAdNotFound` | - | No ad was available |
| `onDidTriggerAdError` | `string` | Ad-related error |
| `onDidTriggerAllAdsCompleted` | - | All ads completed |
| `onDidTriggerViewStarted` | - | View tracking started |
| `onDidTriggerViewFinished` | - | View tracking finished |

Platform notes:

- Android and iOS emit the full set of events above. On iOS, `onDidTriggerAutoPause` and `onDidTriggerAutoPausePlay` do not include the `why` payload, while on Android the `why` string is provided.
- Some events are emitted only when relevant (e.g., ad-related events only during ad playback).

### Types

```typescript
type State = "IDLE" | "LOADING" | "PLAYING" | "PAUSED" | "ERROR";
type Phase = "INIT" | "PRE" | "MAIN" | "POST" | "EXIT";
// Selected payload types used in events and getters
type CustomStatistics = { ident: string; ev: string; aux: Record<string, string> };
type Project = { /* see src/types.ts for full shape */ };
type MediaClip = { /* see src/types.ts for full shape */ };
type Playout = { /* see src/types.ts for full shape */ };
```

## Example Project

Check out the `/example` directory for a complete working example with:

- Multiple player configurations
- Event handling demonstrations
- API usage examples

To run the example:

```bash
cd example
npm install

# For iOS
npx expo run:ios

# For Android
npx expo run:android
```

## Publishing and Repository Setup

This package is designed to be published as a standalone npm package.

### For Package Maintainers

- **Publishing to npm**: See [PUBLISHING.md](./PUBLISHING.md) for detailed instructions on publishing this package
- **Separate Repository Setup**: See [docs/SEPARATE_REPO_SETUP.md](./docs/SEPARATE_REPO_SETUP.md) for instructions on extracting this package to its own GitHub repository

### Repository Structure

When published as a standalone package, this module is intended to be at:
- **GitHub**: `https://github.com/bluebillywig/expo-bb-player`
- **npm**: `expo-bb-player`

Other packages like `expo-bb-channel` depend on this as a published npm package.

## Related Packages

- [expo-bb-channel](https://github.com/bluebillywig/channel/tree/main/packages/expo-bb-channel) - Full channel SDK with WebView + Native Player integration

## License

ISC
