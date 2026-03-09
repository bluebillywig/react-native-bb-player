---
sidebar_position: 9
title: New Architecture
description: Fabric and TurboModules support.
---

# New Architecture (Fabric & TurboModules)

The SDK fully supports React Native's New Architecture:

- **Fabric** — new rendering system
- **TurboModules** — synchronous access and lazy loading

## Automatic Detection

The SDK detects your app's architecture automatically:

- **New Architecture** → Uses `TurboModuleRegistry` for optimal performance
- **Old Architecture** → Falls back to `NativeModules`

**No code changes required.** Your existing code works with both:

```tsx
// Works on both Old and New Architecture
import { BBPlayerView } from '@bluebillywig/react-native-bb-player';

<BBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidTriggerPlay={() => console.log('Playing')}
/>
```

## Enabling New Architecture

### React Native 0.76+

Enabled by default — nothing to do.

### React Native 0.73–0.75

**Android** (`android/gradle.properties`):

```properties
newArchEnabled=true
```

**iOS** (`ios/Podfile`):

```ruby
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

Then rebuild:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Expo

Works with `newArchEnabled: true` in `app.json` — no extra steps.
