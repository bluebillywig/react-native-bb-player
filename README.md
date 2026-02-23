# react-native-bb-player

Native video player for React Native - powered by Blue Billywig's iOS and Android SDKs.

## Overview

`react-native-bb-player` provides a production-ready, native video player component for React Native. It wraps Blue Billywig's native iOS and Android player SDKs, giving you:

- **True native playback** - iOS AVPlayer and Android ExoPlayer (no WebView)
- **Full-featured player** - Ads, analytics, Content Protection
- **Type-safe API** - Full TypeScript support with comprehensive types
- **Production ready** - Built on Blue Billywig's battle-tested native SDKs
- **Easy integration** - Simple component-based API with imperative ref methods

## Compatibility

| Platform | Requirement | Player Engine |
|----------|-------------|---------------|
| **iOS** | 12.0+ | AVPlayer |
| **Android** | API 21+ (5.0+) | ExoPlayer |
| **React Native** | 0.73+ | Old & New Architecture (TurboModules) |
| **Expo** | SDK 51+ | With config plugin (optional) |

## Installation

```bash
npm install @bluebillywig/react-native-bb-player
# or
yarn add @bluebillywig/react-native-bb-player
```

### Bare React Native

#### iOS Setup

```bash
cd ios && pod install && cd ..
```

#### Android Setup

No additional setup needed - autolinking handles it automatically.

#### Rebuild Your App

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

### Expo (Development Build)

> **Note**: This SDK requires native code and cannot run in Expo Go. You must use a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

```bash
npx expo install @bluebillywig/react-native-bb-player
```

Add the config plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@bluebillywig/react-native-bb-player"
    ]
  }
}
```

Then build your development app:

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

See the [Expo Setup Guide](docs/guides/expo-setup.md) for detailed configuration options.

### Guides

- [Expo Setup Guide](docs/guides/expo-setup.md) - Expo configuration and prebuild
- [Fullscreen & Modal Player Guide](docs/guides/fullscreen.md) - Fullscreen, landscape, and modal-style presentation
- [Advertising Guide](docs/guides/advertising.md) - Ad integration and VAST/VPAID
- [Analytics Guide](docs/guides/analytics.md) - Analytics integration and custom statistics
- [Shorts Guide](docs/guides/shorts.md) - Vertical video player (TikTok-style experience)
- [Outstream Guide](docs/guides/outstream.md) - Outstream advertising with collapse/expand
- [Deep Linking Guide](docs/guides/deep-linking.md) - Open video content via URLs

## Quick Start

Here's the simplest way to get started:

```tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export default function App() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  return (
    <View style={styles.container}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        options={{
          autoPlay: true,
          allowCollapseExpand: true,
        }}
        onDidTriggerPlay={() => console.log('Playing')}
        onDidTriggerPause={() => console.log('Paused')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
```

## Usage Examples

### Basic Video Player

Minimal setup to play a video:

```tsx
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function BasicPlayer() {
  return (
    <BBPlayerView
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      options={{ autoPlay: false }}
      style={{ flex: 1 }}
    />
  );
}
```

### With Player Controls

Control playback programmatically:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function ControlledPlayer() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  const handlePlay = () => {
    playerRef.current?.play();
  };

  const handlePause = () => {
    playerRef.current?.pause();
  };

  const handleSeek = () => {
    playerRef.current?.seek(30); // Seek to 30 seconds
  };

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Play" onPress={handlePlay} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Seek to 30s" onPress={handleSeek} />
      </View>
    </View>
  );
}
```

### With Event Listeners

Listen to player events:

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BBPlayerView, type State, type Phase } from '@bluebillywig/react-native-bb-player';

export function EventListenerExample() {
  const [playerState, setPlayerState] = useState<State>('IDLE');
  const [playerPhase, setPlayerPhase] = useState<Phase>('INIT');
  const [duration, setDuration] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        options={{ autoPlay: true }}
        style={{ flex: 1 }}
        onDidTriggerStateChange={(state) => setPlayerState(state)}
        onDidTriggerPhaseChange={(phase) => setPlayerPhase(phase)}
        onDidTriggerDurationChange={(dur) => setDuration(dur)}
        onDidTriggerPlay={() => console.log('Playback started')}
        onDidTriggerPause={() => console.log('Playback paused')}
        onDidTriggerEnded={() => console.log('Playback ended')}
      />
      <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
        <Text>State: {playerState}</Text>
        <Text>Phase: {playerPhase}</Text>
        <Text>Duration: {duration.toFixed(1)}s</Text>
      </View>
    </View>
  );
}
```

### Dynamic Content Loading

Load different content without recreating the player:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function DynamicLoading() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
      />
      <View style={{ padding: 10 }}>
        {/* Primary API - loadClip with options */}
        <Button
          title="Load Clip 123"
          onPress={() => playerRef.current?.loadClip('123', { autoPlay: true })}
        />
        <Button
          title="Load with Playout"
          onPress={() => playerRef.current?.loadClip('456', { playout: 'default', autoPlay: true })}
        />
        {/* Legacy API - still supported */}
        <Button
          title="Load ClipList"
          onPress={() => playerRef.current?.loadWithClipListId('789', 'user', true)}
        />
      </View>
    </View>
  );
}
```

