---
sidebar_position: 5
title: Shorts
description: Vertical video player with swipe navigation (TikTok-style).
---

# Shorts

Shorts provide a vertical video player with swipe navigation — similar to TikTok, Instagram Reels, or YouTube Shorts. They use a dedicated `BBShortsView` component (separate from `BBPlayerView`).

## Basic Usage

```tsx
import { BBShortsView } from '@bluebillywig/react-native-bb-player';

function ShortsPlayer({ shortsId }: { shortsId: string }) {
  return (
    <BBShortsView
      jsonUrl={`https://your-domain.bbvms.com/sh/${shortsId}.json`}
      style={{ flex: 1 }}
      onDidSetupWithJsonUrl={(url) => console.log('Loaded:', url)}
      onDidFailWithError={(error) => console.error('Error:', error)}
    />
  );
}
```

## URL Format

```
https://{domain}.bbvms.com/sh/{shortsId}.json
```

## Display Formats

| Format | Description |
|--------|-------------|
| `'full'` | Full-screen vertical swipe experience (default) |
| `'list'` | Horizontal shelf/carousel with compact thumbnails |
| `'player'` | Single player mode |

### Full Mode (Default)

```tsx
<BBShortsView
  jsonUrl="https://your-domain.bbvms.com/sh/58.json"
  options={{ displayFormat: 'full' }}
  style={{ flex: 1 }}
/>
```

### Shelf Mode

Horizontal carousel for embedding within other content:

```tsx
<View style={{ height: 400, borderRadius: 16, overflow: 'hidden' }}>
  <BBShortsView
    jsonUrl={`https://your-domain.bbvms.com/sh/${shortsId}.json`}
    options={{
      displayFormat: 'list',
      shelfStartSpacing: 16,
      shelfEndSpacing: 16,
    }}
    style={{ flex: 1 }}
  />
</View>
```

Tapping a thumbnail in shelf mode opens the full-screen Shorts player as a modal overlay.

## Options

```tsx
<BBShortsView
  jsonUrl="..."
  options={{
    displayFormat: 'full',
    skipShortsAdOnSwipe: true,   // Skip ad when swiping
    shelfStartSpacing: 16,       // Shelf mode edge padding
    shelfEndSpacing: 16,
  }}
/>
```

## Complete Example

```tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BBShortsView,
  type BBShortsViewMethods,
} from '@bluebillywig/react-native-bb-player';

export function ShortsScreen({ shortsId }: { shortsId: string }) {
  const shortsRef = useRef<BBShortsViewMethods>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: Clean up when navigating away
  useEffect(() => {
    return () => { shortsRef.current?.destroy(); };
  }, []);

  return (
    <View style={styles.container}>
      <BBShortsView
        ref={shortsRef}
        jsonUrl={`https://your-domain.bbvms.com/sh/${shortsId}.json`}
        style={styles.shorts}
        onDidSetupWithJsonUrl={() => setIsReady(true)}
        onDidFailWithError={(err) => setError(err)}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {!isReady && !error && <Text style={styles.loading}>Loading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  shorts: { flex: 1 },
  error: { position: 'absolute', bottom: 20, alignSelf: 'center', color: '#ff6b6b' },
  loading: { position: 'absolute', bottom: 20, alignSelf: 'center', color: '#fff' },
});
```

## Cleanup (Important!)

**Always destroy the Shorts view when navigating away** to stop playback and free resources:

```tsx
const shortsRef = useRef<BBShortsViewMethods>(null);

useEffect(() => {
  return () => { shortsRef.current?.destroy(); };
}, []);
```

Without this, audio may continue playing in the background.

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `jsonUrl` | `string` | Yes | Shorts JSON URL |
| `options` | `BBShortsViewOptions` | No | Configuration |
| `style` | `ViewStyle` | No | Container style |
| `onDidSetupWithJsonUrl` | `(url: string) => void` | No | Loaded successfully |
| `onDidFailWithError` | `(error: string) => void` | No | Error occurred |
| `onDidTriggerResize` | `(w: number, h: number) => void` | No | View resized |

## BBShortsView vs BBPlayerView

| Feature | BBShortsView | BBPlayerView |
|---------|-------------|--------------|
| Vertical swipe navigation | Yes | No |
| Full-screen Shorts experience | Yes | No |
| Play/pause/seek control | Automatic | Manual |
| Use for standard video | No | Yes |

:::warning
Do **not** load Shorts URLs (`/sh/...`) in `BBPlayerView`. The regular player doesn't support Shorts features like swipe navigation.
:::

## Expo Support

Works out of the box with the standard Expo setup — no additional configuration needed for Shorts.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Not loading | Check URL format: `https://{domain}.bbvms.com/sh/{id}.json` |
| Swipe not working | Use `BBShortsView`, not `BBPlayerView`; ensure multiple clips exist |
| Black screen | Check network + Shorts config content |
| Audio continues after leaving | Add `destroy()` cleanup in `useEffect` return |
