# react-native-bb-player

Native video player for React Native - powered by Blue Billywig's iOS (AVPlayer) and Android (ExoPlayer) SDKs.

## Overview

`react-native-bb-player` provides a production-ready, native video player component for React Native. It wraps Blue Billywig's native iOS and Android player SDKs, giving you:

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
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Hello World Demo App](#hello-world-demo-app)

## Documentation

- **[Complete API Reference](./API.md)** - Comprehensive documentation of all methods, events, and types
- **[Build Configuration Guide](./claude.md)** - Build settings and requirements
- **[TypeScript Types](./src/ExpoBBPlayer.types.ts)** - Full type definitions

## Installation

### For Expo Apps

```bash
npx expo install react-native-bb-player

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
npm install react-native-bb-player
# or
yarn add react-native-bb-player
# or
pnpm add react-native-bb-player
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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

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
import { ExpoBBPlayerView } from 'react-native-bb-player';

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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

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
import { ExpoBBPlayerView, type State, type Phase } from 'react-native-bb-player';

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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

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

### Chromecast Support

Open the Google Cast device picker to cast video to Chromecast devices:

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

export function ChromecastPlayer() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  const handleCast = async () => {
    try {
      await playerRef.current?.showCastPicker();
    } catch (error) {
      console.error('Cast picker error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ExpoBBPlayerView
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

### Multiple Players in a List

Embed players in a ScrollView or FlatList:

```tsx
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ExpoBBPlayerView } from 'react-native-bb-player';

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
import { ExpoBBPlayerView } from 'react-native-bb-player';

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
import { ExpoBBPlayerView } from 'react-native-bb-player';

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

### Quick Reference

