---
sidebar_position: 2
title: Fullscreen & Modal
description: Fullscreen, landscape, and modal player patterns.
---

# Fullscreen & Modal Player

This guide covers fullscreen playback patterns including landscape-forced fullscreen, modal-style presentation, and handling the fullscreen lifecycle.

## Fullscreen Methods

| Method | Description |
|--------|-------------|
| `enterFullscreen()` | Enter fullscreen in current orientation |
| `enterFullscreenLandscape()` | Enter fullscreen and force landscape |
| `exitFullscreen()` | Exit fullscreen and restore orientation |

## Basic Fullscreen

```tsx
const playerRef = useRef<BBPlayerViewMethods>(null);

<BBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidTriggerApiReady={() => {
    playerRef.current?.enterFullscreen();
  }}
  onDidTriggerRetractFullscreen={() => {
    console.log('Exited fullscreen');
  }}
/>
```

## Landscape Fullscreen

Force landscape for video content — the recommended approach for modal-style playback:

```tsx
<BBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidTriggerApiReady={() => {
    playerRef.current?.enterFullscreenLandscape();
  }}
  onDidTriggerRetractFullscreen={() => {
    console.log('Fullscreen dismissed');
  }}
/>
```

### Platform Behavior

| | iOS | Android |
|--|-----|---------|
| **Presentation** | Native `AVPlayerViewController` with system chrome | In-place fullscreen with orientation lock |
| **Orientation** | Locks to landscape, restores on exit | Locks to landscape, restores on exit |
| **Dismiss** | Swipe down to close | Hardware back button |
| **Controls** | Native AVKit controls | SDK control bar |

## Modal-Style Player Pattern

Render the player offscreen and use `enterFullscreenLandscape()` to present as a modal. The native SDK owns the fullscreen lifecycle — no React Native `Modal` component needed.

```tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

export function ModalPlayer({ jsonUrl, onDismiss }: {
  jsonUrl: string;
  onDismiss: () => void;
}) {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  return (
    <View style={styles.offscreen}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl={jsonUrl}
        autoPlay
        style={styles.player}
        onDidTriggerApiReady={() => {
          playerRef.current?.enterFullscreenLandscape();
        }}
        onDidTriggerRetractFullscreen={() => {
          playerRef.current?.destroy();
          onDismiss();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  offscreen: {
    position: 'absolute',
    top: -1000, left: -1000,
    width: 320, height: 180,
  },
  player: { flex: 1 },
});
```

### Why Offscreen Instead of React Native Modal?

- **Orientation** — managed by the native SDK automatically
- **Swipe-to-close** (iOS) and back button (Android) work out of the box
- **No double-modal conflicts** — RN `Modal` and native fullscreen can interfere
- **Native controls** render correctly within native fullscreen context

## Fullscreen Events

| Event | When |
|-------|------|
| `onDidTriggerFullscreen` | Player entered fullscreen |
| `onDidTriggerRetractFullscreen` | Player exited fullscreen (by any method) |

`onDidTriggerRetractFullscreen` fires for: user swipe-to-close (iOS), hardware back (Android), and programmatic `exitFullscreen()`.

## Inline Player with Fullscreen Toggle

```tsx
export function InlineWithFullscreen() {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <View style={{ aspectRatio: 16 / 9 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
        style={{ flex: 1 }}
        onDidTriggerFullscreen={() => setIsFullscreen(true)}
        onDidTriggerRetractFullscreen={() => setIsFullscreen(false)}
      />
    </View>
  );
}
```

To force landscape when the user taps the built-in fullscreen button:

```tsx
<BBPlayerView options={{ modalPlayer: true }} />
```

## Android Back Button

On Android, the hardware back button exits fullscreen automatically. If you also handle `BackHandler`, check fullscreen state:

```tsx
import { BackHandler } from 'react-native';

useEffect(() => {
  const onBackPress = () => {
    if (isFullscreen) {
      playerRef.current?.exitFullscreen();
      return true;
    }
    return false;
  };

  const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  return () => sub.remove();
}, [isFullscreen]);
```
