# Shorts Guide

This guide covers how to integrate Blue Billywig Shorts into your React Native application using `react-native-bb-player`.

## Overview

Shorts are a vertical video player experience with swipe navigation, similar to TikTok, Instagram Reels, or YouTube Shorts. They provide an engaging, mobile-first way to present short-form video content.

**Important:** Shorts use a dedicated `BBShortsView` component, which is separate from the standard `BBPlayerView`. This is because Shorts require a specialized native view that supports vertical swipe navigation and the full Shorts playback experience.

### Key Features

- **Vertical Video Format**: Optimized for portrait orientation
- **Swipe Navigation**: Users can swipe up/down to navigate between videos
- **Auto-play**: Videos automatically play as users navigate
- **Full-screen Experience**: Designed for immersive viewing
- **Native Performance**: Uses the native BB SDK Shorts view for optimal performance

## Expo Support

BBShortsView works with Expo out of the box. If you've already set up `@bluebillywig/react-native-bb-player` for your Expo project, no additional configuration is needed for Shorts.

### Expo Setup (if not already done)

1. Install the package:
   ```bash
   npx expo install @bluebillywig/react-native-bb-player
   ```

2. Add the config plugin to your `app.json`:
   ```json
   {
     "expo": {
       "plugins": [
         "@bluebillywig/react-native-bb-player"
       ]
     }
   }
   ```

3. Build your development app:
   ```bash
   npx expo prebuild
   npx expo run:ios
   # or
   npx expo run:android
   ```

> **Note**: This SDK requires native code and cannot run in Expo Go. You must use a [development build](https://docs.expo.dev/develop/development-builds/introduction/).

For detailed Expo setup instructions, see the [Expo Setup Guide](./expo-setup.md).

## BBShortsView Component

### Basic Usage

```tsx
import { BBShortsView } from '@bluebillywig/react-native-bb-player';

function ShortsPlayer({ shortsId }: { shortsId: string }) {
  return (
    <BBShortsView
      jsonUrl={`https://your-domain.bbvms.com/sh/${shortsId}.json`}
      style={{ flex: 1 }}
      onDidSetupWithJsonUrl={(url) => console.log('Shorts loaded:', url)}
      onDidFailWithError={(error) => console.error('Error:', error)}
    />
  );
}
```

### With Options

The `options` prop allows you to customize the Shorts experience:

```tsx
<BBShortsView
  jsonUrl="https://your-domain.bbvms.com/sh/58.json"
  options={{
    displayFormat: 'full',        // 'full' | 'list' | 'player'
    skipShortsAdOnSwipe: true,    // Skip ad when swiping
    shelfStartSpacing: 16,        // Spacing for list/shelf format
    shelfEndSpacing: 16,
  }}
  style={{ flex: 1 }}
/>
```

### Available Display Formats

| Format | Description |
|--------|-------------|
| `full` | Full-screen swipe experience (default) |
| `list` | Thumbnail shelf/list view |
| `player` | Single player mode |

## URL Format

Shorts URLs follow this pattern:
```
https://{domain}.bbvms.com/sh/{shortsId}.json
```

For example:
- `https://demo.bbvms.com/sh/58.json`
- `https://your-publication.bbvms.com/sh/71.json`

## Complete Example

Here's a full example of a Shorts screen with error handling, status display, and proper cleanup when navigating away:

