---
sidebar_position: 1
title: Getting Started
description: Install and set up the Blue Billywig React Native Player SDK in minutes.
---

# Getting Started

`@bluebillywig/react-native-bb-player` gives you a production-ready native video player for React Native.

**What you get:**

- True native playback — no WebView
- Full ad support (VAST, VPAID, Google IMA)
- Built-in analytics
- [Content protection](https://support.bluebillywig.com/content-protection/)
- TypeScript-first API
- Expo config plugin (optional)

## Compatibility

| Platform | Requirement | Player Engine |
|----------|-------------|---------------|
| **iOS** | 13.4+ | AVPlayer |
| **Android** | API 24+ (7.0+) | ExoPlayer |
| **React Native** | 0.73+ | Old & New Architecture |
| **Expo** | SDK 51+ | Config plugin (optional) |

## Installation

### Bare React Native

```bash
npm install @bluebillywig/react-native-bb-player
# or
yarn add @bluebillywig/react-native-bb-player
```

**iOS** — install CocoaPods:

```bash
cd ios && pod install && cd ..
```

**Android** — no extra setup, autolinking handles it.

Then rebuild:

```bash
npx react-native run-ios
# or
npx react-native run-android
```

### Expo (Development Build)

:::warning
This SDK uses native code and **cannot run in Expo Go**. You must use a [development build](https://docs.expo.dev/develop/development-builds/introduction/).
:::

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

Then build:

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

See the [Expo Setup Guide](./guides/expo-setup.md) for advanced options like background audio.

## Quick Start

The simplest possible player:

```tsx
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function MyPlayer() {
  return (
    <BBPlayerView
      jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
      options={{ autoPlay: true }}
      style={{ flex: 1 }}
    />
  );
}
```

### With Ref Controls

Control playback programmatically using a ref:

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
      <View style={{ flexDirection: 'row', padding: 10, gap: 8 }}>
        <Button title="Play" onPress={() => playerRef.current?.play()} />
        <Button title="Pause" onPress={() => playerRef.current?.pause()} />
        <Button title="Seek 30s" onPress={() => playerRef.current?.seek(30)} />
      </View>
    </View>
  );
}
```

### With Events

Listen to player lifecycle events:

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BBPlayerView, type State } from '@bluebillywig/react-native-bb-player';

export function EventPlayer() {
  const [state, setState] = useState<State>('IDLE');
  const [duration, setDuration] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
        onDidTriggerStateChange={setState}
        onDidTriggerDurationChange={setDuration}
        onDidTriggerPlay={() => console.log('Playing')}
        onDidTriggerEnded={() => console.log('Ended')}
      />
      <Text>State: {state} | Duration: {duration.toFixed(1)}s</Text>
    </View>
  );
}
```

### Dynamic Content Loading

Load different content without remounting the player:

```tsx
const playerRef = useRef<BBPlayerViewMethods>(null);

// Primary API
playerRef.current?.loadClip('123456', {
  autoPlay: true,
  playout: 'default',
});

// With playlist context (enables "next up" navigation)
playerRef.current?.loadClip('123456', {
  autoPlay: true,
  context: {
    contextEntityType: 'MediaClipList',
    contextEntityId: 'playlist-id',
    contextCollectionType: 'MediaClipList',
    contextCollectionId: 'playlist-id',
  },
});
```

## JSON URL Format

All content is loaded via a JSON URL from your Blue Billywig publication:

```
https://{publication}.bbvms.com/p/{playout}/c/{clipId}.json
```

| Segment | Description |
|---------|-------------|
| `{publication}` | Your publication subdomain (e.g. `demo`) |
| `{playout}` | Player configuration name (e.g. `default`) |
| `{clipId}` | Media clip identifier |

**Other URL formats:**

| Type | URL Pattern |
|------|-------------|
| Clip | `https://{pub}.bbvms.com/p/{playout}/c/{clipId}.json` |
| Outstream Ad | `https://{pub}.bbvms.com/a/{outstreamPlayout}.json` |
| Shorts | `https://{pub}.bbvms.com/sh/{shortsId}.json` |

Contact [Blue Billywig](https://www.bluebillywig.com) to get your publication credentials.

## What's Next?

- [**API Reference**](./api/components.md) — All components, methods, events, and types
- [**Expo Setup**](./guides/expo-setup.md) — Detailed Expo configuration
- [**Fullscreen & Modal**](./guides/fullscreen.md) — Fullscreen patterns
- [**Advertising**](./guides/advertising.md) — VAST/VPAID ad integration
- [**Shorts**](./guides/shorts.md) — Vertical video (TikTok-style)
- [**Feature Matrix**](./feature-matrix.md) — Full platform/feature support table
