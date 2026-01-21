# Outstream Advertising Guide

This guide covers how to integrate Blue Billywig Outstream video ads into your React Native application using `react-native-bb-player`.

## Overview

Outstream advertising is a video ad format that runs **independently of video content**. Unlike instream ads (pre-roll, mid-roll, post-roll) that play within a video player, Outstream ads are standalone ad players designed to be embedded within non-video content like articles, feeds, or any scrollable content.

### Key Features

- **Standalone Ad Player**: No video content required - ads are the primary content
- **Collapse/Expand**: Player can collapse when not in view and expand when visible
- **Scroll-Friendly**: Designed for placement within scrollable content
- **Multiple Formats**: Support for various Outstream formats (InArticle, StayInView, etc.)
- **Native Performance**: Uses the native BB SDK for optimal ad playback

### Outstream vs Instream

| Feature | Outstream | Instream |
|---------|-----------|----------|
| Video content | Not required | Required |
| Placement | Anywhere in app | Within video player |
| Collapse/Expand | Yes | No |
| Ad phases | Standalone | PRE/MAIN/POST |
| Use case | Article monetization | Video monetization |

## URL Format

Outstream uses a different URL format than regular video playback:

```
# Regular video (instream)
https://{domain}.bbvms.com/p/{playout}/c/{clipId}.json

# Outstream advertising
https://{domain}.bbvms.com/a/{outstreamPlayout}.json
```

Note the `/a/` path segment instead of `/p/` for Outstream.

## Two Integration Options

You can integrate Outstream in two ways:

1. **BBOutstreamView** (Recommended) - Convenience wrapper with automatic collapse/expand animations
2. **BBPlayerView** - Direct usage with manual height management

---

## Option 1: BBOutstreamView (Convenience Wrapper)

`BBOutstreamView` is a pre-built wrapper component that handles collapse/expand animations automatically.

### Basic Usage

```tsx
import React, { useRef, useEffect } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import {
  BBOutstreamView,
  type BBOutstreamViewMethods,
} from '@bluebillywig/react-native-bb-player';

function ArticleWithAd() {
  const outstreamRef = useRef<BBOutstreamViewMethods>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => outstreamRef.current?.destroy();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit...
      </Text>

      <BBOutstreamView
        ref={outstreamRef}
        jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
        expandedHeight={250}
        style={styles.adContainer}
        onCollapsed={() => console.log('Ad collapsed')}
        onExpanded={() => console.log('Ad expanded')}
        onDidTriggerAdStarted={() => console.log('Ad started playing')}
        onDidTriggerAdFinished={() => console.log('Ad finished')}
      />

      <Text style={styles.paragraph}>
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  adContainer: {
    marginVertical: 16,
    backgroundColor: '#000',
  },
});
```

### Animation Options

`BBOutstreamView` supports multiple animation types:

```tsx
// Smooth timing animation (default)
<BBOutstreamView
  animation={{ type: 'timing', duration: 300 }}
  // ...
/>

// Spring animation with bounce
<BBOutstreamView
  animation={{ type: 'spring', damping: 15, stiffness: 100 }}
  // ...
/>

// LayoutAnimation (may be smoother on some devices)
<BBOutstreamView
  animation={{ type: 'layout', duration: 250 }}
  // ...
/>

// No animation (instant)
<BBOutstreamView
  animation={{ type: 'none' }}
  // ...
/>
```

### BBOutstreamView Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `jsonUrl` | `string` | Required | Outstream ad JSON URL (`/a/` endpoint) |
| `expandedHeight` | `number` | `200` | Height when expanded (pixels) |
| `collapsedHeight` | `number` | `0` | Height when collapsed (pixels) |
| `animation` | `OutstreamAnimationConfig` | `{ type: 'timing', duration: 300 }` | Animation configuration |
| `options` | `Record<string, unknown>` | `{}` | Player options (see below) |
| `onCollapsed` | `() => void` | - | Called after collapse animation completes |
| `onExpanded` | `() => void` | - | Called after expand animation completes |
| `onAnimationStart` | `(isCollapsing: boolean) => void` | - | Called when animation starts |
| All `BBPlayerView` props | - | - | Supports all player events |

### BBOutstreamView Methods

In addition to all `BBPlayerViewMethods`, BBOutstreamView adds:

| Method | Return Type | Description |
|--------|-------------|-------------|
| `isCollapsed()` | `boolean` | Returns current collapsed state |
| `animateCollapse()` | `void` | Programmatically collapse with animation |
| `animateExpand()` | `void` | Programmatically expand with animation |

### Programmatic Control

