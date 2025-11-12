# Fullscreen Implementation Guide

This document explains how fullscreen functionality works in the react-native-bb-player SDK and how to implement it correctly in your React Native application.

## Overview

The SDK provides two fullscreen methods with different behaviors:

1. **`enterFullscreen()`** - Standard fullscreen that respects device orientation
2. **`enterFullscreenLandscape()`** - Fullscreen with immediate landscape rotation

## Methods

### `enterFullscreen()`

Enters fullscreen mode and allows rotation based on device orientation.

**Behavior:**
- Presents the video in fullscreen modal
- Video can rotate to landscape **only when the user physically rotates their device**
- Starts in portrait orientation
- Main screen remains locked to portrait when exiting fullscreen

**Usage:**
```typescript
await playerRef.current?.enterFullscreen();
```

**Use cases:**
- Standard fullscreen functionality
- When you want users to control orientation manually
- Portrait videos that should stay in portrait

### `enterFullscreenLandscape()`

Enters fullscreen mode and **immediately rotates to landscape** orientation.

**Behavior:**
- Presents the video in fullscreen modal
- **Immediately rotates to landscape orientation** without waiting for device rotation
- Best for widescreen videos (16:9, 21:9, etc.)
- Main screen remains locked to portrait when exiting fullscreen

**Usage:**
```typescript
await playerRef.current?.enterFullscreenLandscape();
```

**Use cases:**
- Widescreen videos that benefit from landscape viewing
- When you want to maximize screen usage for wide aspect ratios
- Automatic landscape rotation for better user experience

### `exitFullscreen()`

Exits fullscreen mode and returns to embedded player.

**Usage:**
```typescript
await playerRef.current?.exitFullscreen();
```

## Implementation Example

Here's a complete example showing both fullscreen methods:

```typescript
import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ExpoBBPlayerView } from 'react-native-bb-player';
import type { ExpoBBPlayerViewType, MediaClip } from 'react-native-bb-player';

export default function VideoPlayer() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);
  const [currentMediaClip, setCurrentMediaClip] = useState<MediaClip | null>(null);

  // Helper to check if video is widescreen
  const isWidescreenVideo = (clip: MediaClip | null): boolean => {
    if (!clip) return false;
    const width = clip.width || clip.originalWidth;
    const height = clip.height || clip.originalHeight;
    if (!width || !height) return false;
    const aspectRatio = width / height;
    return aspectRatio >= 1.5; // 16:9 = 1.77, 16:10 = 1.6, 21:9 = 2.33
  };

  // Standard fullscreen
  const handleFullscreen = async () => {
    await playerRef.current?.enterFullscreen();
  };

  // Fullscreen with immediate landscape rotation
  const handleFullscreenLandscape = async () => {
    await playerRef.current?.enterFullscreenLandscape();
  };

  return (
    <>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/p/default/c/6323522.json"
        options={{ autoPlay: false, controls: true }}
        onDidTriggerMediaClipLoaded={(clip) => setCurrentMediaClip(clip)}
      />

      <TouchableOpacity onPress={handleFullscreen}>
        <Text>Fullscreen</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleFullscreenLandscape}>
        <Text>Fullscreen Landscape</Text>
      </TouchableOpacity>
    </>
  );
}
```

## iOS Implementation Details

### How It Works

The iOS implementation involves several key components:

1. **BBNativePlayerViewController Orientation Fix**
   - The SDK's `BBNativePlayerViewController` only allows landscape rotation when its `goingFullScreen` flag is `true`
   - We use Key-Value Coding to set this flag before presenting the fullscreen modal
   - Without this fix, fullscreen videos would be stuck in portrait orientation

2. **Force Landscape Rotation**
   - `enterFullscreenLandscape()` temporarily sets the SDK's internal `_forceFullscreenLandscape` flag
   - This triggers the SDK's `rotateScreen()` method which uses iOS 16+ `requestGeometryUpdate()` API
   - The rotation happens immediately upon entering fullscreen

3. **Main Screen Orientation Lock**
   - The app's `Info.plist` supports all orientations: `UIInterfaceOrientationPortrait`, `UIInterfaceOrientationLandscapeLeft`, `UIInterfaceOrientationLandscapeRight`
   - The main screen stays portrait through proper view controller orientation configuration
   - When exiting fullscreen, the app automatically returns to portrait

### Code Implementation

