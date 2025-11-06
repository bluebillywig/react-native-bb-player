# expo-bb-player

Native video player for React Native - powered by Blue Billywig's iOS (AVPlayer) and Android (ExoPlayer) SDKs.

## Overview

`expo-bb-player` provides a production-ready, native video player component for React Native. It wraps Blue Billywig's native iOS and Android player SDKs, giving you:

- ✅ **True native playback** - iOS AVPlayer and Android ExoPlayer (no WebView)
- ✅ **Full-featured player** - Ads, analytics, DRM, Picture-in-Picture support
- ✅ **Works everywhere** - Expo apps and bare React Native apps
- ✅ **Type-safe API** - Full TypeScript support with comprehensive types
- ✅ **Production ready** - Built on Blue Billywig's battle-tested native SDKs
- ✅ **Easy integration** - Simple component-based API

## Compatibility

| Platform | Requirement | Player Engine |
|----------|-------------|---------------|
| **iOS** | 12.0+ | AVPlayer |
| **Android** | API 21+ (5.0+) | ExoPlayer |
| **Expo** | All workflows | ✅ |
| **Bare RN** | With Expo Modules | ✅ |

> **Note for Bare React Native Apps**: This package uses Expo Modules. If you're not using Expo, run `npx install-expo-modules@latest` first (one-time setup, ~1 minute).

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Advanced Guides](#advanced-guides)
- [Troubleshooting](#troubleshooting)
- [Example App](#example-app)

## Installation

### For Expo Apps

```bash
npx expo install expo-bb-player

# Then prebuild (generates native directories)
npx expo prebuild
```

### For Bare React Native Apps

#### Step 1: Install Expo Modules (if not already installed)

```bash
npx install-expo-modules@latest
```

This automatically configures your project. See [Expo documentation](https://docs.expo.dev/bare/installing-expo-modules/) for details.

#### Step 2: Install the Package

```bash
npm install expo-bb-player
# or
yarn add expo-bb-player
# or
pnpm add expo-bb-player
```

#### Step 3: iOS Setup

```bash
cd ios && pod install && cd ..
```

#### Step 4: Android Setup

No additional setup needed - autolinking handles it automatically.

#### Step 5: Rebuild Your App

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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export default function App() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  return (
    <View style={styles.container}>
      <ExpoBBPlayerView
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
import { ExpoBBPlayerView } from 'expo-bb-player';

export function BasicPlayer() {
  return (
    <ExpoBBPlayerView
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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export function ControlledPlayer() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  const handlePlay = async () => {
    await playerRef.current?.play();
  };

  const handlePause = async () => {
    await playerRef.current?.pause();
  };

  const handleSeek = async () => {
    await playerRef.current?.seek(30); // Seek to 30 seconds
  };

  return (
    <View style={{ flex: 1 }}>
      <ExpoBBPlayerView
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
import { ExpoBBPlayerView, type State, type Phase } from 'expo-bb-player';

export function EventListenerExample() {
  const [playerState, setPlayerState] = useState<State>('IDLE');
  const [playerPhase, setPlayerPhase] = useState<Phase>('INIT');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <ExpoBBPlayerView
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        options={{ autoPlay: true }}
        style={{ flex: 1 }}
        onDidTriggerStateChange={(state) => setPlayerState(state)}
        onDidTriggerPhaseChange={(phase) => setPlayerPhase(phase)}
        onDidTriggerDurationChange={(dur) => setDuration(dur)}
        onDidTriggerTimeUpdate={(time) => setCurrentTime(time)}
        onDidTriggerPlay={() => console.log('Playback started')}
        onDidTriggerPause={() => console.log('Playback paused')}
        onDidTriggerEnded={() => console.log('Playback ended')}
      />
      <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
        <Text>State: {playerState}</Text>
        <Text>Phase: {playerPhase}</Text>
        <Text>Time: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s</Text>
      </View>
    </View>
  );
}
```

### Fullscreen Player

Launch player in fullscreen mode:

```tsx
import React, { useRef, useEffect } from 'react';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export function FullscreenPlayer() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  useEffect(() => {
    // Enter fullscreen after player is ready
    const timer = setTimeout(async () => {
      await playerRef.current?.enterFullscreen();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ExpoBBPlayerView
      ref={playerRef}
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      options={{
        autoPlay: true,
      }}
      style={{ flex: 1 }}
      onDidTriggerFullscreen={() => console.log('Entered fullscreen')}
      onDidTriggerRetractFullscreen={() => console.log('Exited fullscreen')}
    />
  );
}
```

### Multiple Players in a List

Embed players in a ScrollView or FlatList:

```tsx
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ExpoBBPlayerView } from 'expo-bb-player';

const videos = [
  { id: '1', url: 'https://demo.bbvms.com/p/default/c/4701337.json', title: 'Video 1' },
  { id: '2', url: 'https://demo.bbvms.com/p/default/c/4701338.json', title: 'Video 2' },
  { id: '3', url: 'https://demo.bbvms.com/p/default/c/4701339.json', title: 'Video 3' },
];

export function VideoList() {
  return (
    <ScrollView>
      {videos.map((video) => (
        <View key={video.id} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 10 }}>
            {video.title}
          </Text>
          <ExpoBBPlayerView
            jsonUrl={video.url}
            options={{ autoPlay: false, allowCollapseExpand: true }}
            style={{ height: 200 }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
```

### With Error Handling

Handle errors gracefully:

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ExpoBBPlayerView } from 'expo-bb-player';

export function ErrorHandlingExample() {
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('https://demo.bbvms.com/p/default/c/4701337.json');

  const retry = () => {
    setError(null);
    setVideoUrl(videoUrl + '?retry=' + Date.now()); // Force reload
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 20 }}>Error: {error}</Text>
        <Button title="Retry" onPress={retry} />
      </View>
    );
  }

  return (
    <ExpoBBPlayerView
      jsonUrl={videoUrl}
      options={{ autoPlay: true }}
      style={{ flex: 1 }}
      onDidFailWithError={(err) => setError(err)}
    />
  );
}
```

### With Loading State

Show a loading indicator while the player initializes:

```tsx
import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ExpoBBPlayerView } from 'expo-bb-player';

export function LoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          zIndex: 1,
        }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ExpoBBPlayerView
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        options={{ autoPlay: true }}
        style={{ flex: 1 }}
        onDidTriggerCanPlay={() => setIsLoading(false)}
      />
    </View>
  );
}
```

## API Reference

### Component Props

#### `ExpoBBPlayerView`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `jsonUrl` | `string` | ✅ | Blue Billywig media JSON URL |
| `options` | `Record<string, unknown>` | ❌ | Player configuration options |
| `style` | `ViewStyle` | ❌ | React Native style object |
| Event props | See [Events](#events) | ❌ | Event callback handlers |

### Player Options

Common options you can pass to the `options` prop:

```typescript
{
  autoPlay: boolean;           // Auto-start playback (default: false)
  autoMute: boolean;           // Start muted (default: false)
  autoLoop: boolean;           // Loop playback (default: false)
  allowCollapseExpand: boolean; // Allow outstream sizing (default: false)
}
```

### Methods

Access these methods via the player ref:

#### Playback Control

```typescript
play(): Promise<void>
pause(): Promise<void>
seek(position: number): Promise<void>  // Position in seconds
```

#### Volume Control

```typescript
setVolume(volume: number): Promise<void>  // 0.0 - 1.0
setMuted(muted: boolean): Promise<void>
```

#### Fullscreen Control

```typescript
enterFullscreen(): Promise<void>  // Android only; iOS no-op
exitFullscreen(): Promise<void>   // Android only; iOS no-op
```

> **Note**: Fullscreen methods are currently only implemented on Android. iOS implementation is pending.

#### Outstream Sizing Control

```typescript
expand(): Promise<void>    // Expand outstream player
collapse(): Promise<void>  // Collapse outstream player
```

#### Ad Control

```typescript
autoPlayNextCancel(): Promise<void>
```

#### State Getters

```typescript
playerState(): Promise<State | undefined>
phase(): Promise<Phase | undefined>
duration(): Promise<number | undefined>
volume(): Promise<number | undefined>
muted(): Promise<boolean | undefined>
inView(): Promise<boolean | undefined>
mode(): Promise<string | undefined>
controls(): Promise<boolean | undefined>  // Android only; iOS returns undefined
playoutData(): Promise<Playout | undefined>
projectData(): Promise<Project | undefined>
```

#### Ad Data Getters

```typescript
adMediaHeight(): Promise<number | undefined>
adMediaWidth(): Promise<number | undefined>
adMediaClip(): Promise<MediaClip | undefined>
```

### Events

All events below are exposed as optional props on `ExpoBBPlayerView`:

#### Player Lifecycle Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidSetupWithJsonUrl` | `string` | Player finished initial setup |
| `onDidTriggerCanPlay` | - | Player is ready |
| `onDidFailWithError` | `string` | Fatal error occurred |

#### Playback Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerPlay` | - | Playback started |
| `onDidTriggerPause` | - | Playback paused |
| `onDidTriggerPlaying` | - | Playback is progressing |
| `onDidTriggerEnded` | - | Playback ended |
| `onDidTriggerSeeking` | - | Seek started |
| `onDidTriggerSeeked` | `number` | Seek completed (position in seconds) |
| `onDidTriggerStall` | - | Playback stalled (buffering) |

#### State Change Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerStateChange` | `State` | Player state changed |
| `onDidTriggerPhaseChange` | `Phase` | Player phase changed |
| `onDidTriggerModeChange` | `string` | Player mode changed |
| `onDidTriggerDurationChange` | `number` | Media duration changed (seconds) |
| `onDidTriggerTimeUpdate` | `(currentTime: number, duration: number)` | Playback position updated |
| `onDidTriggerVolumeChange` | `number` | Volume changed (0.0 - 1.0) |

#### Fullscreen Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerFullscreen` | - | Entered fullscreen |
| `onDidTriggerRetractFullscreen` | - | Exited fullscreen |

#### Outstream Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidRequestExpand` | - | Player requested expansion |
| `onDidRequestCollapse` | - | Player requested collapse |

#### Media Loading Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerProjectLoaded` | `Project` | Project metadata loaded |
| `onDidTriggerMediaClipLoaded` | `MediaClip` | Media clip metadata loaded |
| `onDidTriggerMediaClipFailed` | - | Media clip failed to load |

#### Ad Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerAdLoadStart` | - | Ad load started |
| `onDidTriggerAdLoaded` | - | Ad loaded successfully |
| `onDidTriggerAdStarted` | - | Ad playback started |
| `onDidTriggerAdQuartile1` | - | Ad reached 25% |
| `onDidTriggerAdQuartile2` | - | Ad reached 50% |
| `onDidTriggerAdQuartile3` | - | Ad reached 75% |
| `onDidTriggerAdFinished` | - | Ad playback completed |
| `onDidTriggerAdNotFound` | - | No ad available |
| `onDidTriggerAdError` | `string` | Ad error occurred |
| `onDidTriggerAllAdsCompleted` | - | All ads completed |

#### Auto-pause Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerAutoPause` | Android: `string` · iOS: `void` | Auto-pause triggered |
| `onDidTriggerAutoPausePlay` | Android: `string` · iOS: `void` | Auto-pause resumed |

> **Platform Note**: On Android, auto-pause events include a `why` string explaining the reason. On iOS, no payload is provided.

#### View Tracking Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidTriggerViewStarted` | - | View tracking started |
| `onDidTriggerViewFinished` | - | View tracking finished |

#### Misc Events

| Event | Payload | Description |
|-------|---------|-------------|
| `onDidRequestOpenUrl` | `string` | Player requested to open a URL |
| `onDidTriggerCustomStatistics` | `{ ident: string; ev: string; aux: Record<string,string> }` | Custom analytics event |

### TypeScript Types

```typescript
// Player States
type State = "IDLE" | "LOADING" | "PLAYING" | "PAUSED" | "ERROR";

// Player Phases
type Phase = "INIT" | "PRE" | "MAIN" | "POST" | "EXIT";

// Media Metadata (see src/types.ts for full definitions)
interface Project { /* ... */ }
interface MediaClip { /* ... */ }
interface Playout { /* ... */ }
interface CustomStatistics {
  ident: string;
  ev: string;
  aux: Record<string, string>;
}
```

For complete type definitions, see [src/types.ts](./src/types.ts).

## Advanced Guides

### Programmatic Media Loading

Load different videos without recreating the component:

```tsx
import React, { useRef, useState } from 'react';
import { View, Button } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export function ProgrammaticLoading() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);
  const [currentUrl, setCurrentUrl] = useState(
    'https://demo.bbvms.com/p/default/c/4701337.json'
  );

  const loadVideo1 = () => setCurrentUrl('https://demo.bbvms.com/p/default/c/4701337.json');
  const loadVideo2 = () => setCurrentUrl('https://demo.bbvms.com/p/default/c/4701338.json');

  return (
    <View style={{ flex: 1 }}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl={currentUrl}
        options={{ autoPlay: true }}
        style={{ flex: 1 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <Button title="Video 1" onPress={loadVideo1} />
        <Button title="Video 2" onPress={loadVideo2} />
      </View>
    </View>
  );
}
```

### Custom Video Controls

Build your own player controls UI:

```tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Slider } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType, type State } from 'expo-bb-player';

export function CustomControls() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);
  const [state, setState] = useState<State>('IDLE');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);

  const togglePlayPause = async () => {
    if (state === 'PLAYING') {
      await playerRef.current?.pause();
    } else {
      await playerRef.current?.play();
    }
  };

  const handleSeek = async (value: number) => {
    await playerRef.current?.seek(value);
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    await playerRef.current?.setVolume(value);
  };

  return (
    <View style={{ flex: 1 }}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
        onDidTriggerStateChange={setState}
        onDidTriggerTimeUpdate={(time, dur) => {
          setCurrentTime(time);
          setDuration(dur);
        }}
      />

      {/* Custom Controls */}
      <View style={{ padding: 20, backgroundColor: '#000' }}>
        {/* Play/Pause Button */}
        <TouchableOpacity onPress={togglePlayPause} style={{ marginBottom: 10 }}>
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>
            {state === 'PLAYING' ? '⏸ Pause' : '▶ Play'}
          </Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View>
          <Text style={{ color: '#fff', marginBottom: 5 }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
          <Slider
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#666"
          />
        </View>

        {/* Volume Control */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ color: '#fff', marginBottom: 5 }}>
            Volume: {Math.round(volume * 100)}%
          </Text>
          <Slider
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#666"
          />
        </View>
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

### Analytics Integration

Track video analytics:

```tsx
import React, { useEffect } from 'react';
import { ExpoBBPlayerView } from 'expo-bb-player';
import analytics from '@react-native-firebase/analytics';  // Example

export function AnalyticsExample() {
  return (
    <ExpoBBPlayerView
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      options={{ autoPlay: true }}
      style={{ flex: 1 }}
      onDidTriggerPlay={() => {
        analytics().logEvent('video_play', {
          video_url: 'https://demo.bbvms.com/p/default/c/4701337.json',
        });
      }}
      onDidTriggerPause={() => {
        analytics().logEvent('video_pause');
      }}
      onDidTriggerEnded={() => {
        analytics().logEvent('video_complete');
      }}
      onDidTriggerTimeUpdate={(currentTime, duration) => {
        // Track quartiles
        const progress = currentTime / duration;
        if (progress >= 0.25 && progress < 0.26) {
          analytics().logEvent('video_progress', { quartile: 1 });
        } else if (progress >= 0.50 && progress < 0.51) {
          analytics().logEvent('video_progress', { quartile: 2 });
        } else if (progress >= 0.75 && progress < 0.76) {
          analytics().logEvent('video_progress', { quartile: 3 });
        }
      }}
    />
  );
}
```

### Inline Player in ScrollView

Properly manage player in a scrollable container:

```tsx
import React, { useRef } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export function InlinePlayerExample() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  return (
    <ScrollView>
      <Text style={{ fontSize: 24, fontWeight: 'bold', padding: 20 }}>
        Article Title
      </Text>

      <Text style={{ padding: 20, lineHeight: 24 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
      </Text>

      {/* Inline Video */}
      <View style={{ height: 250, marginVertical: 20 }}>
        <ExpoBBPlayerView
          ref={playerRef}
          jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
          options={{
            autoPlay: false,
            allowCollapseExpand: true,
          }}
          style={{ flex: 1 }}
        />
      </View>

      <Text style={{ padding: 20, lineHeight: 24 }}>
        More content continues here...
      </Text>
    </ScrollView>
  );
}
```

## Troubleshooting

### Common Issues

#### "Module not found: expo-bb-player"

**Solution**:
1. Ensure the package is installed: `npm install expo-bb-player`
2. For bare React Native: Run `npx expo prebuild` or `cd ios && pod install`
3. Rebuild the app completely

#### Black Screen on Player

**Causes & Solutions**:
- **Invalid JSON URL**: Check the URL is correct and accessible
- **Network issue**: Verify internet connectivity
- **iOS simulator**: Some videos may not play in simulator, test on device
- **Android hardware acceleration**: Ensure it's enabled (it is by default)

```tsx
// Add error handling to debug
<ExpoBBPlayerView
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidFailWithError={(error) => {
    console.error('Player error:', error);
    Alert.alert('Error', error);
  }}
  onDidSetupWithJsonUrl={(url) => {
    console.log('Player setup complete:', url);
  }}
/>
```

#### Player Not Responding to Method Calls

**Solution**: Ensure the player is ready before calling methods:

```tsx
const playerRef = useRef<ExpoBBPlayerViewType>(null);
const [isReady, setIsReady] = useState(false);

// Wait for canPlay event
<ExpoBBPlayerView
  ref={playerRef}
  onDidTriggerCanPlay={() => setIsReady(true)}
/>

// Then call methods
if (isReady) {
  await playerRef.current?.play();
}
```

#### iOS Build Fails

**Common Issues**:
1. **CocoaPods not installed**: Run `sudo gem install cocoapods`
2. **Pods not installed**: Run `cd ios && pod install`
3. **Cache issues**: Run `cd ios && pod deintegrate && pod install`

#### Android Build Fails

**Common Issues**:
1. **Gradle sync failed**: Check `android/build.gradle` configuration
2. **Missing Java**: Ensure JDK 17+ is installed
3. **Cache issues**: Run `cd android && ./gradlew clean`

### Platform-Specific Issues

#### iOS

**Fullscreen not working**:
- Fullscreen methods are not yet implemented on iOS
- Use native iOS player fullscreen controls instead

**Controls not accessible**:
- The `controls()` method returns `undefined` on iOS
- This is a limitation of the native SDK

#### Android

**ExoPlayer crashes**:
- Check logcat for detailed error: `adb logcat *:E`
- Ensure video format is supported by ExoPlayer
- Check for ProGuard/R8 issues in release builds

**Fullscreen issues**:
- Ensure activity is configured correctly in AndroidManifest.xml
- Check for conflicting screen orientation locks

### Debug Mode

Enable verbose logging:

```tsx
<ExpoBBPlayerView
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidSetupWithJsonUrl={(url) => console.log('[Setup]', url)}
  onDidTriggerCanPlay={() => console.log('[CanPlay]')}
  onDidTriggerStateChange={(state) => console.log('[State]', state)}
  onDidTriggerPhaseChange={(phase) => console.log('[Phase]', phase)}
  onDidFailWithError={(error) => console.error('[Error]', error)}
  onDidTriggerPlay={() => console.log('[Play]')}
  onDidTriggerPause={() => console.log('[Pause]')}
  onDidTriggerEnded={() => console.log('[Ended]')}
/>
```

## Example App

The `/example` directory contains a complete working app demonstrating all features:

```bash
cd example
npm install

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

The example app includes:
- Basic player setup
- Player controls (play, pause, seek, volume)
- Event listeners and state tracking
- Multiple players demo
- Fullscreen demo
- Outstream player demo
- Error handling demo

## FAQ

### Do I need an Expo account?

No! This package works with any React Native app. For bare React Native apps, just run `npx install-expo-modules@latest` once.

### Can I use this in production?

Yes! This package wraps Blue Billywig's production-grade native SDKs used by major media companies.

### Does this support DRM?

Yes, DRM support is provided by the native SDKs (FairPlay on iOS, Widevine on Android). Configure DRM settings in your Blue Billywig playout.

### Does this support ads?

Yes, the player includes full ad support (VAST, VPAID, etc.). Configure ads in your Blue Billywig playout configuration.

### Can I customize the player UI?

The native player UI is managed by the Blue Billywig SDK. You can:
- Build custom controls using the API methods and events
- Configure player appearance through playout settings
- Use player events to show your own overlays

### What video formats are supported?

The player supports formats compatible with:
- iOS: AVPlayer (HLS, MP4, M4V, MOV, etc.)
- Android: ExoPlayer (HLS, DASH, MP4, WebM, etc.)

### How do I get a JSON URL?

Contact Blue Billywig to get access to your media content. The JSON URL format is:
```
https://{your-domain}.bbvms.com/p/{playout}/c/{clipId}.json
```

## Publishing and Repository Setup

This package is designed to be published as a standalone npm package.

### For Package Maintainers

- **Publishing to npm**: See [PUBLISHING.md](./PUBLISHING.md)
- **Separate Repository Setup**: See [docs/SEPARATE_REPO_SETUP.md](./docs/SEPARATE_REPO_SETUP.md)

### Repository Structure

When published as a standalone package, this module is at:
- **GitHub**: https://github.com/bluebillywig/expo-bb-player
- **npm**: `expo-bb-player`

## Support

### Documentation
- API Reference: See above
- Example App: Check `/example` directory
- Blue Billywig Docs: https://bluebillywig.com/docs

### Issues
- GitHub Issues: https://github.com/bluebillywig/expo-bb-player/issues
- Include:
  - React Native version
  - Expo SDK version (if applicable)
  - Platform (iOS/Android)
  - Reproduction steps

## License

ISC

---

**Built with ❤️ by Blue Billywig**
