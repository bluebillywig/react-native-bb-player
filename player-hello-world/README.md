# Player Hello World Demo

A simple React Native "Hello World" app demonstrating the Blue Billywig Native Player (`expo-bb-player`) with a demo video.

## Overview

This is a minimal Expo app that shows how easy it is to integrate the Blue Billywig Native Player into your React Native application. The app loads and plays a demo video from the Blue Billywig platform.

## Features

- ✅ Simple, clean UI
- ✅ Auto-play demo video
- ✅ Native player controls
- ✅ Event logging (play, pause, end)
- ✅ Error handling
- ✅ TypeScript support

## Demo Video

The app loads the following demo video:
```
https://demo.bbvms.com/p/default/c/1092091.json
```

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- For iOS: macOS with Xcode installed
- For Android: Android Studio with Android SDK installed

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Generate native projects:**

```bash
npx expo prebuild
```

This will create the `ios/` and `android/` directories with all native code.

## Running the App

### iOS

```bash
npm run ios
```

Or open the project in Xcode:

```bash
npx expo run:ios
```

### Android

```bash
npm run android
```

Or open the project in Android Studio:

```bash
npx expo run:android
```

### Development Server

To start the Expo development server:

```bash
npm start
```

Then press `i` for iOS or `a` for Android.

## Code Structure

```
player-hello-world/
├── App.tsx           # Main application component
├── package.json      # Dependencies and scripts
├── app.json          # Expo configuration
├── tsconfig.json     # TypeScript configuration
└── babel.config.js   # Babel configuration
```

## Key Code

The main player integration in `App.tsx`:

```tsx
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export default function App() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  return (
    <ExpoBBPlayerView
      ref={playerRef}
      jsonUrl="https://demo.bbvms.com/p/default/c/1092091.json"
      options={{
        autoPlay: true,
        allowCollapseExpand: true,
      }}
      onDidTriggerPlay={() => console.log('Video started')}
      onDidTriggerPause={() => console.log('Video paused')}
      onDidTriggerEnded={() => console.log('Video ended')}
      onDidFailWithError={(error) => console.error('Error:', error)}
      style={{ flex: 1 }}
    />
  );
}
```

## Customization

### Change the Video

To load a different video, simply change the `jsonUrl` prop:

```tsx
<ExpoBBPlayerView
  jsonUrl="https://your-domain.bbvms.com/p/publication/c/clipId.json"
  ...
/>
```

### Player Options

You can customize player behavior with the `options` prop:

```tsx
options={{
  autoPlay: false,        // Don't auto-play
  autoMute: true,         // Start muted
  allowCollapseExpand: false,  // Disable collapse/expand
}}
```

### Event Handlers

Listen to various player events:

```tsx
<ExpoBBPlayerView
  onDidTriggerPlay={() => console.log('Playing')}
  onDidTriggerPause={() => console.log('Paused')}
  onDidTriggerEnded={() => console.log('Ended')}
  onDidTriggerDurationChange={(duration) => console.log('Duration:', duration)}
  onDidTriggerVolumeChange={(volume) => console.log('Volume:', volume)}
  onDidFailWithError={(error) => console.error('Error:', error)}
/>
```

## Player Controls

You can control the player programmatically using the ref:

```tsx
const playerRef = useRef<ExpoBBPlayerViewType>(null);

// Play/Pause
await playerRef.current?.play();
await playerRef.current?.pause();

// Seek to position (in seconds)
await playerRef.current?.seek(30);

// Volume control (0.0 - 1.0)
await playerRef.current?.setVolume(0.5);
await playerRef.current?.setMuted(true);

// Fullscreen (Android only)
await playerRef.current?.enterFullscreen();
await playerRef.current?.exitFullscreen();

// Get player state
const state = await playerRef.current?.playerState();
const duration = await playerRef.current?.duration();
const volume = await playerRef.current?.volume();
```

## Troubleshooting

### iOS: Build Errors

If you encounter build errors on iOS:

```bash
cd ios
pod install
cd ..
npm run ios
```

### Android: SDK Not Found

Make sure `ANDROID_HOME` is set in your environment:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=/usr/local/android-sdk     # Linux
```

### Player Not Loading

1. Check that the video URL is accessible
2. Check console logs for error messages
3. Verify internet connection
4. Try a different demo video URL

## Learn More

- [expo-bb-player Documentation](https://github.com/bluebillywig/expo-bb-player)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## License

ISC
