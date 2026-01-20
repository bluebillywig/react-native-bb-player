# react-native-bb-player

Native video player for React Native - powered by Blue Billywig's iOS (AVPlayer) and Android (ExoPlayer) SDKs.

## Overview

`@bluebillywig/react-native-bb-player` provides a production-ready, native video player component for React Native. It wraps Blue Billywig's native iOS and Android player SDKs, giving you:

- **True native playback** - iOS AVPlayer and Android ExoPlayer (no WebView)
- **Full-featured player** - Ads, analytics, DRM, Picture-in-Picture support
- **Type-safe API** - Full TypeScript support with comprehensive types
- **Production ready** - Built on Blue Billywig's battle-tested native SDKs
- **Easy integration** - Simple component-based API
- **New Architecture support** - Works with both Fabric and Paper

## Compatibility

| Platform | Requirement | Player Engine |
|----------|-------------|---------------|
| **iOS** | 12.0+ | AVPlayer |
| **Android** | API 21+ (5.0+) | ExoPlayer |
| **React Native** | 0.73+ | Both Old and New Architecture |

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Installation

```bash
npm install @bluebillywig/react-native-bb-player
# or
yarn add @bluebillywig/react-native-bb-player
```

### iOS Setup

```bash
cd ios && pod install && cd ..
```

### Android Setup

No additional setup needed - autolinking handles it automatically.

### Rebuild Your App

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

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
        autoPlay={true}
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
      autoPlay={false}
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

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Play" onPress={() => playerRef.current?.play()} />
        <Button title="Pause" onPress={() => playerRef.current?.pause()} />
        <Button title="Seek +10s" onPress={() => playerRef.current?.seekRelative(10)} />
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
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function EventListenerExample() {
  const [playerState, setPlayerState] = useState('IDLE');
  const [phase, setPhase] = useState('INIT');

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        autoPlay={true}
        style={{ flex: 1 }}
        onDidTriggerStateChange={(state) => setPlayerState(state)}
        onDidTriggerPhaseChange={(p) => setPhase(p)}
        onDidTriggerPlay={() => console.log('Playback started')}
        onDidTriggerPause={() => console.log('Playback paused')}
        onDidTriggerEnded={() => console.log('Playback ended')}
      />
      <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
        <Text>State: {playerState}</Text>
        <Text>Phase: {phase}</Text>
      </View>
    </View>
  );
}
```

### Loading Different Content

Load different videos dynamically:

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
        jsonUrl="https://demo.bbvms.com/p/native_sdk/c/4256593.json"
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button
          title="Load Clip 1"
          onPress={() => playerRef.current?.loadWithClipId('4256575', 'external', true, 0)}
        />
        <Button
          title="Load Clip 2"
          onPress={() => playerRef.current?.loadWithClipId('4256593', 'external', true, 0)}
        />
        <Button
          title="Load ClipList"
          onPress={() => playerRef.current?.loadWithClipListId('1619442239940600', 'external', true, 0)}
        />
      </View>
    </View>
  );
}
```

### Fullscreen Player

Control fullscreen mode:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function FullscreenPlayer() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        autoPlay={true}
        style={{ flex: 1 }}
        onDidTriggerFullscreen={() => console.log('Entered fullscreen')}
        onDidTriggerRetractFullscreen={() => console.log('Exited fullscreen')}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Fullscreen" onPress={() => playerRef.current?.enterFullscreen()} />
        <Button title="Fullscreen Landscape" onPress={() => playerRef.current?.enterFullscreenLandscape()} />
        <Button title="Exit" onPress={() => playerRef.current?.exitFullscreen()} />
      </View>
    </View>
  );
}
```

### Chromecast Support

Open the Google Cast device picker:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function ChromecastPlayer() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
      />
      <Button title="Cast to Device" onPress={() => playerRef.current?.showCastPicker()} />
    </View>
  );
}
```

## API Reference

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `jsonUrl` | `string` | Yes | Blue Billywig media JSON URL |
| `autoPlay` | `boolean` | No | Auto-start playback (default: false) |
| `enableTimeUpdates` | `boolean` | No | Enable time update events (default: false) |
| `options` | `object` | No | Additional player options |
| `style` | `ViewStyle` | No | React Native style object |

### Methods

All methods are available via ref:

