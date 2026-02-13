# Fullscreen & Modal Player Guide

This guide covers fullscreen playback patterns including landscape-forced fullscreen, modal-style presentation, and handling the fullscreen lifecycle.

## Fullscreen Methods

| Method | Description |
|--------|-------------|
| `enterFullscreen()` | Enter fullscreen in the current orientation |
| `enterFullscreenLandscape()` | Enter fullscreen and force landscape orientation |
| `exitFullscreen()` | Exit fullscreen and restore previous orientation |

## Basic Fullscreen

Enter fullscreen in the current device orientation:

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

Force landscape orientation for video content. This is the recommended approach for modal-style video playback:

```tsx
const playerRef = useRef<BBPlayerViewMethods>(null);

<BBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidTriggerApiReady={() => {
    playerRef.current?.enterFullscreenLandscape();
  }}
  onDidTriggerRetractFullscreen={() => {
    // User dismissed fullscreen (swipe-to-close on iOS, back button on Android)
    console.log('Fullscreen dismissed');
  }}
/>
```

### Platform behavior

| | iOS | Android |
|--|-----|---------|
| **Presentation** | Native `AVPlayerViewController` fullscreen with system chrome | In-place fullscreen with orientation lock |
| **Orientation** | Locks to landscape, restores on exit | Locks to landscape, restores on exit |
| **Dismiss gesture** | Swipe down to close | Hardware back button |
| **Control bar** | Native AVKit controls | SDK control bar |

## Modal-Style Player Pattern

A common pattern is rendering the player offscreen and using `enterFullscreenLandscape()` to present it as a modal. The native SDK owns the fullscreen lifecycle — no React Native `Modal` component is needed.

```tsx
import React, { useRef, useState } from 'react';
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
        options={{
          controlBar: 'Autohide',
          showStartControlBar: 'Yes',
        }}
        style={styles.player}
        onDidTriggerApiReady={() => {
          // Present as fullscreen landscape once ready
          playerRef.current?.enterFullscreenLandscape();
        }}
        onDidTriggerRetractFullscreen={() => {
          // Native fullscreen was dismissed — clean up
          playerRef.current?.destroy();
          onDismiss();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Player lives offscreen; native SDK presents fullscreen on top
  offscreen: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 320,
    height: 180,
  },
  player: {
    flex: 1,
  },
});
```

### Why offscreen instead of React Native Modal?

Using the native SDK's fullscreen presentation instead of a React Native `Modal` has several advantages:

- **Orientation handling** is managed by the native SDK — no manual orientation locking needed
- **Swipe-to-close** (iOS) and back button (Android) work out of the box
- **No double-modal conflicts** — React Native `Modal` and native fullscreen can interfere with each other
- **Native control bar** renders correctly within the native fullscreen context

## Fullscreen Events

| Event | Fired when |
|-------|-----------|
| `onDidTriggerFullscreen` | Player entered fullscreen |
| `onDidTriggerRetractFullscreen` | Player exited fullscreen (user dismissed or `exitFullscreen()` called) |

`onDidTriggerRetractFullscreen` fires regardless of how fullscreen was exited:
- User swipe-to-close (iOS)
- Hardware back button (Android)
- Programmatic `exitFullscreen()` call

## Inline Player with Fullscreen Toggle

Render the player inline and let the user toggle fullscreen:

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

The player's built-in fullscreen button (in the control bar) triggers `enterFullscreen()` automatically. To force landscape when the user taps fullscreen, set the `modalPlayer` option:

```tsx
<BBPlayerView
  options={{ modalPlayer: true }}
  // ...
/>
```

## Android Back Button Handling

On Android, the hardware back button exits fullscreen automatically. If you also handle `BackHandler` in your React Native code, check fullscreen state to avoid conflicts:

```tsx
import { BackHandler } from 'react-native';

useEffect(() => {
  const onBackPress = () => {
    if (isFullscreen) {
      playerRef.current?.exitFullscreen();
      return true; // handled
    }
    return false; // let system handle
  };

  const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  return () => sub.remove();
}, [isFullscreen]);
```
