---
sidebar_position: 1
title: Components
description: BBPlayerView, BBShortsView, BBOutstreamView, and BBModalPlayer API.
---

# Components

## BBPlayerView

The main video player component. Renders a native player view (AVPlayer on iOS, ExoPlayer on Android).

```tsx
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

<BBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  options={{ autoPlay: true }}
  style={{ flex: 1 }}
  onDidTriggerPlay={() => console.log('Playing')}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|:---:|-------------|
| `jsonUrl` | `string` | Yes | Blue Billywig media JSON URL |
| `playerId` | `string` | No | Unique identifier for multi-player scenarios |
| `jwt` | `string` | No | JWT token for authenticated playback |
| `options` | `Record<string, unknown>` | No | Player configuration options |
| `style` | `ViewStyle` | No | React Native style object |
| Event callbacks | See [Events](./events.md) | No | Player lifecycle event handlers |

### Common Options

```tsx
options={{
  autoPlay: true,
  autoMute: true,
  controlBar: 'Autohide',       // 'Always' | 'Never' | 'Autohide'
  showStartControlBar: 'Yes',
  modalPlayer: true,             // Force landscape on fullscreen tap
  allowCollapseExpand: true,     // Enable for outstream
  noStats: false,                // Disable analytics
  disableCookies: false,         // GDPR cookie compliance
}}
```

---

## BBShortsView

Vertical video player with swipe navigation (TikTok-style). Uses a separate native view optimized for the Shorts experience.

```tsx
import { BBShortsView } from '@bluebillywig/react-native-bb-player';

<BBShortsView
  jsonUrl="https://demo.bbvms.com/sh/58.json"
  options={{ displayFormat: 'full' }}
  style={{ flex: 1 }}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|:---:|-------------|
| `jsonUrl` | `string` | Yes | Shorts JSON URL (`/sh/{id}.json`) |
| `options` | `BBShortsViewOptions` | No | Shorts configuration |
| `style` | `ViewStyle` | No | Container style |
| `onDidSetupWithJsonUrl` | `(url: string) => void` | No | Loaded successfully |
| `onDidFailWithError` | `(error: string) => void` | No | Error occurred |
| `onDidTriggerResize` | `(w: number, h: number) => void` | No | View resized |

### BBShortsViewOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `displayFormat` | `'full' \| 'list' \| 'player'` | `'full'` | Display format |
| `skipShortsAdOnSwipe` | `boolean` | `false` | Skip ad when swiping |
| `shelfStartSpacing` | `number` | — | Start spacing for list format |
| `shelfEndSpacing` | `number` | — | End spacing for list format |

### Methods (via ref)

| Method | Description |
|--------|-------------|
| `destroy()` | Clean up and release resources |

See [Shorts Guide](../guides/shorts.md) for usage details.

---

## BBOutstreamView

Convenience wrapper for outstream advertising with automatic collapse/expand animations.

```tsx
import { BBOutstreamView } from '@bluebillywig/react-native-bb-player';

<BBOutstreamView
  jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
  expandedHeight={250}
  animation={{ type: 'spring', damping: 15, stiffness: 100 }}
/>
```

### Props

Extends all `BBPlayerView` props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expandedHeight` | `number` | `200` | Height when expanded (px) |
| `collapsedHeight` | `number` | `0` | Height when collapsed (px) |
| `animation` | `OutstreamAnimationConfig` | `timing, 300ms` | Animation configuration |
| `onCollapsed` | `() => void` | — | After collapse animation |
| `onExpanded` | `() => void` | — | After expand animation |
| `onAnimationStart` | `(isCollapsing: boolean) => void` | — | Animation started |

### Methods (via ref)

All `BBPlayerViewMethods` plus:

| Method | Return | Description |
|--------|--------|-------------|
| `isCollapsed()` | `boolean` | Current collapsed state |
| `animateCollapse()` | `void` | Collapse with animation |
| `animateExpand()` | `void` | Expand with animation |

See [Outstream Guide](../guides/outstream.md) for usage details.

---

## BBModalPlayer

Imperative API for presenting a native modal player. No component mounting required.

```tsx
import { BBModalPlayer } from '@bluebillywig/react-native-bb-player';

// Present
BBModalPlayer.present(
  'https://demo.bbvms.com/p/default/c/4701337.json',
  { autoPlay: true },
  { contextId: '123' }
);

// Dismiss
BBModalPlayer.dismiss();

// Listen for events
BBModalPlayer.addEventListener('dismiss', () => {
  console.log('Modal closed');
});
```

### API

| Method / Property | Description |
|---|---|
| `BBModalPlayer.isAvailable` | `boolean` — check if native module is available |
| `BBModalPlayer.present(jsonUrl, options?, context?)` | Present modal player. Returns `boolean` (success) |
| `BBModalPlayer.dismiss()` | Dismiss modal player |
| `BBModalPlayer.addEventListener(event, callback)` | Listen for modal events |

### ModalPlayerOptions

| Option | Type | Description |
|--------|------|-------------|
| `autoPlay` | `boolean` | Auto-play after loading |
| `playout` | `string` | Override playout name |

### Events

| Event | Description |
|-------|-------------|
| `'dismiss'` | Modal was dismissed |