```typescript
const playerRef = useRef<BBPlayerViewMethods>(null);

// Playback Control
playerRef.current?.play();
playerRef.current?.pause();
playerRef.current?.seek(30);           // Seek to 30 seconds
playerRef.current?.seekRelative(10);   // Seek forward 10 seconds

// Volume Control
playerRef.current?.setVolume(0.5);     // 0.0 to 1.0
playerRef.current?.setMuted(true);

// Fullscreen
playerRef.current?.enterFullscreen();
playerRef.current?.enterFullscreenLandscape();
playerRef.current?.exitFullscreen();

// Load Content
playerRef.current?.loadWithClipId(clipId, initiator?, autoPlay?, seekTo?);
playerRef.current?.loadWithClipListId(clipListId, initiator?, autoPlay?, seekTo?);
playerRef.current?.loadWithProjectId(projectId, initiator?, autoPlay?, seekTo?);

// Getters (async)
const duration = await playerRef.current?.getDuration();
const currentTime = await playerRef.current?.getCurrentTime();
const volume = await playerRef.current?.getVolume();
const muted = await playerRef.current?.getMuted();
const state = await playerRef.current?.getState();
const phase = await playerRef.current?.getPhase();
const mode = await playerRef.current?.getMode();
const clipData = await playerRef.current?.getClipData();

// Other
playerRef.current?.showCastPicker();
playerRef.current?.destroy();
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
onDidTriggerSeeking?: () => void
onDidTriggerSeeked?: (position: number) => void
onDidTriggerCanPlay?: () => void
onDidTriggerStall?: () => void

// State Changes
onDidTriggerStateChange?: (state: string) => void
onDidTriggerPhaseChange?: (phase: string) => void
onDidTriggerModeChange?: (mode: string) => void

// Media
onDidTriggerMediaClipLoaded?: (clip: ClipData) => void
onDidTriggerMediaClipFailed?: () => void
onDidTriggerDurationChange?: (duration: number) => void
onDidTriggerVolumeChange?: (volume: number) => void
onDidTriggerTimeUpdate?: (currentTime: number) => void

// Fullscreen
onDidTriggerFullscreen?: () => void
onDidTriggerRetractFullscreen?: () => void

// Ads
onDidTriggerAdStarted?: () => void
onDidTriggerAdFinished?: () => void
onDidTriggerAdError?: (error: string) => void
onDidTriggerAdLoadStart?: () => void
onDidTriggerAdLoaded?: () => void
onDidTriggerAdNotFound?: () => void
onDidTriggerAdQuartile1?: () => void
onDidTriggerAdQuartile2?: () => void
onDidTriggerAdQuartile3?: () => void
onDidTriggerAllAdsCompleted?: () => void
```

### TypeScript Types

```typescript
import {
  BBPlayerView,
  type BBPlayerViewMethods,
  type BBPlayerViewProps,
  type ClipData,
  type ProjectData,
  type PlayoutData,
} from '@bluebillywig/react-native-bb-player';
```

## Native SDK Versions

| Platform | SDK Version | Location |
|----------|-------------|----------|
| **iOS** | ~> 8.40.0 | `react-native-bb-player.podspec` |
| **Android** | 8.42.+ | `android/build.gradle` |

### Overriding SDK Versions

**iOS (in your app's `Podfile`):**
```ruby
pod 'BBNativePlayerKit', '~> 8.45.0'
```

**Android (in your app's `android/app/build.gradle`):**
```kotlin
configurations.all {
  resolutionStrategy {
    force 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.45.0'
  }
}
```

## Troubleshooting

### Common Issues

#### Black Screen on Player

- Check the JSON URL is correct and accessible
- Verify internet connectivity
- Test on a physical device (some videos don't play in simulators)
- Add error handling to debug:

```tsx
<BBPlayerView
  jsonUrl="..."
  onDidFailWithError={(error) => console.error('Player error:', error)}
  onDidTriggerMediaClipFailed={() => console.error('Media clip failed to load')}
/>
```

#### Methods Not Working

Ensure the player is ready before calling methods:

```tsx
const [isReady, setIsReady] = useState(false);

<BBPlayerView
  ref={playerRef}
  onDidTriggerApiReady={() => setIsReady(true)}
  onDidTriggerCanPlay={() => setIsReady(true)}
/>

// Then call methods
if (isReady) {
  playerRef.current?.play();
}
```

#### iOS Build Fails

1. Run `cd ios && pod install`
2. If issues persist: `cd ios && pod deintegrate && pod install`

#### Android Build Fails

1. Ensure JDK 17+ is installed
2. Run `cd android && ./gradlew clean`
3. Check that `minSdkVersion` is at least 21

## Example App

The `/example` directory contains a complete demo app showing all API features:

```bash
cd example
npm install
cd android && ./gradlew assembleDebug
# or
npx react-native run-android
```

## Support

- **GitHub Issues**: https://github.com/bluebillywig/react-native-bb-player/issues
- **Blue Billywig Docs**: https://bluebillywig.com/docs

When reporting issues, include:
- React Native version
- Platform (iOS/Android)
- Device/emulator details
- Reproduction steps

## License

ISC

---

**Built by Blue Billywig**