```tsx
const outstreamRef = useRef<BBOutstreamViewMethods>(null);

// Check state
const collapsed = outstreamRef.current?.isCollapsed();

// Programmatically collapse/expand
outstreamRef.current?.animateCollapse();
outstreamRef.current?.animateExpand();

// Standard player controls still work
outstreamRef.current?.pause();
outstreamRef.current?.setMuted(true);
```

---

## Option 2: BBPlayerView (Manual Implementation)

For more control over the collapse/expand behavior, you can use `BBPlayerView` directly with manual height management.

### Basic Manual Implementation

```tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, ScrollView, Text, StyleSheet } from 'react-native';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
} from '@bluebillywig/react-native-bb-player';

const EXPANDED_HEIGHT = 250;
const COLLAPSED_HEIGHT = 0;

function OutstreamManual() {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const heightAnim = useRef(new Animated.Value(EXPANDED_HEIGHT)).current;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => playerRef.current?.destroy();
  }, []);

  const handleRequestCollapse = useCallback(() => {
    setIsCollapsed(true);
    Animated.timing(heightAnim, {
      toValue: COLLAPSED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [heightAnim]);

  const handleRequestExpand = useCallback(() => {
    setIsCollapsed(false);
    Animated.timing(heightAnim, {
      toValue: EXPANDED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [heightAnim]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>Article content above the ad...</Text>

      <Animated.View style={[styles.adContainer, { height: heightAnim }]}>
        <BBPlayerView
          ref={playerRef}
          jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
          options={{
            allowCollapseExpand: true,
            autoPlay: false,
          }}
          style={{ flex: 1 }}
          onDidRequestCollapse={handleRequestCollapse}
          onDidRequestExpand={handleRequestExpand}
        />
      </Animated.View>

      <Text style={styles.paragraph}>Article content below the ad...</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  adContainer: {
    marginVertical: 16,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});
```

### Using LayoutAnimation Instead

For simpler animation that may work better on some devices:

```tsx
import { LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function OutstreamWithLayoutAnimation() {
  const [height, setHeight] = useState(EXPANDED_HEIGHT);

  const handleRequestCollapse = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHeight(0);
  }, []);

  const handleRequestExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHeight(EXPANDED_HEIGHT);
  }, []);

  return (
    <View style={[styles.adContainer, { height }]}>
      <BBPlayerView
        jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
        options={{ allowCollapseExpand: true }}
        onDidRequestCollapse={handleRequestCollapse}
        onDidRequestExpand={handleRequestExpand}
        style={{ flex: 1 }}
      />
    </View>
  );
}
```

---

## Configuration Options

### Required Options for Outstream

```tsx
options={{
  allowCollapseExpand: true,  // Enable collapse/expand UI controls
}}
```

### Common Outstream Options

```tsx
options={{
  allowCollapseExpand: true,
  autoPlay: false,           // Don't auto-play until in view
  autoMute: true,            // Start muted (recommended for auto-play)
  autoLoop: false,           // Don't loop the ad
}}
```

### Advertising System Parameters

For advanced ad targeting, you can pass advertising system parameters:

```tsx
options={{
  allowCollapseExpand: true,
  adsystem_buid: 'browser-unique-id',
  adsystem_rdid: 'resettable-device-id',
  adsystem_idtype: 'idfa',  // or 'aaid' for Android
  adsystem_is_lat: '0',     // '1' if limit ad tracking is enabled
  adsystem_ppid: 'publisher-provided-id',
}}
```

---

## Events

### Key Events for Outstream

```tsx
<BBOutstreamView
  // Collapse/Expand events
  onDidRequestCollapse={() => console.log('Player requests collapse')}
  onDidRequestExpand={() => console.log('Player requests expand')}

  // Ad lifecycle events
  onDidTriggerAdLoadStart={() => console.log('Ad loading...')}
  onDidTriggerAdLoaded={() => console.log('Ad loaded')}
  onDidTriggerAdStarted={() => console.log('Ad playing')}
  onDidTriggerAdFinished={() => console.log('Ad complete')}
  onDidTriggerAdError={(error) => console.error('Ad error:', error)}
  onDidTriggerAdNotFound={() => console.log('No ad available')}

  // Quartile tracking
  onDidTriggerAdQuartile1={() => console.log('25% viewed')}
  onDidTriggerAdQuartile2={() => console.log('50% viewed')}
  onDidTriggerAdQuartile3={() => console.log('75% viewed')}
  onDidTriggerAllAdsCompleted={() => console.log('All ads done')}

  // Click tracking
  onDidRequestOpenUrl={(url) => console.log('Click-through:', url)}
/>
```