**ExpoBBPlayerView.swift:**
```swift
func enterFullscreen() {
    enterFullscreenWithLandscapeForce(forceLandscape: false)
}

func enterFullscreenLandscape() {
    enterFullscreenWithLandscapeForce(forceLandscape: true)
}

private func enterFullscreenWithLandscapeForce(forceLandscape: Bool) {
    // CRITICAL FIX: Set goingFullScreen flag on BBNativePlayerViewController
    // This allows the view controller to return .allButUpsideDown orientation mask
    if let playerView = playerController.playerView?.player as? NSObject {
        if let bbViewController = playerView.value(forKey: "bbNativePlayerViewController") as? NSObject {
            bbViewController.setValue(true, forKey: "goingFullScreen")
        }
    }

    // Temporarily set forceFullscreenLandscape if immediate landscape is requested
    if forceLandscape {
        if let playerView = playerController.playerView?.player as? NSObject {
            playerView.setValue(true, forKey: "_forceFullscreenLandscape")
        }
    }

    playerController.playerView?.player.enterFullScreen()
}
```

### iOS Requirements

1. **Info.plist Configuration:**
   ```xml
   <key>UISupportedInterfaceOrientations</key>
   <array>
       <string>UIInterfaceOrientationPortrait</string>
       <string>UIInterfaceOrientationLandscapeLeft</string>
       <string>UIInterfaceOrientationLandscapeRight</string>
   </array>
   ```

2. **Expo app.json Configuration:**
   ```json
   {
     "expo": {
       "orientation": "default"
     }
   }
   ```

## Android Implementation Details

### How It Works

On Android, orientation control is handled differently:

1. **Standard Fullscreen (`enterFullscreen()`)**
   - Uses the native Android fullscreen player
   - Respects device orientation changes
   - User must physically rotate device to switch to landscape

2. **Landscape Fullscreen (`enterFullscreenLandscape()`)**
   - Currently uses the same implementation as `enterFullscreen()`
   - Android's native player handles orientation automatically based on video aspect ratio
   - Future enhancement: Could use `expo-screen-orientation` to force landscape

### Android Requirements

1. **AndroidManifest.xml** should support all orientations:
   ```xml
   <activity
       android:configChanges="orientation|screenSize"
       android:screenOrientation="fullUser">
   </activity>
   ```

## Best Practices

### 1. Aspect Ratio Detection

Always check the video aspect ratio before deciding which fullscreen method to use:

```typescript
const isWidescreenVideo = (clip: MediaClip | null): boolean => {
  if (!clip) return false;
  const width = clip.width || clip.originalWidth;
  const height = clip.height || clip.originalHeight;
  if (!width || !height) return false;
  const aspectRatio = width / height;
  // Common widescreen formats: 16:9 = 1.77, 16:10 = 1.6, 21:9 = 2.33
  return aspectRatio >= 1.5;
};
```

### 2. Smart Button Visibility

Show the landscape fullscreen button only for widescreen videos:

```typescript
{isWidescreenVideo(currentMediaClip) && (
  <TouchableOpacity onPress={handleFullscreenLandscape}>
    <Text>Fullscreen Landscape</Text>
  </TouchableOpacity>
)}
```

### 3. Event Handling

Listen to fullscreen events for proper state management:

```typescript
<ExpoBBPlayerView
  onDidTriggerFullscreen={() => {
    console.log('Entered fullscreen');
  }}
  onDidTriggerRetractFullscreen={() => {
    console.log('Exited fullscreen');
  }}
/>
```

## Troubleshooting

### Issue: Fullscreen video stuck in portrait on iOS

**Solution:** Ensure your `app.json` has `"orientation": "default"` (not `"portrait"`):
```json
{
  "expo": {
    "orientation": "default"
  }
}
```

### Issue: Main screen rotates after exiting fullscreen

**Solution:** This should not happen with the current implementation. The iOS fix ensures proper view controller hierarchy and orientation control.

### Issue: Landscape rotation doesn't work immediately

**Solution:** Use `enterFullscreenLandscape()` instead of `enterFullscreen()` for immediate landscape rotation.

### Issue: iOS 15 or older doesn't rotate to landscape

**Limitation:** The `requestGeometryUpdate()` API used for forced rotation is only available on iOS 16+. On older versions, the SDK's rotation implementation has no fallback, so only manual device rotation will work.

## Version History

- **v1.0.0** - Initial implementation with separate `enterFullscreen()` and `enterFullscreenLandscape()` methods
- Fixed iOS fullscreen orientation by setting `goingFullScreen` flag on BBNativePlayerViewController
- Removed global `forceFullscreenLandscape` option in favor of per-call control

## See Also

- [Blue Billywig iOS SDK Documentation](~/git/bbnativeplayerkit-swift)
- [Expo Screen Orientation API](https://docs.expo.dev/versions/latest/sdk/screen-orientation/)
- [React Native Documentation](https://reactnative.dev/)