**For complete API documentation, see [API.md](./API.md)**

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `jsonUrl` | `string` | ✅ | Blue Billywig media JSON URL |
| `options` | `Record<string, unknown>` | ❌ | Player configuration options |
| `style` | `ViewStyle` | ❌ | React Native style object |
| Event props | See [API.md](./API.md#player-events) | ❌ | Event callback handlers |

### Common Methods

```typescript
// Playback Control
play(): Promise<void>
pause(): Promise<void>
seek(position: number): Promise<void>

// Volume Control
setVolume(volume: number): Promise<void>
setMuted(muted: boolean): Promise<void>

// Layout Control
collapse(): Promise<void>
expand(): Promise<void>
enterFullscreen(): Promise<void>
exitFullscreen(): Promise<void>

// Chromecast Control
showCastPicker(): Promise<void>  // Opens the Google Cast device picker dialog

// Load Content Dynamically
loadWithClipId(clipId: string, initiator?: string, autoPlay?: boolean, seekTo?: number): Promise<void>
loadWithProjectId(projectId: string, initiator?: string, autoPlay?: boolean, seekTo?: number): Promise<void>
loadWithClipJson(clipJson: string, initiator?: string, autoPlay?: boolean, seekTo?: number): Promise<void>

// State Getters
state(): Promise<State>
phase(): Promise<Phase>
duration(): Promise<number>
volume(): Promise<number>
muted(): Promise<boolean>
playoutData(): Promise<Project>
projectData(): Promise<Project>

// Cleanup
destroy(): Promise<void>
```

### Common Events

```typescript
// Setup & Lifecycle
onDidSetupWithJsonUrl?: (url: string) => void
onDidTriggerApiReady?: () => void
onDidFailWithError?: (error: string) => void

// Playback
onDidTriggerPlay?: () => void
onDidTriggerPause?: () => void
onDidTriggerEnded?: () => void
onDidTriggerTimeUpdate?: (currentTime: number, duration: number) => void

// State Changes
onDidTriggerStateChange?: (state: State) => void
onDidTriggerPhaseChange?: (phase: Phase) => void

// Media Loading
onDidTriggerMediaClipLoaded?: (clip: MediaClip) => void
onDidTriggerProjectLoaded?: (project: Project) => void

// Ads (10+ ad events available - see API.md)
onDidTriggerAdStarted?: () => void
onDidTriggerAdFinished?: () => void
```

**See [API.md](./API.md) for complete documentation of all 45+ methods and 35+ events.**

### TypeScript Types

```typescript
type State = "IDLE" | "LOADING" | "READY" | "PLAYING" | "PAUSED" | "ENDED" | "ERROR";
type Phase = "PRE" | "MAIN" | "POST" | "EXIT";
```

For complete type definitions, see [src/ExpoBBPlayer.types.ts](./src/ExpoBBPlayer.types.ts) and [API.md](./API.md).

## Advanced Guides

### Programmatic Media Loading

Load different videos without recreating the component:

```tsx
import React, { useRef, useState } from 'react';
import { View, Button } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType, type State } from 'react-native-bb-player';

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
import { ExpoBBPlayerView } from 'react-native-bb-player';
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
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

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

### Chromecast Integration

The `react-native-bb-player` package includes full Google Cast (Chromecast) support on both iOS and Android platforms. The integration works seamlessly with the Blue Billywig SDK, which automatically handles cast session management and media playback on cast devices.

#### How It Works

The Chromecast integration leverages the Google Cast SDK's singleton architecture:

1. **Shared Session Manager**: All cast buttons (both from the SDK and your app) share the same `GCKSessionManager` instance
2. **Automatic Detection**: The Blue Billywig SDK listens to Cast SDK notifications and automatically handles session changes
3. **Seamless Handoff**: When you create a cast session via `showCastPicker()`, the SDK detects it and handles the media transfer automatically

#### Platform Support

| Platform | Status | Implementation |
|----------|--------|----------------|
| **iOS** | ✅ Fully Supported | Google Cast SDK for iOS |
| **Android** | ✅ Fully Supported | Google Cast SDK for Android |

#### Basic Usage

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'react-native-bb-player';

export function ChromecastExample() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  const handleCast = async () => {
    try {
      await playerRef.current?.showCastPicker();
    } catch (error) {
      console.error('Cast picker error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        options={{ autoPlay: true }}
        style={{ flex: 1 }}
      />
      <Button title="Cast to Device" onPress={handleCast} />
    </View>
  );
}
```

#### Implementation Details

**iOS Implementation:**
- Uses an independent `GCKUICastButton` that's positioned off-screen and made transparent
- The button remains in the view hierarchy to present cast device picker dialogs
- Implements lazy initialization with explicit Google Cast SDK initialization checks
- Safe error handling prevents crashes if SDK isn't ready

**Android Implementation:**
- Directly integrates with the Google Cast SDK
- Presents the native cast device picker dialog
- Handles session management through the SDK's built-in mechanisms

**Safety Mechanisms:**
Both platforms implement several safety checks:
- Verifies `GCKCastContext` is initialized before creating any cast UI
- Uses lazy initialization to avoid timing issues during app startup
- Gracefully handles cases where Cast SDK may not be ready
- Logs errors (in debug builds) without crashing the app

#### Receiver App ID

The Blue Billywig SDK is configured with Google Cast receiver app ID `1F61A3A5`. This is managed by the native SDK and requires no additional configuration.

#### Testing Chromecast

To test Chromecast functionality:

1. **Ensure you have a Chromecast device** on the same network as your test device
2. **For iOS**: Test on a physical device (Cast SDK has limited simulator support)
3. **For Android**: Works on both emulators and physical devices (if network allows)
4. **Call `showCastPicker()`** to open the device selection dialog
5. **Select your device** from the list to start casting

#### Troubleshooting

**Cast button does nothing:**
- Ensure Google Cast SDK is initialized (wait for `onDidTriggerApiReady` event)
- Check that your device is on the same network as the Chromecast
- Verify network allows mDNS/multicast (required for device discovery)

**No devices found:**
- Check Wi-Fi network allows device discovery
- Some enterprise/guest networks block mDNS traffic
- Ensure Chromecast is powered on and connected to the same network

**Cast session disconnects:**
- Check network stability
- Ensure media URLs are accessible from the Chromecast device
- Verify DRM settings (if applicable) support Cast receivers

### Overriding Native SDK Versions

By default, `react-native-bb-player` uses Blue Billywig Native Player SDK version **8.37.x** for both iOS and Android. The package uses flexible version constraints that automatically receive patch updates (e.g., 8.37.0 → 8.37.1).

#### Current Default Versions

- **iOS**: `~>8.37` (allows 8.37.x patch updates)
- **Android**: `8.37.+` (allows 8.37.x patch updates)

#### Why Override?

You might want to override the native SDK version to:
- Use a newer version with specific features or bug fixes
- Lock to a specific version for stability
- Test compatibility with upcoming SDK releases

#### How to Override

**For iOS (in your app's `Podfile`):**

Add before `use_expo_modules!`:

```ruby
# Override Blue Billywig SDK version
pod 'BlueBillywigNativePlayerKit-iOS', '8.40.0'  # Specific version
# OR
pod 'BlueBillywigNativePlayerKit-iOS', '~>8.40'  # Allow 8.40.x patches
```

**For Android (in your app's `android/app/build.gradle`):**

Add in the `android` block:

```kotlin
configurations.all {
  resolutionStrategy {
    // Force specific version
    force 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.40.0'
    // OR use flexible constraint
    force 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.40.+'
  }
}
```

**Complete Example:**

```kotlin
android {
  // ... other config

  configurations.all {
    resolutionStrategy {
      force 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.40.0'
    }
  }
}
```

#### After Changing Versions

**iOS:**
```bash
cd ios && pod install
```

**Android:**
```bash
cd android && ./gradlew clean
```

Then rebuild your app with `npx expo run:ios` or `npx expo run:android`.

> **⚠️ Note**: When overriding SDK versions, ensure compatibility with the `react-native-bb-player` package. Major version changes in the native SDKs may require updates to the wrapper code. Test thoroughly after upgrading.

## Performance Optimization

The `react-native-bb-player` is designed for optimal performance, but there are several strategies to minimize CPU usage and battery drain in your application.

### Time Updates (Opt-In)

By default, the player does **not** emit `onDidTriggerTimeUpdate` events to reduce CPU overhead. Time updates require a native timer that fires every second, which can impact battery life and performance, especially on mobile devices.

#### When to Enable Time Updates

Enable time updates only when you need them for:
- Custom progress bars or scrubbers
- Real-time time display in custom controls
- Time-based analytics or features

#### How to Enable Time Updates

Use the `enableTimeUpdates` prop:

```tsx
import { ExpoBBPlayerView } from 'react-native-bb-player';

export function PlayerWithTimeUpdates() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCustomControls, setShowCustomControls] = useState(false);

  return (
    <ExpoBBPlayerView
      ref={playerRef}
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      // Only enable time updates when custom controls are visible
      enableTimeUpdates={showCustomControls}
      onDidTriggerTimeUpdate={(time, dur) => {
        setCurrentTime(time);
        setDuration(dur);
      }}
      options={{
        controls: !showCustomControls, // Disable native controls when using custom
      }}
    />
  );
}
```

#### Polling Current Time (Alternative)

If you only need the current time occasionally (e.g., when the user interacts), use the `currentTime()` method instead:

```tsx
const playerRef = useRef<ExpoBBPlayerViewType>(null);

const handleGetTime = async () => {
  const time = await playerRef.current?.currentTime();
  console.log('Current time:', time);
};

return (
  <View>
    <ExpoBBPlayerView
      ref={playerRef}
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      // enableTimeUpdates NOT set - no timer overhead
    />
    <Button title="Get Current Time" onPress={handleGetTime} />
  </View>
);
```

### Event Logging Overhead

In development and demo applications, be cautious with event logging and state updates. Each player event that triggers a React state update causes a re-render.

#### Bad Practice (Heavy CPU Usage)

```tsx
// This triggers state updates on EVERY player event
const [eventLog, setEventLog] = useState([]);

return (
  <ExpoBBPlayerView
    onDidTriggerPlay={() => setEventLog([...eventLog, 'play'])}
    onDidTriggerPause={() => setEventLog([...eventLog, 'pause'])}
    onDidTriggerStateChange={(state) => setEventLog([...eventLog, state])}
    onDidTriggerPhaseChange={(phase) => setEventLog([...eventLog, phase])}
    // ... many more event handlers causing state updates
  />
);
```

#### Good Practice (Minimal CPU Usage)

```tsx
// Only log events when explicitly needed for debugging
const [enableEventLogging, setEnableEventLogging] = useState(false);
const [eventLog, setEventLog] = useState([]);

const addEvent = useCallback((name: string, data?: any) => {
  if (!enableEventLogging) return; // Early return when disabled

  setEventLog(prev => [
    { name, data, timestamp: Date.now() },
    ...prev
  ].slice(0, 20));
}, [enableEventLogging]);

return (
  <View>
    <Switch
      value={enableEventLogging}
      onValueChange={setEnableEventLogging}
    />
    <ExpoBBPlayerView
      onDidTriggerPlay={() => addEvent('play')}
      onDidTriggerPause={() => addEvent('pause')}
      // Events are no-ops when logging is disabled
    />
  </View>
);
```

### Native vs Custom Controls

Using native player controls (default) is more efficient than building custom controls with JavaScript:

```tsx
// Most efficient - native controls handle everything
<ExpoBBPlayerView
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  options={{ controls: true }}  // Default
/>

// Less efficient - requires time updates and React re-renders
<ExpoBBPlayerView
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  enableTimeUpdates={true}
  options={{ controls: false }}
  onDidTriggerTimeUpdate={(time, dur) => {
    setCurrentTime(time);  // React state update every second
    setDuration(dur);
  }}
/>
```

### Release Build Optimizations

The native iOS and Android modules automatically optimize logging in Release builds:

**iOS (`ExpoBBPlayerView.swift`):**
```swift
#if DEBUG
  // In debug builds, log everything
  NSLog("ExpoBBPlayer: \(message)")
#else
  // In release builds, only log warnings and errors
  if level == .warning || level == .error {
    NSLog("ExpoBBPlayer: \(message)")
  }
#endif
```

**Android (`ExpoBBPlayerView.kt`):**
```kotlin
private fun log(message: String, level: LogLevel = LogLevel.DEBUG) {
    if (BuildConfig.DEBUG || level == LogLevel.WARNING || level == LogLevel.ERROR) {
        Log.d(TAG, message)
    }
}
```

Always test performance on **Release builds** on **physical devices**, not Debug builds on simulators.

### General Performance Best Practices

1. **Minimize State Updates**: Only use state for values that need to trigger UI updates
   ```tsx
   // Use refs for high-frequency updates
   const currentTimeRef = useRef(0);

   // Use state only for UI that changes less frequently
   const [state, setState] = useState<State>('IDLE');
   ```

2. **Memoize Event Handlers**: Use `useCallback` to prevent recreation
   ```tsx
   const handlePlay = useCallback(async () => {
     await playerRef.current?.play();
   }, []);
   ```

3. **Batch State Updates**: Combine multiple state updates when possible
   ```tsx
   // Bad: Multiple state updates
   setState(newState);
   setPhase(newPhase);
   setVolume(newVolume);

   // Better: Single state update
   setPlayerInfo({ state: newState, phase: newPhase, volume: newVolume });
   ```

4. **Use Native Controls When Possible**: The native player UI is more efficient than custom JavaScript controls

5. **Test on Physical Devices**: Simulators/emulators don't accurately represent real-world performance, especially for video playback

6. **Profile Your App**: Use React DevTools Profiler and native performance tools to identify bottlenecks
   - iOS: Instruments (CPU, Memory)
   - Android: Android Profiler (CPU, Memory, Energy)

### Performance Checklist

Before deploying to production:

- [ ] `enableTimeUpdates` is only enabled when needed
- [ ] Event handlers don't trigger unnecessary state updates
- [ ] Event logging is disabled or opt-in
- [ ] Using native controls unless custom controls are required
- [ ] Testing on Release builds, not Debug builds
- [ ] Testing on physical devices, not simulators
- [ ] Profiled the app for CPU and memory usage

## Troubleshooting

### Common Issues

#### "Module not found: react-native-bb-player"

**Solution**:
1. Ensure the package is installed: `npm install react-native-bb-player`
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

## Hello World Demo App

The `/player-hello-world` directory contains a minimal working demo app:

```bash
cd player-hello-world
npm install

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

The demo app shows:
- Minimal player setup with Expo SDK 54
- Local module resolution (using parent directory source)
- Working Android build with proper configuration
- Event handler implementation
- Manual play() trigger for autoPlay-disabled playouts

### Key Configuration Files

- **[metro.config.js](./player-hello-world/metro.config.js)** - Metro configuration for local module resolution
- **[app.json](./player-hello-world/app.json)** - Expo configuration with proper Android minSdkVersion (24)
- **[App.tsx](./player-hello-world/App.tsx)** - Simple player implementation with event handlers

### Build Requirements

- Java 17 or later (required for Gradle 8.14.3)
- Android SDK with minSdkVersion 24+
- Expo CLI for building and running

See [claude.md](./claude.md) for complete build configuration details.

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
- **GitHub**: https://github.com/bluebillywig/react-native-bb-player
- **npm**: `react-native-bb-player`

## Support

### Documentation
- API Reference: See above
- Example App: Check `/example` directory
- Blue Billywig Docs: https://bluebillywig.com/docs

### Issues
- GitHub Issues: https://github.com/bluebillywig/react-native-bb-player/issues
- Include:
  - React Native version
  - Expo SDK version (if applicable)
  - Platform (iOS/Android)
  - Reproduction steps

## License

ISC

---

**Built with ❤️ by Blue Billywig**
