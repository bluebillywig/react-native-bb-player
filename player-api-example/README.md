# Blue Billywig Player API Example

This is a comprehensive demo app showcasing the expo-bb-player API capabilities.

## Features Demonstrated

### 1. Custom vs Native Controls
- Toggle between native player controls and custom React Native controls
- Custom controls overlay with play/pause, seek, and progress bar
- Real-time state and phase display

### 2. Playback Control Methods
- `play()` / `pause()` - Playback control
- `seek(position)` - Seek to specific position
- Dynamic video loading with `loadWithClipId()`

### 3. Volume Control
- `setVolume(volume)` - Set volume level (0.0 - 1.0)
- `setMuted(muted)` - Mute/unmute audio
- Real-time volume state tracking

### 4. Player State & Events
- **Time Updates**: Real-time current time and duration display
- **State Changes**: Track IDLE, LOADING, READY, PLAYING, PAUSED, ENDED, ERROR states
- **Phase Changes**: Monitor PRE, MAIN, POST, EXIT phases
- **Playback Events**: play, pause, ended, seeking, seeked, playing
- **Media Loading Events**: mediaClipLoaded, projectLoaded
- **Setup Events**: setupWithJsonUrl, apiReady
- **Error Handling**: Error event tracking

### 5. Event Log
- Real-time event log showing last 20 events
- Timestamps and event data for debugging
- Tracks all player lifecycle events

## Running the App

### Prerequisites
- Node.js installed
- Java 17+ (for Android)
- Android SDK or Xcode (for iOS)
- An Android emulator or iOS simulator (or physical device)

### Installation

```bash
# Install dependencies
npm install

# For Android, prebuild native modules
npx expo prebuild

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

### Development

```bash
# Start Metro bundler
npx expo start
```

## Code Structure

### App.tsx
The main application file demonstrates:
- Player setup with both native and custom controls
- Event handlers for all key player events
- Custom controls implementation with React Native components
- State management for player state, volume, time, etc.
- Event logging system

### Key Components

**Player Setup**:
```typescript
<ExpoBBPlayerView
  ref={playerRef}
  jsonUrl="https://demo.bbvms.com/p/default/c/6323522.json"
  options={{
    autoPlay: false,
    controls: !useCustomControls,
  }}
  onDidTriggerTimeUpdate={(currentTime, duration) => { /* ... */ }}
  onDidTriggerStateChange={(state) => { /* ... */ }}
  // ... more event handlers
/>
```

**Custom Controls Example**:
```typescript
{useCustomControls && (
  <View style={styles.customControlsOverlay}>
    {/* Time display */}
    {/* Progress bar */}
    {/* Control buttons */}
  </View>
)}
```

**Method Calls**:
```typescript
// Play/Pause
await playerRef.current?.play();
await playerRef.current?.pause();

// Seek
await playerRef.current?.seek(position);

// Load new video
await playerRef.current?.loadWithClipId(clipId, 'manual', true, 0);

// Volume control
await playerRef.current?.setVolume(0.5);
await playerRef.current?.setMuted(true);
```

## What You'll Learn

1. **How to use native controls vs custom controls**
   - Native controls: Set `controls: true` in options
   - Custom controls: Set `controls: false` and build your own UI

2. **How to handle player events**
   - Time updates for progress tracking
   - State changes for UI updates
   - Media loading events for content tracking

3. **How to control playback programmatically**
   - Play/pause control
   - Seeking to specific positions
   - Loading different videos dynamically

4. **How to manage volume and audio**
   - Setting volume levels
   - Muting/unmuting
   - Tracking volume changes

5. **How to implement a custom UI**
   - Building custom controls with React Native
   - Creating progress bars
   - Handling user interactions

## API Reference

For complete API documentation, see:
- [Complete API Reference](../API.md)
- [TypeScript Types](../src/ExpoBBPlayer.types.ts)

## Demo Videos

The app uses three demo videos from Blue Billywig's demo server:
- Video 1: 6323522
- Video 2: 6323523
- Video 3: 6323524

You can switch between them using the "Load Different Videos" buttons.

## Troubleshooting

### Android Build Issues
- Ensure Java 17+ is installed
- Check that `JAVA_HOME` is set correctly
- Verify Android SDK is installed

### Metro Bundler Issues
- Clear cache: `npx expo start --clear`
- Delete `node_modules` and reinstall

### Player Not Loading
- Check network connectivity
- Verify video URLs are accessible
- Check console for error events

## License

ISC
