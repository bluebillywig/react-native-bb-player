---
sidebar_position: 6
title: Outstream Ads
description: Standalone ad player with collapse/expand for article placements.
---

# Outstream Advertising

Outstream ads run **independently of video content** — they're standalone ad players designed for embedding within articles, feeds, or scrollable content.

| Feature | Outstream | Instream |
|---------|-----------|----------|
| Video content | Not required | Required |
| Placement | Anywhere | Within video player |
| Collapse/Expand | Yes | No |
| Use case | Article monetization | Video monetization |

## URL Format

```
# Outstream (note /a/ path)
https://{domain}.bbvms.com/a/{outstreamPlayout}.json

# Regular video (for comparison)
https://{domain}.bbvms.com/p/{playout}/c/{clipId}.json
```

## Option 1: BBOutstreamPlayerView (Recommended)

Pre-built wrapper with automatic collapse/expand animations:

```tsx
import React, { useRef, useEffect } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { BBOutstreamPlayerView, type BBOutstreamViewMethods } from '@bluebillywig/react-native-bb-player';

function ArticleWithAd() {
  const outstreamRef = useRef<BBOutstreamViewMethods>(null);

  useEffect(() => {
    return () => outstreamRef.current?.destroy();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>Article content above the ad...</Text>

      <BBOutstreamPlayerView
        ref={outstreamRef}
        jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
        expandedHeight={250}
        style={styles.ad}
        onCollapsed={() => console.log('Collapsed')}
        onExpanded={() => console.log('Expanded')}
        onDidTriggerAdStarted={() => console.log('Ad started')}
      />

      <Text style={styles.paragraph}>Article content below the ad...</Text>
    </ScrollView>
  );
}
```

### Animation Options

```tsx
// Smooth timing (default)
<BBOutstreamPlayerView animation={{ type: 'timing', duration: 300 }} />

// Spring with bounce
<BBOutstreamPlayerView animation={{ type: 'spring', damping: 15, stiffness: 100 }} />

// LayoutAnimation
<BBOutstreamPlayerView animation={{ type: 'layout', duration: 250 }} />

// Instant
<BBOutstreamPlayerView animation={{ type: 'none' }} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `jsonUrl` | `string` | Required | Outstream ad URL (`/a/` endpoint) |
| `expandedHeight` | `number` | `200` | Height when expanded (px) |
| `collapsedHeight` | `number` | `0` | Height when collapsed (px) |
| `animation` | `OutstreamAnimationConfig` | `timing, 300ms` | Animation config |
| `onCollapsed` | `() => void` | — | After collapse completes |
| `onExpanded` | `() => void` | — | After expand completes |
| All `BBPlayerView` props | — | — | All player events supported |

### Methods

| Method | Description |
|--------|-------------|
| `isCollapsed()` | Returns current collapsed state |
| `animateCollapse()` | Programmatic collapse |
| `animateExpand()` | Programmatic expand |
| + all `BBPlayerViewMethods` | Standard player controls |

## Option 2: BBPlayerView (Manual)

For full control over collapse/expand:

```tsx
import React, { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

const EXPANDED = 250;

function OutstreamManual() {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const height = useRef(new Animated.Value(EXPANDED)).current;

  const collapse = useCallback(() => {
    Animated.timing(height, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  }, []);

  const expand = useCallback(() => {
    Animated.timing(height, { toValue: EXPANDED, duration: 300, useNativeDriver: false }).start();
  }, []);

  return (
    <Animated.View style={{ height, overflow: 'hidden', backgroundColor: '#000' }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
        options={{ allowCollapseExpand: true }}
        style={{ flex: 1 }}
        onDidRequestCollapse={collapse}
        onDidRequestExpand={expand}
      />
    </Animated.View>
  );
}
```

## Ad Targeting Parameters

```tsx
options={{
  allowCollapseExpand: true,
  adsystem_buid: 'browser-unique-id',
  adsystem_rdid: 'resettable-device-id',
  adsystem_idtype: 'idfa',        // or 'aaid' for Android
  adsystem_is_lat: '0',           // '1' if limit ad tracking
  adsystem_ppid: 'publisher-id',
}}
```

## Best Practices

1. **Place at content breaks** — between paragraphs for natural flow
2. **Start muted** — `autoMute: true` for better UX
3. **Appropriate height** — typically 200–300px
4. **Always cleanup** — `destroy()` on unmount
5. **Handle errors** — hide failed ads gracefully
6. **Track events** — monitor ad performance

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Ad not loading | Verify URL uses `/a/` path (not `/p/`) |
| Collapse/expand broken | Set `allowCollapseExpand: true` in options |
| Animation issues | Try different animation type; enable LayoutAnimation on Android |
| Height not updating | Ensure `overflow: 'hidden'` on container |
