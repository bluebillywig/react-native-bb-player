---
sidebar_position: 4
title: Analytics
description: Built-in analytics and custom statistics integration.
---

# Analytics

The SDK provides two analytics layers:

1. **Built-in** — automatic view tracking sent to Blue Billywig's analytics platform
2. **Custom Statistics** — callback system for forwarding events to your own analytics

## Built-in Analytics

Enabled by default. Tracks: video views, completion rates, play/pause, seek, quartile progress, ad impressions, and errors.

### Configuration

```tsx
<BBPlayerView
  jsonUrl="..."
  options={{
    noStats: false,              // Set true to disable all analytics
    disableCookies: true,        // Disable analytics cookies (GDPR)
  }}
/>
```

## Custom Statistics

The `onDidTriggerCustomStatistics` callback fires when the native SDK emits analytics events:

```typescript
type CustomStatistics = {
  ident: string;                    // Event identifier (e.g., clip ID)
  ev: string;                       // Event type/name
  aux: Record<string, string>;      // Additional key-value data
};
```

### Basic Usage

```tsx
import { BBPlayerView, type CustomStatistics } from '@bluebillywig/react-native-bb-player';

<BBPlayerView
  jsonUrl="..."
  onDidTriggerCustomStatistics={(stats: CustomStatistics) => {
    myAnalytics.track(stats.ev, {
      video_id: stats.ident,
      ...stats.aux,
    });
  }}
/>
```

### Integration Examples

#### Google Analytics 4

```tsx
import analytics from '@react-native-firebase/analytics';

const handleStats = async (stats: CustomStatistics) => {
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

const handleStats = (stats: CustomStatistics) => {
  mixpanel.track(stats.ev, {
    video_id: stats.ident,
    ...stats.aux,
  });
};
```

#### Amplitude

```tsx
import * as amplitude from '@amplitude/analytics-react-native';

const handleStats = (stats: CustomStatistics) => {
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

  return (
    <BBPlayerView
      jsonUrl="..."
      onDidTriggerCustomStatistics={(stats) => {
        track(stats.ev, { video_id: stats.ident, ...stats.aux });
      }}
    />
  );
}
```

## View Tracking

```tsx
<BBPlayerView
  jsonUrl="..."
  onDidTriggerViewStarted={() => analytics.track('video_view_started')}
  onDidTriggerViewFinished={() => analytics.track('video_view_finished')}
/>
```

## Complete Example

```tsx
import React, { useRef, useCallback } from 'react';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
  type CustomStatistics,
  type State,
  type MediaClip,
} from '@bluebillywig/react-native-bb-player';

export function FullAnalyticsPlayer({ clipId }: { clipId: string }) {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const sessionId = useRef(Date.now().toString());

  return (
    <BBPlayerView
      ref={playerRef}
      jsonUrl={`https://your-domain.bbvms.com/p/default/c/${clipId}.json`}
      style={{ flex: 1 }}
      // Custom statistics from native SDK
      onDidTriggerCustomStatistics={(stats) => {
        analytics.track('bb_custom_statistics', {
          session_id: sessionId.current,
          event_id: stats.ident,
          event_type: stats.ev,
          ...stats.aux,
        });
      }}
      // View lifecycle
      onDidTriggerViewStarted={() => analytics.track('video_view_started', { clip_id: clipId })}
      onDidTriggerViewFinished={() => analytics.track('video_view_finished', { clip_id: clipId })}
      // State & errors
      onDidTriggerStateChange={(state) => analytics.track('video_state_change', { state })}
      onDidFailWithError={(error) => analytics.track('video_error', { error })}
      // Ads
      onDidTriggerAdStarted={() => analytics.track('ad_started')}
      onDidTriggerAdFinished={() => analytics.track('ad_finished')}
    />
  );
}
```

## Privacy

When implementing analytics, consider:

1. **User consent** — get appropriate consent before tracking
2. **Data minimization** — only collect what you need
3. **Cookie compliance** — use `disableCookies: true` for GDPR
4. **Opt-out** — provide users a way to disable tracking

```tsx
<BBPlayerView
  options={{
    disableCookies: !hasConsent,
    noStats: !hasConsent,
  }}
/>
```