---

## Complete Example with Analytics

```tsx
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import {
  BBOutstreamView,
  type BBOutstreamViewMethods,
} from '@bluebillywig/react-native-bb-player';

interface OutstreamAdProps {
  articleId: string;
  position: 'top' | 'middle' | 'bottom';
}

export function OutstreamAd({ articleId, position }: OutstreamAdProps) {
  const outstreamRef = useRef<BBOutstreamViewMethods>(null);
  const [adState, setAdState] = useState<'loading' | 'playing' | 'finished' | 'error'>('loading');
  const [isVisible, setIsVisible] = useState(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => outstreamRef.current?.destroy();
  }, []);

  const trackEvent = useCallback((event: string, data?: object) => {
    // Send to your analytics service
    console.log(`[Outstream] ${event}`, {
      articleId,
      position,
      ...data,
    });
  }, [articleId, position]);

  const handleAdStarted = useCallback(() => {
    setAdState('playing');
    trackEvent('ad_started');
  }, [trackEvent]);

  const handleAdFinished = useCallback(() => {
    setAdState('finished');
    trackEvent('ad_finished');
  }, [trackEvent]);

  const handleAdError = useCallback((error: string) => {
    setAdState('error');
    trackEvent('ad_error', { error });
  }, [trackEvent]);

  const handleCollapsed = useCallback(() => {
    setIsVisible(false);
    trackEvent('collapsed');
  }, [trackEvent]);

  const handleExpanded = useCallback(() => {
    setIsVisible(true);
    trackEvent('expanded');
  }, [trackEvent]);

  // Don't render container if ad errored or finished and collapsed
  if (adState === 'error') {
    return null;
  }

  return (
    <View style={styles.container}>
      {adState === 'loading' && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading ad...</Text>
        </View>
      )}

      <BBOutstreamView
        ref={outstreamRef}
        jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
        expandedHeight={250}
        animation={{ type: 'spring', damping: 20, stiffness: 100 }}
        options={{
          autoPlay: false,
          autoMute: true,
        }}
        onCollapsed={handleCollapsed}
        onExpanded={handleExpanded}
        onDidTriggerAdStarted={handleAdStarted}
        onDidTriggerAdFinished={handleAdFinished}
        onDidTriggerAdError={handleAdError}
        onDidTriggerAdQuartile1={() => trackEvent('quartile_1')}
        onDidTriggerAdQuartile2={() => trackEvent('quartile_2')}
        onDidTriggerAdQuartile3={() => trackEvent('quartile_3')}
        onDidRequestOpenUrl={(url) => trackEvent('click_through', { url })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#000',
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    zIndex: 1,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
});
```

---

## Cleanup (Important!)

Always clean up Outstream players when navigating away to stop playback and release resources:

```tsx
useEffect(() => {
  return () => {
    outstreamRef.current?.destroy();
  };
}, []);
```

---

## Troubleshooting

### Ad Not Loading

1. Verify the URL uses `/a/` path (not `/p/`)
2. Check that the Outstream playout exists in your publication
3. Verify `onDidTriggerAdError` for error details
4. Check network connectivity

### Collapse/Expand Not Working

1. Ensure `allowCollapseExpand: true` is set in options
2. Verify `onDidRequestCollapse` and `onDidRequestExpand` callbacks are connected
3. For `BBOutstreamView`, check that `expandedHeight` is set

### Animation Issues

- Try different animation types (`timing`, `spring`, `layout`, `none`)
- On Android, ensure `LayoutAnimation` is enabled if using `layout` type
- Reduce animation duration if performance is poor

### Player Height Not Updating

When using manual implementation:
- Ensure `overflow: 'hidden'` is set on the animated container
- Verify the `Animated.Value` is being updated correctly

---

## Best Practices

1. **Placement**: Place Outstream ads at natural content breaks (between paragraphs)
2. **Height**: Use appropriate height for your ad creatives (typically 200-300px)
3. **Muting**: Start muted with `autoMute: true` for better UX
4. **Cleanup**: Always destroy the player when navigating away
5. **Error Handling**: Handle `onDidTriggerAdError` to gracefully hide failed ads
6. **Analytics**: Track ad events for monetization insights

---

## Related Resources

- [API Documentation](https://bluebillywig.github.io/react-native-bb-player/) - Full API reference
- [BBPlayerView Guide](./player.md) - Standard video playback
- [Shorts Guide](./shorts.md) - Vertical video player
- [Blue Billywig Outstream Documentation](https://support.bluebillywig.com/outstreamads/outstream-ads-introduction/)
