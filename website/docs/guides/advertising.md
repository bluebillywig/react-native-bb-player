---
sidebar_position: 3
title: Advertising
description: VAST, VPAID, and Google IMA ad integration.
---

# Advertising

The BB Player SDK supports comprehensive ad integration: VAST, VPAID, pre/mid/post-roll positions, and Google IMA — all configured through your Blue Billywig playout settings.

## How It Works

```
Your App (JSON URL) → BB Platform (Ad Schedule) → Ad Server (VAST/VPAID)
```

1. Your playout configuration defines the ad schedule
2. The SDK automatically requests and plays ads
3. Your app receives events for the ad lifecycle

## Basic Usage

Ads play automatically based on your playout configuration:

```tsx
<BBPlayerView
  jsonUrl="https://your-pub.bbvms.com/p/ads-enabled-playout/c/12345.json"
  options={{ autoPlay: true }}
  style={{ flex: 1 }}
/>
```

## Ad Events

```tsx
<BBPlayerView
  jsonUrl="https://your-pub.bbvms.com/p/ads-playout/c/12345.json"
  style={{ flex: 1 }}
  // Loading
  onDidTriggerAdLoadStart={() => console.log('Loading ad...')}
  onDidTriggerAdLoaded={() => console.log('Ad loaded')}
  onDidTriggerAdNotFound={() => console.log('No ad available')}
  // Playback
  onDidTriggerAdStarted={() => console.log('Ad playing')}
  onDidTriggerAdFinished={() => console.log('Ad complete')}
  // Progress (quartiles)
  onDidTriggerAdQuartile1={() => console.log('25%')}
  onDidTriggerAdQuartile2={() => console.log('50%')}
  onDidTriggerAdQuartile3={() => console.log('75%')}
  // Completion
  onDidTriggerAllAdsCompleted={() => console.log('All ads done')}
  // Errors
  onDidTriggerAdError={(error) => console.error('Ad error:', error)}
/>
```

### Ad Events Reference

| Event | Description |
|-------|-------------|
| `onDidTriggerAdLoadStart` | Ad request started |
| `onDidTriggerAdLoaded` | Ad loaded successfully |
| `onDidTriggerAdNotFound` | No ad returned |
| `onDidTriggerAdStarted` | Ad playback began |
| `onDidTriggerAdFinished` | Single ad completed |
| `onDidTriggerAdQuartile1` | Ad reached 25% |
| `onDidTriggerAdQuartile2` | Ad reached 50% |
| `onDidTriggerAdQuartile3` | Ad reached 75% |
| `onDidTriggerAllAdsCompleted` | All scheduled ads done |
| `onDidTriggerAdError` | Ad failed (payload: `error: string`) |

## Player Phases

Track ad vs. content phases:

```tsx
import { type Phase } from '@bluebillywig/react-native-bb-player';

<BBPlayerView
  onDidTriggerPhaseChange={(phase: Phase) => {
    // 'PRE' = pre-roll ads
    // 'MAIN' = content
    // 'POST' = post-roll ads
    // 'EXIT' = playback ended
  }}
/>
```

## Adjusting UI During Ads

Hide custom controls during ad playback:

```tsx
const [isAdPlaying, setIsAdPlaying] = useState(false);

<BBPlayerView
  onDidTriggerAdStarted={() => setIsAdPlaying(true)}
  onDidTriggerAdFinished={() => setIsAdPlaying(false)}
  onDidTriggerAllAdsCompleted={() => setIsAdPlaying(false)}
/>

{!isAdPlaying && <CustomControls />}
```

## Best Practices

1. **Handle errors gracefully** — content continues after ad errors
2. **Track quartiles** for ad performance measurement
3. **Hide custom UI during ads** to avoid interference with ad controls
4. **Use a test playout** (no ad schedule) for development

## Troubleshooting

### Ads Not Playing

1. Verify your playout has an ad schedule configured
2. Check ad tags are valid and returning ads
3. Look for `onDidTriggerAdNotFound` or `onDidTriggerAdError` events

### Common VAST Error Codes

| Code | Meaning |
|------|---------|
| 301 | Timeout waiting for ad |
| 400 | General VAST error |
| 403 | Ad not served (frequency cap, geo-restriction) |

See also: [Outstream Advertising](./outstream.md) for standalone ad placements.
