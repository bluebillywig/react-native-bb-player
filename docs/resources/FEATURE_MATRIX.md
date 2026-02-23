# Feature Matrix

This document outlines platform support and feature availability for the Blue Billywig React Native Player SDK.

## Platform Support

| Platform | Minimum Version | Architecture | Status |
|----------|-----------------|--------------|--------|
| **iOS** | 13.4+ | ARM64 | ✅ Supported |
| **Android** | API 24 (7.0+) | ARM64, ARMv7, x86_64 | ✅ Supported |
| **tvOS** | 13.4+ | ARM64 | ⚠️ Experimental |
| **Android TV** | API 24+ | ARM64, x86 | ✅ Supported |
| **Fire TV** | Fire OS 6.0+ | ARM64 | ✅ Supported |

## React Native Compatibility

| Version | Old Architecture | New Architecture (Fabric) |
|---------|------------------|---------------------------|
| 0.73.x | ✅ | ✅ |
| 0.74.x | ✅ | ✅ |
| 0.75.x | ✅ | ✅ |
| 0.76.x+ | ✅ | ✅ |

## Expo Compatibility

| Expo SDK | Support | Notes |
|----------|---------|-------|
| 51+ | ✅ | Config plugin for automatic setup |
| Expo Go | ❌ | Requires development build |
| EAS Build | ✅ | Fully compatible |

> **Note**: This SDK includes native code and requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/). See the [Expo Setup Guide](../guides/expo-setup.md) for details.

## Streaming Features

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| **HLS** | ✅ | ✅ | Primary streaming format |
| **DASH** | ❌ | ✅ | Android only |
| **Progressive MP4** | ✅ | ✅ | |
| **Live Streaming** | ✅ | ✅ | |
| **DVR (Live Rewind)** | ✅ | ✅ | Configurable in playout |
| **Adaptive Bitrate (ABR)** | ✅ | ✅ | Automatic quality selection |

## Playback Controls

| Feature | iOS | Android | API |
|---------|-----|---------|-----|
| **Play/Pause** | ✅ | ✅ | `play()`, `pause()` |
| **Seek (absolute)** | ✅ | ✅ | `seek(position)` |
| **Seek (relative)** | ✅ | ✅ | `seekRelative(offset)` |
| **Volume Control** | ✅ | ✅ | `setVolume(0-1)` |
| **Mute/Unmute** | ✅ | ✅ | `setMuted(boolean)` |
| **Playback Rate** | ⚠️ | ⚠️ | Via playout options |

## Display Modes

| Feature | iOS | Android | API |
|---------|-----|---------|-----|
| **Inline Playback** | ✅ | ✅ | Default |
| **Fullscreen** | ✅ | ✅ | `enterFullscreen()` |
| **Fullscreen Landscape** | ✅ | ✅ | `enterFullscreenLandscape()` |
| **Modal-style Fullscreen** | ✅ | ✅ | `enterFullscreenLandscape()` + offscreen view ([guide](../guides/fullscreen.md)) |
| **Exit Fullscreen** | ✅ | ✅ | `exitFullscreen()` |
| **Picture-in-Picture** | ✅ | ✅ | Via native controls |
| **Collapse/Expand** | ✅ | ✅ | `collapse()`, `expand()` |

## Advertising

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| **VAST 3.0/4.0** | ✅ | ✅ | |
| **VPAID** | ✅ | ✅ | |
| **Pre-roll** | ✅ | ✅ | |
| **Mid-roll** | ✅ | ✅ | |
| **Post-roll** | ✅ | ✅ | |
| **Google IMA** | ✅ | ✅ | Built into native SDK |
| **Ad Quartile Events** | ✅ | ✅ | 25%, 50%, 75%, 100% |
| **Skip Button** | ✅ | ✅ | Configurable in playout |

## Casting

| Feature | iOS | Android | API |
|---------|-----|---------|-----|
| **Chromecast** | ✅ | ✅ | `showCastPicker()` |
| **AirPlay** | ✅ | N/A | Native iOS control |

## Content Loading

| Feature | iOS | Android | API |
|---------|-----|---------|-----|
| **Load by JSON URL** | ✅ | ✅ | `jsonUrl` prop |
| **Load by Clip ID** | ✅ | ✅ | `loadWithClipId()` |
| **Load by ClipList ID** | ✅ | ✅ | `loadWithClipListId()` |
| **Load by Project ID** | ✅ | ✅ | `loadWithProjectId()` |
| **Load with JSON data** | ✅ | ✅ | `loadWithClipJson()` etc. |

## Events

| Event Category | iOS | Android |
|----------------|-----|---------|
| **Playback** (play, pause, ended, etc.) | ✅ | ✅ |
| **State Changes** | ✅ | ✅ |
| **Phase Changes** (PRE, MAIN, POST) | ✅ | ✅ |
| **Time Updates** | ✅ | ✅ |
| **Volume Changes** | ✅ | ✅ |
| **Fullscreen Events** | ✅ | ✅ |
| **Ad Events** | ✅ | ✅ |
| **Media Load Events** | ✅ | ✅ |
| **Error Events** | ✅ | ✅ |
| **Custom Statistics** | ✅ | ✅ |

## Async Getters

| Getter | iOS | Android | Return Type |
|--------|-----|---------|-------------|
| `getDuration()` | ✅ | ✅ | `Promise<number>` |
| `getVolume()` | ✅ | ✅ | `Promise<number>` |
| `getMuted()` | ✅ | ✅ | `Promise<boolean>` |
| `getPhase()` | ✅ | ✅ | `Promise<string>` |
| `getState()` | ✅ | ✅ | `Promise<string>` |
| `getMode()` | ✅ | ✅ | `Promise<string>` |
| `getClipData()` | ✅ | ✅ | `Promise<object>` |
| `getProjectData()` | ✅ | ✅ | `Promise<object>` |
| `getPlayoutData()` | ✅ | ✅ | `Promise<object>` |

## Subtitles & Captions

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| **WebVTT** | ✅ | ✅ | |
| **SRT** | ✅ | ✅ | |
| **Embedded (HLS)** | ✅ | ✅ | |
| **CEA-608/708** | ✅ | ✅ | Native player support |

## Analytics

| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| **BB Analytics** | ✅ | ✅ | Built-in |
| **View Events** | ✅ | ✅ | `onDidTriggerViewStarted/Finished` |
| **Custom Statistics** | ✅ | ✅ | `onDidTriggerCustomStatistics` |

## Not Yet Supported

| Feature | Status | Notes |
|---------|--------|-------|
| **Offline Download** | ❌ | Not available in SDK |
| **360° Video** | ❌ | Not available |
| **VR Playback** | ❌ | Not available |
| **Expo Managed Workflow** | ⚠️ | Use bare workflow |

## Legend

- ✅ Fully supported
- ⚠️ Partial support or experimental
- ❌ Not supported
- N/A Not applicable to platform
