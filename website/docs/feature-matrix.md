---
sidebar_position: 8
title: Feature Matrix
description: Full platform and feature support table.
---

# Feature Matrix

## Platform Support

| Platform | Minimum Version | Architecture | Status |
|----------|-----------------|--------------|--------|
| **iOS** | 13.4+ | ARM64 | Supported |
| **Android** | API 24 (7.0+) | ARM64, ARMv7, x86_64 | Supported |
| **tvOS** | 13.4+ | ARM64 | Experimental |
| **Android TV** | API 24+ | ARM64, x86 | Supported |
| **Fire TV** | Fire OS 6.0+ | ARM64 | Supported |

## React Native Compatibility

| Version | Old Architecture | New Architecture (Fabric) |
|---------|:---:|:---:|
| 0.73.x | ✅ | ✅ |
| 0.74.x | ✅ | ✅ |
| 0.75.x | ✅ | ✅ |
| 0.76.x+ | ✅ | ✅ |

## Expo Compatibility

| Expo SDK | Support | Notes |
|----------|:---:|-------|
| 51+ | ✅ | Config plugin for automatic setup |
| Expo Go | ❌ | Requires development build |
| EAS Build | ✅ | Fully compatible |

## Streaming

| Feature | iOS | Android |
|---------|:---:|:---:|
| HLS | ✅ | ✅ |
| DASH | ❌ | ✅ |
| Progressive MP4 | ✅ | ✅ |
| Live Streaming | ✅ | ✅ |
| DVR (Live Rewind) | ✅ | ✅ |
| Adaptive Bitrate | ✅ | ✅ |

## Playback Controls

| Feature | iOS | Android | API |
|---------|:---:|:---:|-----|
| Play/Pause | ✅ | ✅ | `play()`, `pause()` |
| Seek (absolute) | ✅ | ✅ | `seek(position)` |
| Seek (relative) | ✅ | ✅ | `seekRelative(offset)` |
| Volume | ✅ | ✅ | `setVolume(0-1)` |
| Mute/Unmute | ✅ | ✅ | `setMuted(boolean)` |

## Display Modes

| Feature | iOS | Android | API |
|---------|:---:|:---:|-----|
| Inline | ✅ | ✅ | Default |
| Fullscreen | ✅ | ✅ | `enterFullscreen()` |
| Fullscreen Landscape | ✅ | ✅ | `enterFullscreenLandscape()` |
| Modal-style | ✅ | ✅ | [Guide](./guides/fullscreen.md) |
| Exit Fullscreen | ✅ | ✅ | `exitFullscreen()` |
| Picture-in-Picture | ✅ | ✅ | Via native controls |
| Collapse/Expand | ✅ | ✅ | `collapse()`, `expand()` |

## Advertising

| Feature | iOS | Android |
|---------|:---:|:---:|
| VAST 3.0/4.0 | ✅ | ✅ |
| VPAID | ✅ | ✅ |
| Pre-roll | ✅ | ✅ |
| Mid-roll | ✅ | ✅ |
| Post-roll | ✅ | ✅ |
| Google IMA | ✅ | ✅ |
| Ad Quartile Events | ✅ | ✅ |
| Skip Button | ✅ | ✅ |

## Casting

| Feature | iOS | Android | API |
|---------|:---:|:---:|-----|
| Chromecast | ✅ | ✅ | `showCastPicker()` |
| AirPlay | ✅ | N/A | Native iOS control |

## Content Loading

| Method | iOS | Android |
|--------|:---:|:---:|
| JSON URL (prop) | ✅ | ✅ |
| `loadClip()` | ✅ | ✅ |
| `loadWithClipId()` | ✅ | ✅ |
| `loadWithClipListId()` | ✅ | ✅ |
| `loadWithProjectId()` | ✅ | ✅ |
| `loadWithClipJson()` | ✅ | ✅ |
| `loadWithJsonUrl()` | ✅ | ✅ |

## Events

| Category | iOS | Android |
|----------|:---:|:---:|
| Playback (play, pause, ended, etc.) | ✅ | ✅ |
| State Changes | ✅ | ✅ |
| Phase Changes (PRE, MAIN, POST) | ✅ | ✅ |
| Volume Changes | ✅ | ✅ |
| Fullscreen Events | ✅ | ✅ |
| Ad Events | ✅ | ✅ |
| Media Load Events | ✅ | ✅ |
| Error Events | ✅ | ✅ |
| Custom Statistics | ✅ | ✅ |

## Subtitles & Captions

| Feature | iOS | Android |
|---------|:---:|:---:|
| WebVTT | ✅ | ✅ |
| SRT | ✅ | ✅ |
| Embedded (HLS) | ✅ | ✅ |
| CEA-608/708 | ✅ | ✅ |

## Not Yet Supported

| Feature | Status |
|---------|--------|
| Offline Download | Not available |
| 360° Video | Not available |
| VR Playback | Not available |
| Expo Managed Workflow | Use bare workflow |
