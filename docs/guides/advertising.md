# Advertising Integration

This guide covers how to use video advertising with the Blue Billywig React Native Player SDK.

## Overview

The BB Player SDK supports comprehensive ad integration:

- **VAST** (Video Ad Serving Template)
- **VPAID** (Video Player Ad Interface Definition)
- **Pre-roll, mid-roll, and post-roll** ad positions
- **Google IMA** integration (via native SDKs)

Ads are configured through your Blue Billywig playout settings - no SDK-level configuration needed.

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Your App       │────▶│  BB Platform    │────▶│  Ad Server      │
│  (JSON URL)     │     │  (Ad Schedule)  │     │  (VAST/VPAID)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. Your playout configuration defines the ad schedule
2. The SDK automatically requests and plays ads
3. Your app receives events for ad lifecycle

## Basic Usage

Ads play automatically based on your playout configuration:

```tsx
import React from 'react';
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function PlayerWithAds() {
  return (
    <BBPlayerView
      jsonUrl="https://your-pub.bbvms.com/p/ads-enabled-playout/c/12345.json"
      options={{ autoPlay: true }}
      style={{ flex: 1 }}
    />
  );
}
```

## Ad Events

Track the full ad lifecycle with events:

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function PlayerWithAdTracking() {
  const [adStatus, setAdStatus] = useState<string>('No ad');
  const [isAdPlaying, setIsAdPlaying] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <BBPlayerView
        jsonUrl="https://your-pub.bbvms.com/p/ads-playout/c/12345.json"
        style={{ flex: 1 }}

        // Ad loading
        onDidTriggerAdLoadStart={() => {
          setAdStatus('Loading ad...');
        }}
        onDidTriggerAdLoaded={() => {
          setAdStatus('Ad loaded');
        }}
        onDidTriggerAdNotFound={() => {
          setAdStatus('No ad available');
        }}

        // Ad playback
        onDidTriggerAdStarted={() => {
          setAdStatus('Ad playing');
          setIsAdPlaying(true);
        }}
        onDidTriggerAdFinished={() => {
          setAdStatus('Ad complete');
          setIsAdPlaying(false);
        }}

        // Ad progress (quartiles)
        onDidTriggerAdQuartile1={() => console.log('Ad 25% complete')}
        onDidTriggerAdQuartile2={() => console.log('Ad 50% complete')}
        onDidTriggerAdQuartile3={() => console.log('Ad 75% complete')}

        // All ads done
        onDidTriggerAllAdsCompleted={() => {
          setAdStatus('All ads completed');
        }}

        // Ad errors
        onDidTriggerAdError={(error) => {
          console.error('Ad error:', error);
          setAdStatus('Ad error');
          setIsAdPlaying(false);
        }}
      />

      {/* Optional: Show ad status overlay */}
      <View style={{ position: 'absolute', top: 10, left: 10 }}>
        <Text style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: 4 }}>
          {adStatus}
        </Text>
      </View>
    </View>
  );
}
```

## Ad Events Reference

| Event | Description | Payload |
|-------|-------------|---------|
| `onDidTriggerAdLoadStart` | Ad request started | - |
| `onDidTriggerAdLoaded` | Ad successfully loaded | - |
| `onDidTriggerAdNotFound` | No ad returned from server | - |
| `onDidTriggerAdStarted` | Ad playback began | - |
| `onDidTriggerAdFinished` | Single ad completed | - |
| `onDidTriggerAdQuartile1` | Ad reached 25% | - |
| `onDidTriggerAdQuartile2` | Ad reached 50% | - |
| `onDidTriggerAdQuartile3` | Ad reached 75% | - |
| `onDidTriggerAllAdsCompleted` | All scheduled ads done | - |
| `onDidTriggerAdError` | Ad playback failed | `error: string` |

## Player Phases

The player goes through phases that indicate ad vs. content playback:

```tsx
import { BBPlayerView, type Phase } from '@bluebillywig/react-native-bb-player';

function PlayerWithPhaseTracking() {
  const handlePhaseChange = (phase: Phase) => {
    switch (phase) {
      case 'PRE':
        console.log('Pre-roll ads');
        break;
      case 'MAIN':
        console.log('Main content');
        break;
      case 'POST':
        console.log('Post-roll ads');
        break;
      case 'EXIT':
        console.log('Playback ended');
        break;
    }
  };

  return (
    <BBPlayerView
      jsonUrl="https://your-pub.bbvms.com/p/playout/c/12345.json"
      onDidTriggerPhaseChange={handlePhaseChange}
      style={{ flex: 1 }}
    />
  );
}
```

## Customizing Ad Behavior

### Skip Button / Ad UI

The native player UI handles skip buttons and ad countdowns automatically. The appearance is configured in your BB playout settings.

### Disabling Ads for Testing

To test without ads, use a playout that has no ad schedule configured, or request a test playout from Blue Billywig.

## Analytics Integration

Track ad performance with the custom statistics event:

```tsx
<BBPlayerView
  jsonUrl="https://your-pub.bbvms.com/p/playout/c/12345.json"
  onDidTriggerCustomStatistics={(stats) => {
    // stats contains: { ident, ev, aux }
    // Send to your analytics platform
    analytics.track('video_ad_event', {
      identifier: stats.ident,
      event: stats.ev,
      auxiliary: stats.aux,
    });
  }}
/>
```

## Best Practices

### 1. Handle Ad Errors Gracefully

Ads can fail for many reasons. Don't let ad errors break the user experience:

```tsx
onDidTriggerAdError={(error) => {
  // Log but don't show error to user
  // Content will continue to play
  console.warn('Ad error (content continues):', error);
}}
```

### 2. Adjust UI During Ads

Hide custom controls during ads to avoid interference:

```tsx
const [isAdPlaying, setIsAdPlaying] = useState(false);

<BBPlayerView
  onDidTriggerAdStarted={() => setIsAdPlaying(true)}
  onDidTriggerAdFinished={() => setIsAdPlaying(false)}
  onDidTriggerAllAdsCompleted={() => setIsAdPlaying(false)}
/>

{!isAdPlaying && <CustomControls />}
```

### 3. Track Quartiles for Analytics

Quartile events are valuable for ad performance measurement:

```tsx
onDidTriggerAdQuartile1={() => trackAdProgress(25)}
onDidTriggerAdQuartile2={() => trackAdProgress(50)}
onDidTriggerAdQuartile3={() => trackAdProgress(75)}
onDidTriggerAdFinished={() => trackAdProgress(100)}
```

## Troubleshooting

### Ads Not Playing

1. Verify your playout has an ad schedule configured
2. Check that ad tags are valid and returning ads
3. Look for `onDidTriggerAdNotFound` or `onDidTriggerAdError` events

### Ad Blockers

On iOS, in-app ads aren't affected by browser ad blockers. On Android, some system-level ad blockers may interfere.

### VAST Errors

Common VAST error codes in `onDidTriggerAdError`:
- **301**: Timeout waiting for ad
- **400**: General VAST error
- **403**: Ad not served (frequency cap, geo-restriction, etc.)

## Related Guides

- [README - Quick Start](../../README.md#quick-start)
- [README - Events](../../README.md#events)
- [Expo Setup](./expo-setup.md)