```tsx
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import {
  BBShortsView,
  type BBShortsViewMethods,
} from '@bluebillywig/react-native-bb-player';

interface ShortsScreenProps {
  shortsId: string;
}

export function ShortsScreen({ shortsId }: ShortsScreenProps) {
  const shortsRef = useRef<BBShortsViewMethods>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: Clean up when navigating away to stop playback
  useEffect(() => {
    return () => {
      shortsRef.current?.destroy();
    };
  }, []);

  const handleSetup = useCallback((url: string) => {
    console.log('Shorts loaded:', url);
    setIsReady(true);
    setError(null);
  }, []);

  const handleError = useCallback((err: string) => {
    console.error('Shorts error:', err);
    setError(err);
  }, []);

  return (
    <View style={styles.container}>
      <BBShortsView
        ref={shortsRef}
        jsonUrl={`https://your-domain.bbvms.com/sh/${shortsId}.json`}
        style={styles.shorts}
        onDidSetupWithJsonUrl={handleSetup}
        onDidFailWithError={handleError}
      />

      {/* Status overlay */}
      <SafeAreaView style={styles.statusOverlay} pointerEvents="none">
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : !isReady ? (
          <Text style={styles.loadingText}>Loading Shorts...</Text>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  shorts: {
    flex: 1,
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
});
```

## BBShortsView vs BBPlayerView

| Feature | BBShortsView | BBPlayerView |
|---------|-------------|--------------|
| Vertical swipe navigation | ✅ | ❌ |
| Full-screen Shorts experience | ✅ | ❌ |
| Standard video playback | ❌ | ✅ |
| Play/pause control | N/A (automatic) | ✅ |
| Seek control | N/A | ✅ |
| Fullscreen control | N/A (always full) | ✅ |

**Note:** Do not try to load Shorts URLs (`.../sh/{id}.json`) in `BBPlayerView`. The regular player view does not support Shorts-specific features like swipe navigation.

## Props Reference

### BBShortsViewProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `jsonUrl` | `string` | Yes | URL to the Shorts JSON configuration |
| `options` | `BBShortsViewOptions` | No | Configuration options |
| `style` | `ViewStyle` | No | Style for the container view |
| `onDidSetupWithJsonUrl` | `(url: string) => void` | No | Called when Shorts loads successfully |
| `onDidFailWithError` | `(error: string) => void` | No | Called when an error occurs |
| `onDidTriggerResize` | `(width: number, height: number) => void` | No | Called when the view resizes |

### BBShortsViewOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `displayFormat` | `'full' \| 'list' \| 'player'` | `'full'` | Display format |
| `skipShortsAdOnSwipe` | `boolean` | `false` | Skip ad when user swipes |
| `shelfStartSpacing` | `number` | - | Start spacing for list format |
| `shelfEndSpacing` | `number` | - | End spacing for list format |

### BBShortsViewMethods

| Method | Description |
|--------|-------------|
| `destroy()` | Clean up the Shorts view and release resources |

## Layout Considerations

Shorts are designed for portrait/vertical viewing. Consider these layout tips:

### Full Screen Portrait

```tsx
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  shorts: {
    flex: 1,
  },
});
```

### With Safe Areas

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SafeShortsScreen({ shortsId }: { shortsId: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom
    }]}>
      <BBShortsView
        jsonUrl={`https://your-domain.bbvms.com/sh/${shortsId}.json`}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

## Cleanup (Important!)

**Always clean up the Shorts view when navigating away** to stop playback and release resources. Without proper cleanup, audio may continue playing in the background after leaving the screen.

```tsx
const shortsRef = useRef<BBShortsViewMethods>(null);

// REQUIRED: Clean up when navigating away to stop playback
useEffect(() => {
  return () => {
    shortsRef.current?.destroy();
  };
}, []);
```

This pattern ensures:
- Video/audio playback stops when leaving the screen
- Native resources are properly released
- No background audio continues after navigation

## Troubleshooting

### Shorts Not Loading

1. Verify the Shorts ID exists in your publication
2. Check the JSON URL format: `https://{domain}.bbvms.com/sh/{shortsId}.json`
3. Ensure your publication has Shorts enabled
4. Check the `onDidFailWithError` callback for error details

### Swipe Not Working

- Ensure you're using `BBShortsView`, not `BBPlayerView`
- Check that there are multiple clips in the Shorts configuration
- Verify the Shorts has `displayFormat: 'full'` (or not set, as full is default)

### Black Screen

- Check network connectivity
- Verify the Shorts configuration includes valid video content
- Check logs for any error messages

### Audio Continues After Leaving Screen

If audio keeps playing after navigating away from the Shorts screen:

1. **Add cleanup in useEffect** - This is the most common fix:
   ```tsx
   useEffect(() => {
     return () => {
       shortsRef.current?.destroy();
     };
   }, []);
   ```

2. Make sure you're storing the ref properly with `useRef<BBShortsViewMethods>(null)`

3. Ensure the ref is attached to the `BBShortsView` component via the `ref` prop

## Related Resources

- [API Documentation](https://bluebillywig.github.io/react-native-bb-player/) - Full API reference
- [BBPlayerView Guide](./player.md) - For standard video playback
