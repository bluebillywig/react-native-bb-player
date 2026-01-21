# Expo Setup Guide

This guide explains how to use the Blue Billywig React Native Player SDK with Expo.

## Overview

The BB Player SDK includes an **optional** Expo config plugin that automates native configuration when using Expo's prebuild workflow. This plugin is entirely optional - the SDK works with both Expo and bare React Native projects.

## Requirements

- Expo SDK 51 or later
- Expo development build (not Expo Go)
- React Native 0.73+

> **Note**: This SDK uses native code and requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/). It will not work with Expo Go.

## Installation

### 1. Install the Package

```bash
npx expo install @bluebillywig/react-native-bb-player
```

### 2. Add the Config Plugin

Add the plugin to your `app.json` or `app.config.js`:

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

Generate the native projects with the plugin applied:

```bash
npx expo prebuild
```

Then build and run:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Plugin Options

The config plugin accepts optional configuration:

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

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableBackgroundAudio` | boolean | `false` | iOS: Adds `audio` to UIBackgroundModes for background playback |
| `androidMavenUrl` | string | `https://maven.bluebillywig.com/releases` | Custom Maven repository URL (advanced) |

## What the Plugin Does

### iOS
- Adds the Blue Billywig CocoaPods source repository to your Podfile
- Optionally adds background audio capability to Info.plist

### Android
- Adds the Blue Billywig Maven repository to your project's build.gradle

## Background Audio (iOS)

To enable background audio playback on iOS:

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

This adds `UIBackgroundModes` with `audio` to your Info.plist, allowing audio to continue when the app is backgrounded.

## Manual Setup (Without Plugin)

If you prefer not to use the config plugin, or need more control, see the installation section in the [README](../../README.md#bare-react-native).

## Example with app.config.js

For dynamic configuration, use `app.config.js`:

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

## Usage

Once configured, use the player component as normal:

```tsx
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

export function VideoPlayer() {
  return (
    <BBPlayerView
      jsonUrl="https://your-publication.bbvms.com/p/default/c/12345.json"
      style={{ width: '100%', aspectRatio: 16/9 }}
      onDidTriggerPlay={() => console.log('Playing!')}
    />
  );
}
```

## EAS Build

The SDK is fully compatible with [EAS Build](https://docs.expo.dev/build/introduction/). No additional configuration is required - the config plugin will run automatically during the build process.

## Troubleshooting

### "Cannot use BB Player with Expo Go"

The BB Player SDK requires native code and cannot run in Expo Go. You must use a development build:

```bash
npx expo run:ios
# or
npx expo run:android
```

### Plugin Not Applied

If changes aren't reflected after modifying plugin options:

```bash
# Clean and regenerate native projects
npx expo prebuild --clean
```

### Maven Repository Not Found (Android)

Ensure the plugin is properly configured and run `npx expo prebuild` again. You can verify the Maven repository was added by checking `android/build.gradle`.

### CocoaPods Source Not Added (iOS)

Check that the plugin is listed in your `app.json` plugins array, then run:

```bash
npx expo prebuild --clean
cd ios && pod install
```

## Related Guides

- [README - Quick Start](../../README.md#quick-start)
- [Advertising Guide](./advertising.md)
- [Feature Matrix](../resources/FEATURE_MATRIX.md)