### Loading with Playlist Context

When loading clips within a playlist, pass context to enable "next up" navigation and proper playlist handling:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods, type LoadContext } from '@bluebillywig/react-native-bb-player';

export function PlaylistPlayer() {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const playlistId = '12345';

  // Load a clip from a playlist with context for "next up" navigation
  const loadClipFromPlaylist = (clipId: string) => {
    playerRef.current?.loadClip(clipId, {
      autoPlay: true,
      playout: 'default',
      context: {
        contextEntityType: 'MediaClipList',
        contextEntityId: playlistId,
        contextCollectionType: 'MediaClipList',
        contextCollectionId: playlistId,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Load Video 1" onPress={() => loadClipFromPlaylist('clip1')} />
        <Button title="Load Video 2" onPress={() => loadClipFromPlaylist('clip2')} />
        <Button title="Load Video 3" onPress={() => loadClipFromPlaylist('clip3')} />
      </View>
    </View>
  );
}
```

The context enables:
- **Next Up List**: Shows upcoming videos from the playlist
- **Playlist Navigation**: Previous/next buttons work correctly within the playlist
- **Proper Analytics**: Analytics correctly attribute views to the playlist context

### Fullscreen Player

Launch player in fullscreen mode:

```tsx
import React, { useRef, useEffect } from 'react';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function FullscreenPlayer() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  return (
    <BBPlayerView
      ref={playerRef}
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      options={{ autoPlay: true }}
      style={{ flex: 1 }}
      onDidTriggerApiReady={() => {
        // Enter fullscreen landscape once the player is ready
        playerRef.current?.enterFullscreenLandscape();
      }}
      onDidTriggerRetractFullscreen={() => {
        console.log('User exited fullscreen');
      }}
    />
  );
}
```

See the [Fullscreen & Modal Player Guide](docs/guides/fullscreen.md) for advanced patterns including modal-style presentation and handling orientation.

### Chromecast Support

Open the Google Cast device picker to cast video to Chromecast devices:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function ChromecastPlayer() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  const handleCast = () => {
    playerRef.current?.showCastPicker();
  };

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
      />
      <Button title="Cast to Device" onPress={handleCast} />
    </View>
  );
}
```

> **Note:** Chromecast functionality is available on both iOS and Android platforms.

## API Reference

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `jsonUrl` | `string` | Yes | Blue Billywig media JSON URL |
| `playerId` | `string` | No | Unique identifier for multi-player scenarios |
| `jwt` | `string` | No | JWT token for authenticated playback |
| `options` | `Record<string, unknown>` | No | Player configuration options |
| `style` | `ViewStyle` | No | React Native style object |
| Event props | See below | No | Event callback handlers |

### Methods (via ref)

```typescript
// Playback Control
play(): void
pause(): void
seek(position: number): void
seekRelative(offsetSeconds: number): void

// Volume Control
setVolume(volume: number): void
setMuted(muted: boolean): void

// Layout Control
collapse(): void
expand(): void
enterFullscreen(): void
enterFullscreenLandscape(): void
exitFullscreen(): void

// Chromecast
showCastPicker(): void

// Load Content (Primary API)
loadClip(clipId: string, options?: LoadClipOptions): void

// Load Content (Legacy - all support optional context parameter)
loadWithClipId(clipId: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext): void
loadWithClipListId(clipListId: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext): void
loadWithProjectId(projectId: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext): void
loadWithClipJson(clipJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext): void
loadWithClipListJson(clipListJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext): void
loadWithProjectJson(projectJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number, context?: LoadContext): void
loadWithJsonUrl(jsonUrl: string, autoPlay?: boolean, context?: LoadContext): void

// Async Getters (Primary API)
getPlayerState(): Promise<BBPlayerState | null>  // Returns complete player state

// Async Getters (Individual)
getDuration(): Promise<number | null>
getMuted(): Promise<boolean | null>
getVolume(): Promise<number | null>
getPhase(): Promise<string | null>
getState(): Promise<string | null>
getMode(): Promise<string | null>
getClipData(): Promise<{ id?: string; title?: string; description?: string; length?: number } | null>
getProjectData(): Promise<{ id?: string; name?: string } | null>
getPlayoutData(): Promise<{ name?: string } | null>

// Cleanup
destroy(): void
autoPlayNextCancel(): void
```

### Events

```typescript
// Setup & Lifecycle
onDidSetupWithJsonUrl?: (url: string) => void
onDidTriggerApiReady?: () => void
onDidFailWithError?: (error: string) => void

// Playback
onDidTriggerPlay?: () => void
onDidTriggerPause?: () => void
onDidTriggerPlaying?: () => void
onDidTriggerEnded?: () => void
onDidTriggerCanPlay?: () => void
onDidTriggerSeeking?: () => void
onDidTriggerSeeked?: (position: number) => void
onDidTriggerStall?: () => void
onDidTriggerDurationChange?: (duration: number) => void
onDidTriggerVolumeChange?: (volume: number) => void

// State Changes
onDidTriggerStateChange?: (state: State) => void
onDidTriggerPhaseChange?: (phase: Phase) => void
onDidTriggerModeChange?: (mode: string) => void

// Media Loading
onDidTriggerMediaClipLoaded?: (clip: MediaClip) => void
onDidTriggerMediaClipFailed?: () => void
onDidTriggerProjectLoaded?: (project: Project) => void

// View Events
onDidTriggerViewStarted?: () => void
onDidTriggerViewFinished?: () => void

// Fullscreen
onDidTriggerFullscreen?: () => void
onDidTriggerRetractFullscreen?: () => void

// Layout
onDidRequestCollapse?: () => void
onDidRequestExpand?: () => void
onDidRequestOpenUrl?: (url: string) => void

// Auto-Pause
onDidTriggerAutoPause?: (why: string) => void
onDidTriggerAutoPausePlay?: (why: string) => void

// Ads
onDidTriggerAdLoadStart?: () => void
onDidTriggerAdLoaded?: () => void
onDidTriggerAdStarted?: () => void
onDidTriggerAdFinished?: () => void
onDidTriggerAdNotFound?: () => void
onDidTriggerAdError?: (error: string) => void
onDidTriggerAdQuartile1?: () => void
onDidTriggerAdQuartile2?: () => void
onDidTriggerAdQuartile3?: () => void
onDidTriggerAllAdsCompleted?: () => void

// Custom Statistics (for analytics integration)
onDidTriggerCustomStatistics?: (stats: CustomStatistics) => void
```

> **Note:** See the [Analytics Guide](docs/guides/analytics.md) for detailed analytics integration examples.

### TypeScript Types

```typescript
// Player state enum
type State = "IDLE" | "LOADING" | "PLAYING" | "PAUSED" | "ERROR";
type Phase = "INIT" | "PRE" | "MAIN" | "POST" | "EXIT";

// Options for loadClip()
type LoadClipOptions = {
  playout?: string;    // Playout name/ID
  autoPlay?: boolean;  // Auto-play after loading
  seekTo?: number;     // Seek to position (seconds)
  initiator?: string;  // Analytics initiator
  context?: LoadContext; // Playlist/collection context
};

// Context for playlist/collection navigation
type LoadContext = {
  contextEntityType?: 'MediaClipList';   // Type of the containing entity
  contextEntityId?: string;              // Playlist ID for "next up" list
  contextCollectionType?: 'MediaClipList'; // Type of the collection
  contextCollectionId?: string;          // Collection ID if playing within a collection
};

// Complete player state object (returned by getPlayerState())
type BBPlayerState = {
  state: State;
  phase: Phase;
  mode: string | null;
  duration: number;
  muted: boolean;
  volume: number;
  clip: { id?: string; title?: string; description?: string; length?: number } | null;
  project: { id?: string; name?: string } | null;
  playout: { name?: string } | null;
};

// Event payload types (for typed event handling)
type BBPlayerEventPayloads = {
  play: void;
  pause: void;
  stateChange: { state: State };
  phaseChange: { phase: Phase };
  // ... and more
};
```

## Getting Complete Player State

Use `getPlayerState()` to fetch all player state at once:

```tsx
const handleGetState = async () => {
  const state = await playerRef.current?.getPlayerState();
  if (state) {
    console.log(`Playing: ${state.state === 'PLAYING'}`);
    console.log(`Duration: ${state.duration}`);
    console.log(`Clip: ${state.clip?.title}`);
    console.log(`Volume: ${state.volume}, Muted: ${state.muted}`);
  }
};
```

## Overriding Native SDK Versions

### Current Versions

- **iOS**: `~>8.40` (Blue Billywig Native Player Kit)
- **Android**: `8.42.+` (Blue Billywig Native Player SDK)

### Override iOS (in Podfile)

```ruby
pod 'BlueBillywigNativePlayerKit-iOS', '8.42.0'
```

### Override Android (in android/app/build.gradle)

```kotlin
configurations.all {
  resolutionStrategy {
    force 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.42.0'
  }
}
```

## Troubleshooting

### "Module not found"

1. Ensure the package is installed
2. Run `cd ios && pod install`
3. Rebuild the app completely

### Black Screen on Player

- Check the JSON URL is correct and accessible
- Verify internet connectivity
- Add error handling to debug:

```tsx
<BBPlayerView
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidFailWithError={(error) => console.error('Player error:', error)}
  onDidSetupWithJsonUrl={(url) => console.log('Player setup complete:', url)}
/>
```

### Player Not Responding to Method Calls

Ensure the player is ready before calling methods:

```tsx
const [isReady, setIsReady] = useState(false);

<BBPlayerView
  ref={playerRef}
  onDidTriggerCanPlay={() => setIsReady(true)}
/>

// Then call methods
if (isReady) {
  playerRef.current?.play();
}
```

### iOS Build Fails

1. Run `cd ios && pod deintegrate && pod install`
2. Clean build folder in Xcode

### Android Build Fails

1. Run `cd android && ./gradlew clean`
2. Ensure JDK 17+ is installed

### Safe Area Handling (iOS + Android)

React Native's built-in `SafeAreaView` doesn't work consistently across platforms. For reliable safe area handling on both iOS and Android, use [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context):

```bash
npm install react-native-safe-area-context
```

**Setup:**
```tsx
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <MyScreen />
    </SafeAreaProvider>
  );
}
```

**In your screens:**
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

function PlayerScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BBPlayerView jsonUrl="..." style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
```

**For more control with insets:**
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <BBPlayerView jsonUrl="..." style={{ flex: 1 }} />
    </View>
  );
}
```

## New Architecture (Fabric & TurboModules)

This package fully supports React Native's New Architecture, including:

- **Fabric** - The new rendering system
- **TurboModules** - The new native module system with synchronous access and lazy loading

### Automatic Detection

The package automatically detects which architecture your app uses:
- **New Architecture enabled**: Uses `TurboModuleRegistry` for optimal performance
- **Old Architecture**: Falls back to `NativeModules` (no changes needed)

### Enabling New Architecture

#### React Native 0.76+
New Architecture is enabled by default in React Native 0.76 and later.

#### React Native 0.73-0.75
Enable in your app's configuration:

**Android** (`android/gradle.properties`):
```properties
newArchEnabled=true
```

**iOS** (`ios/Podfile`):
```ruby
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

Then rebuild your app:
```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### No Code Changes Required

Your existing code works with both architectures. The package handles the architecture detection internally:

```tsx
// This works on both Old and New Architecture
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

<BBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidTriggerPlay={() => console.log('Playing')}
/>
```

## FAQ

### Can I use this in production?

Yes! This package wraps Blue Billywig's production-grade native SDKs used by major media companies.


### Does this support ads?

Yes, the player includes full ad support (VAST, VPAID, etc.). Configure ads in your Blue Billywig playout configuration.

### What video formats are supported?

The player supports formats compatible with:
- iOS: AVPlayer (HLS, MP4, M4V, MOV, etc.)
- Android: ExoPlayer (HLS, DASH, MP4, WebM, etc.)

### How do I get a JSON URL?

Contact Blue Billywig to get access to your media content. The JSON URL format is:
```
https://{your-domain}.bbvms.com/p/{playout}/c/{clipId}.json
```

## API Documentation

Full TypeScript API documentation is available at:

**https://bluebillywig.github.io/react-native-bb-player/**

The documentation is automatically generated from source code and updated on every release.

## Support

### Issues
- GitHub Issues: https://github.com/bluebillywig/react-native-bb-player/issues
- Include:
  - React Native version
  - Platform (iOS/Android)
  - Reproduction steps

## License

MIT

---

**Built with love by Blue Billywig**
