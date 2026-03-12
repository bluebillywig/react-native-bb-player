---
sidebar_position: 1
title: Components
description: BBPlayerView, BBShortsView, BBOutstreamPlayerView, and BBModalPlayer API.
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
| `jsonUrl` | `string` | Yes | JSON embed URL |
| `playerId` | `string` | No | Unique identifier for multi-player scenarios |
| `jwt` | `string` | No | JWT token for authenticated access |
| `options` | `Record<string, unknown>` | No | Player configuration options (see below) |
| `style` | `ViewStyle` | No | React Native style object |
| Event callbacks | See [Events](./events.md) | No | Player lifecycle event handlers |

### Player Options

Options are passed through to the native SDK's `createPlayerView`. They can override playout settings.

```tsx
options={{
  // Playback
  autoPlay: true,                    // Override playout auto-play setting
  autoMute: true,                    // Override playout auto-mute setting
  showStartControlBar: 'Yes',        // Override playout start control bar setting
  controlBar: 'Autohide',            // 'Always' | 'Never' | 'Autohide'
  modalPlayer: true,                 // Force landscape on fullscreen tap
  forceFullscreenLandscape: true,    // Rotate to landscape on fullscreen

  // Commercials
  commercials: true,                 // Allow commercials (overrides playout)
  noChromeCast: false,               // Disable ChromeCast support (overrides playout)

  // Outstream
  allowCollapseExpand: true,         // Enable collapse/expand (for outstream)

  // Analytics
  noStats: false,                    // Disable stats logging

  // Consent Management
  waitForCmp: true,                  // Wait for Consent Management before setup
  handleConsentManagement: true,     // Handle Consent Management (requires waitForCmp)
  tagForUnderAgeOfConsent: false,    // Tag for under age of consent
  consent_string: '',                // Default consent string
  consent_gdprApplies: 1,           // Default GDPR applies (0 or 1)
  consent_cmpVersion: 2,            // Default CMP version
  disableCookies: false,             // GDPR cookie compliance

  // Ad System parameters
  adsystem_buid: 'app-bundle-id',           // App bundle ID
  adsystem_rdid: 'resettable-device-id',    // Resettable device identifier
  adsystem_idtype: 'idfa',                  // 'idfa' (iOS) or 'adid' (Android)
  adsystem_is_lat: false,                   // Limit ad tracking
  adsystem_ppid: 'publisher-provided-id',   // Publisher-provided ID

  // Custom ad tag URL parameters (prefix with adTagUrlParam_)
  adTagUrlParam_userId: '12345',
  adTagUrlParam_section: 'sports',
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

## BBOutstreamPlayerView

Convenience wrapper for outstream advertising with automatic collapse/expand animations.

> **Note**: Previously named `BBOutstreamView`. The old name is still exported as a deprecated alias.

```tsx
import { BBOutstreamPlayerView } from '@bluebillywig/react-native-bb-player';

<BBOutstreamPlayerView
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

// Present a clip
BBModalPlayer.present('https://demo.bbvms.com/p/default/c/4701337.json', {
  autoPlay: true,
});

// Present a clip within a playlist context (enables auto-advance)
BBModalPlayer.present(
  'https://demo.bbvms.com/p/default/c/4701337.json',
  { autoPlay: true },
  {
    contextEntityId: '4701337',
    contextCollectionId: '12345',
    contextCollectionType: 'MediaClipList',
  }
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
| `jwt` | `string` | JWT token for authenticated access |
| `playerBackgroundColor` | `string` | Background color |
| `fitmode` | `string` | Video fit mode |

Any additional key-value pairs are passed through to the native SDK as player options.

### ModalPlayerContext

| Field | Type | Description |
|-------|------|-------------|
| `contextEntityType` | `string` | Entity type (e.g. `'MediaClipList'`) |
| `contextEntityId` | `string` | Entity ID (clip ID when playing within a collection) |
| `contextCollectionType` | `string` | Collection type (e.g. `'MediaClipList'`) |
| `contextCollectionId` | `string` | Collection ID (playlist/cliplist ID) |

### Events

| Event | Description |
|-------|-------------|
| `'dismiss'` | Modal was dismissed |
