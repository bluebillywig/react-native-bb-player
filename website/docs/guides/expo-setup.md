---
sidebar_position: 1
title: Expo Setup
description: Set up BB Player SDK with Expo development builds and EAS.
---

# Expo Setup

The BB Player SDK includes an **optional** Expo config plugin that automates native configuration. The plugin works with Expo SDK 51+ and EAS Build.

:::warning
This SDK uses native code and **cannot run in Expo Go**. You must use a [development build](https://docs.expo.dev/develop/development-builds/introduction/).
:::

## Installation

### 1. Install the Package

```bash
npx expo install @bluebillywig/react-native-bb-player
```

### 2. Add the Config Plugin

In your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@bluebillywig/react-native-bb-player"
    ]
  }
}
```

### 3. Rebuild Native Projects

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

## Plugin Options

```json
{
  "expo": {
    "plugins": [
      ["@bluebillywig/react-native-bb-player", {
        "enableBackgroundAudio": true
      }]
    ]
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableBackgroundAudio` | `boolean` | `false` | iOS: Adds `audio` to `UIBackgroundModes` for background playback |
| `androidMavenUrl` | `string` | BB Maven URL | Custom Maven repository URL (advanced) |

## What the Plugin Does

| Platform | Action |
|----------|--------|
| **iOS** | Adds BB CocoaPods source to Podfile; optionally adds background audio capability |
| **Android** | Adds BB Maven repository to `build.gradle` |

## Dynamic Configuration

Use `app.config.js` for environment-based config:

```javascript
export default {
  expo: {
    name: "My Video App",
    slug: "my-video-app",
    plugins: [
      ["@bluebillywig/react-native-bb-player", {
        enableBackgroundAudio: process.env.ENABLE_BACKGROUND_AUDIO === 'true',
      }]
    ]
  }
};
```

## EAS Build

Fully compatible with [EAS Build](https://docs.expo.dev/build/introduction/) — no extra config needed. The plugin runs automatically during build.

## New Architecture (Fabric)

Works out of the box with `newArchEnabled: true`. The SDK auto-detects TurboModules when available.

## Node.js 22+ / Expo SDK 54+

Fully compatible. The package's `exports` field properly exposes config plugin entry points for strict module resolution. Use version 8.42.5+ if you hit issues with older versions.

## Troubleshooting

### "Cannot use BB Player with Expo Go"

Use a development build instead:

```bash
npx expo run:ios
# or
npx expo run:android
```

### Plugin Not Applied

Clean and regenerate:

```bash
npx expo prebuild --clean
```

### Maven Repository Not Found (Android)

Verify the plugin is in your `app.json` and run `npx expo prebuild` again. Check `android/build.gradle` for the Maven URL.

### CocoaPods Source Not Added (iOS)

```bash
npx expo prebuild --clean
cd ios && pod install
```
