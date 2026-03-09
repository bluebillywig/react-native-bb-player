---
sidebar_position: 10
title: Troubleshooting
description: Common issues and solutions.
---

# Troubleshooting

## Installation Issues

### "Module not found"

1. Verify the package is installed: `npm ls @bluebillywig/react-native-bb-player`
2. iOS: `cd ios && pod install`
3. Rebuild the app completely (not just a JS reload)

### iOS Build Fails

```bash
cd ios && pod deintegrate && pod install
```

Then clean build folder in Xcode (Cmd+Shift+K).

### Android Build Fails

```bash
cd android && ./gradlew clean
```

Ensure JDK 17+ is installed.

### "Cannot use BB Player with Expo Go"

This SDK requires native code. Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/):

```bash
npx expo run:ios
# or
npx expo run:android
```

## Player Issues

### Black Screen

- Verify the JSON URL is correct and accessible (try opening it in a browser)
- Check internet connectivity
- Add error handling:

```tsx
<BBPlayerView
  jsonUrl="https://demo.bbvms.com/p/default/c/4701337.json"
  onDidFailWithError={(error) => console.error('Player error:', error)}
  onDidSetupWithJsonUrl={(url) => console.log('Setup complete:', url)}
/>
```

### Player Not Responding to Methods

Ensure the player is ready before calling methods:

```tsx
const [isReady, setIsReady] = useState(false);

<BBPlayerView
  ref={playerRef}
  onDidTriggerCanPlay={() => setIsReady(true)}
/>

// Only call methods when ready
if (isReady) {
  playerRef.current?.play();
}
```

### Audio Continues After Leaving Screen

Always destroy the player on unmount:

```tsx
useEffect(() => {
  return () => { playerRef.current?.destroy(); };
}, []);
```

## Safe Area Handling

React Native's built-in `SafeAreaView` is inconsistent across platforms. Use [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context):

```bash
npm install react-native-safe-area-context
```

```tsx
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Wrap your app
<SafeAreaProvider>
  <App />
</SafeAreaProvider>

// In screens
<SafeAreaView style={{ flex: 1 }}>
  <BBPlayerView jsonUrl="..." style={{ flex: 1 }} />
</SafeAreaView>
```

For more control:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function PlayerScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <BBPlayerView jsonUrl="..." style={{ flex: 1 }} />
    </View>
  );
}
```

## Overriding Native SDK Versions

### Current Versions

- **iOS**: `~>8.40` (Blue Billywig Native Player Kit)
- **Android**: `8.42.+` (Blue Billywig Native Player SDK)

### Override iOS (Podfile)

```ruby
pod 'BlueBillywigNativePlayerKit-iOS', '8.42.0'
```

### Override Android (app/build.gradle)

```kotlin
configurations.all {
  resolutionStrategy {
    force 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.42.0'
  }
}
```
