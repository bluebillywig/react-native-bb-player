# Analytics Guide

This guide covers analytics integration with `react-native-bb-player`, including built-in Blue Billywig analytics and custom statistics tracking.

## Overview

The player provides two types of analytics:

1. **Built-in Analytics** - Automatic view tracking and statistics sent to Blue Billywig's analytics platform
2. **Custom Statistics** - A callback system for custom analytics events that you can forward to your own analytics platform

## Built-in Analytics

Blue Billywig's built-in analytics are enabled by default and track:

- Video views and completion rates
- Play/pause events
- Seek behavior
- Quartile progress (25%, 50%, 75%, 100%)
- Ad impressions and completions
- Error rates

### Configuration Options

Analytics behavior can be configured via playout settings or the `options` prop:

```tsx
<BBPlayerView
  jsonUrl="https://your-domain.bbvms.com/p/default/c/12345.json"
  options={{
    // Disable all statistics tracking
    noStats: false,

    // Google Analytics integration (legacy Universal Analytics)
    googleAnalyticsId: 'UA-XXXXX-Y',
    googleAnalyticsCustomVars: JSON.stringify({
      dimension1: 'value1',
    }),

    // Piwik/Matomo integration
    piwikUrl: 'https://analytics.example.com/',
    piwikSiteId: '1',

    // NedStat integration
    nedStatLoggerUrl: 'https://nedstat.example.com/log',

    // Privacy options
    disableCookies: true,  // Disable analytics cookies
  }}
/>
```

### Disabling Analytics

To disable all built-in analytics:

```tsx
<BBPlayerView
  jsonUrl="..."
  options={{ noStats: true }}
/>
```

## Custom Statistics Events

The `onDidTriggerCustomStatistics` callback fires when the player triggers custom analytics events. This allows you to capture and forward events to your own analytics platform.

### Event Structure

```typescript
type CustomStatistics = {
  ident: string;           // Event identifier (e.g., clip ID)
  ev: string;              // Event type/name
  aux: Record<string, string>;  // Additional key-value data
};
```

### Basic Usage

```tsx
import { BBPlayerView, type CustomStatistics } from '@bluebillywig/react-native-bb-player';

function AnalyticsPlayer() {
  const handleCustomStatistics = (stats: CustomStatistics) => {
    console.log('Custom statistics event:', {
      identifier: stats.ident,
      event: stats.ev,
      data: stats.aux,
    });

    // Forward to your analytics platform
    sendToAnalytics(stats);
  };

  return (
    <BBPlayerView
      jsonUrl="https://your-domain.bbvms.com/p/default/c/12345.json"
      onDidTriggerCustomStatistics={handleCustomStatistics}
    />
  );
}
```

### Integration Examples

#### Google Analytics 4

```tsx
import analytics from '@react-native-firebase/analytics';

const handleCustomStatistics = async (stats: CustomStatistics) => {
  await analytics().logEvent('video_custom_event', {
    video_id: stats.ident,
    event_type: stats.ev,
    ...stats.aux,
  });
};
```

#### Mixpanel

```tsx
import { Mixpanel } from 'mixpanel-react-native';

const handleCustomStatistics = (stats: CustomStatistics) => {
  mixpanel.track(stats.ev, {
    video_id: stats.ident,
    ...stats.aux,
  });
};
```

#### Amplitude

```tsx
import * as amplitude from '@amplitude/analytics-react-native';

const handleCustomStatistics = (stats: CustomStatistics) => {
  amplitude.track(stats.ev, {
    video_id: stats.ident,
    ...stats.aux,
  });
};
```

#### Segment

```tsx
import { useAnalytics } from '@segment/analytics-react-native';

function AnalyticsPlayer() {
  const { track } = useAnalytics();

  const handleCustomStatistics = (stats: CustomStatistics) => {
    track(stats.ev, {
      video_id: stats.ident,
      ...stats.aux,
    });
  };

  return (
    <BBPlayerView
      jsonUrl="..."
      onDidTriggerCustomStatistics={handleCustomStatistics}
    />
  );
}
```

## View Tracking Events

The player provides specific events for view tracking:

```tsx
<BBPlayerView
  jsonUrl="..."
  onDidTriggerViewStarted={() => {
    // Fired when a view session starts
    analytics.track('video_view_started', { video_id: clipId });
  }}
  onDidTriggerViewFinished={() => {
    // Fired when a view session completes
    analytics.track('video_view_finished', { video_id: clipId });
  }}
/>
```

## Playback Progress Tracking

Track playback progress using state changes and built-in events:

### Using Built-in Quartile Events (Ads)

For ad quartile tracking, use the dedicated events:

```tsx
<BBPlayerView
  jsonUrl="..."
  onDidTriggerAdQuartile1={() => analytics.track('ad_quartile', { quartile: 25 })}
  onDidTriggerAdQuartile2={() => analytics.track('ad_quartile', { quartile: 50 })}
  onDidTriggerAdQuartile3={() => analytics.track('ad_quartile', { quartile: 75 })}
  onDidTriggerAdFinished={() => analytics.track('ad_quartile', { quartile: 100 })}
/>
```

## Complete Analytics Example

Here's a comprehensive example that tracks all major analytics events:

```tsx
import React, { useRef, useCallback } from 'react';
import { View } from 'react-native';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
  type CustomStatistics,
  type State,
  type Phase,
  type MediaClip,
} from '@bluebillywig/react-native-bb-player';

// Your analytics service
const analytics = {
  track: (event: string, properties: Record<string, any>) => {
    console.log('Analytics:', event, properties);
    // Send to your analytics platform
  },
};

export function FullAnalyticsPlayer({ clipId }: { clipId: string }) {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const sessionId = useRef(Date.now().toString());
  const playStartTime = useRef<number | null>(null);

  // Track custom statistics from native SDK
  const handleCustomStatistics = useCallback((stats: CustomStatistics) => {
    analytics.track('bb_custom_statistics', {
      session_id: sessionId.current,
      event_id: stats.ident,
      event_type: stats.ev,
      ...stats.aux,
    });
  }, []);

  // Track view lifecycle
  const handleViewStarted = useCallback(() => {
    playStartTime.current = Date.now();
    analytics.track('video_view_started', {
      session_id: sessionId.current,
      clip_id: clipId,
    });
  }, [clipId]);

  const handleViewFinished = useCallback(() => {
    const watchDuration = playStartTime.current
      ? (Date.now() - playStartTime.current) / 1000
      : 0;

    analytics.track('video_view_finished', {
      session_id: sessionId.current,
      clip_id: clipId,
      watch_duration_seconds: watchDuration,
    });
  }, [clipId]);

  // Track playback state
  const handleStateChange = useCallback((state: State) => {
    analytics.track('video_state_change', {
      session_id: sessionId.current,
      clip_id: clipId,
      state,
    });
  }, [clipId]);

  // Track errors
  const handleError = useCallback((error: string) => {
    analytics.track('video_error', {
      session_id: sessionId.current,
      clip_id: clipId,
      error,
    });
  }, [clipId]);

  // Track media loaded
  const handleMediaClipLoaded = useCallback((clip: MediaClip) => {
    analytics.track('video_loaded', {
      session_id: sessionId.current,
      clip_id: clip.id,
      title: clip.title,
      duration: clip.length,
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl={`https://your-domain.bbvms.com/p/default/c/${clipId}.json`}
        style={{ flex: 1 }}
        // Custom statistics
        onDidTriggerCustomStatistics={handleCustomStatistics}
        // View tracking
        onDidTriggerViewStarted={handleViewStarted}
        onDidTriggerViewFinished={handleViewFinished}
        // Playback tracking
        onDidTriggerStateChange={handleStateChange}
        onDidTriggerMediaClipLoaded={handleMediaClipLoaded}
        // Error tracking
        onDidFailWithError={handleError}
        onDidTriggerMediaClipFailed={() => handleError('Media clip failed to load')}
        // Ad tracking
        onDidTriggerAdStarted={() => analytics.track('ad_started', { clip_id: clipId })}
        onDidTriggerAdFinished={() => analytics.track('ad_finished', { clip_id: clipId })}
        onDidTriggerAdError={(error) => analytics.track('ad_error', { clip_id: clipId, error })}
      />
    </View>
  );
}
```

## Privacy Considerations

When implementing analytics, consider:

1. **User Consent**: Ensure you have appropriate consent before tracking
2. **Data Minimization**: Only collect data you need
3. **Cookie Compliance**: Use `disableCookies: true` if required by regulations
4. **Opt-Out**: Provide users a way to disable tracking

```tsx
<BBPlayerView
  jsonUrl="..."
  options={{
    disableCookies: !hasAnalyticsConsent,
    noStats: !hasAnalyticsConsent,
  }}
/>
```

## Related Resources

- [Advertising Guide](./advertising.md) - Ad tracking and analytics
- [API Documentation](https://bluebillywig.github.io/react-native-bb-player/) - Full API reference
- [Feature Matrix](../resources/FEATURE_MATRIX.md) - Feature comparison
