# Deep Linking Guide

This guide explains how to implement deep linking in your React Native app to open specific video content via URLs.

## Overview

Deep linking allows users to:
- Open your app from a URL (e.g., from a website, email, or push notification)
- Navigate directly to specific video content
- Share video links that open in your app

**Supported URL types:**
- **Universal Links (iOS)** / **App Links (Android)**: `https://yourdomain.com/watch/123`
- **Custom URL Schemes**: `yourapp://watch/123`

## Platform Configuration

### Android Setup

Add an intent filter to your `AndroidManifest.xml`:

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask"
  ...>

  <!-- Standard launcher intent -->
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>

  <!-- Deep link handler -->
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
      android:scheme="https"
      android:host="www.yourdomain.com"
      android:pathPrefix="/watch/" />
  </intent-filter>
</activity>
```

**Key points:**
- `android:launchMode="singleTask"` ensures the same activity instance handles multiple deep links
- `android:autoVerify="true"` enables App Links verification (for https URLs)
- You can add multiple `<data>` elements for different URL patterns

### iOS Setup

#### 1. URL Schemes (Custom URL)

Add to your `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Viewer</string>
    <key>CFBundleURLName</key>
    <string>com.yourcompany.yourapp</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yourapp</string>
    </array>
  </dict>
</array>
```

#### 2. Universal Links (https URLs)

Create an entitlements file (`YourApp.entitlements`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.developer.associated-domains</key>
  <array>
    <string>applinks:www.yourdomain.com</string>
  </array>
</dict>
</plist>
```

#### 3. AppDelegate Configuration

Update your `AppDelegate.swift`:

```swift
import React

// ... existing code ...

// Handle URL scheme deep links
func application(
  _ app: UIApplication,
  open url: URL,
  options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}

// Handle universal links
func application(
  _ application: UIApplication,
  continue userActivity: NSUserActivity,
  restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
) -> Bool {
  return RCTLinkingManager.application(
    application,
    continue: userActivity,
    restorationHandler: restorationHandler
  )
}
```

#### 4. Server Configuration (Universal Links only)

For Universal Links to work, host an `apple-app-site-association` file at:
`https://www.yourdomain.com/.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.yourcompany.yourapp",
        "paths": ["/watch/*"]
      }
    ]
  }
}
```

## React Native Implementation

### Basic Deep Link Handler

```tsx
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

/**
 * Parse a deep link URL and extract the clip ID
 */
function parseDeepLink(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Match /watch/<clipId> pattern
    const pathMatch = parsed.pathname.match(/^\/watch\/(\d+)$/);
    if (pathMatch) {
      return pathMatch[1];
    }
  } catch {
    // Invalid URL
  }
  return null;
}

function App() {
  const [clipId, setClipId] = useState<string | null>(null);

  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const id = parseDeepLink(initialUrl);
        if (id) setClipId(id);
      }
    };

    // Handle URL while app is running
    const handleUrlChange = (event: { url: string }) => {
      const id = parseDeepLink(event.url);
      if (id) setClipId(id);
    };

    handleInitialUrl();
    const subscription = Linking.addEventListener('url', handleUrlChange);

    return () => subscription.remove();
  }, []);

  if (clipId) {
    return (
      <DeepLinkPlayer
        clipId={clipId}
        onClose={() => setClipId(null)}
      />
    );
  }

  return <HomeScreen />;
}
```

### Deep Link Player Component

```tsx
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

interface DeepLinkPlayerProps {
  clipId: string;
  onClose: () => void;
}

function DeepLinkPlayer({ clipId, onClose }: DeepLinkPlayerProps) {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  // Construct the JSON URL for your publication
  const jsonUrl = `https://yourpublication.bbvms.com/p/default/c/${clipId}.json`;

  // Cleanup when navigating away
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <View style={styles.container}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl={jsonUrl}
        style={styles.player}
        options={{ autoPlay: true }}
        onDidFailWithError={(error) => {
          console.error('Failed to load clip:', error);
          // Optionally show error UI or navigate back
        }}
        onDidTriggerMediaClipLoaded={(clip) => {
          console.log('Loaded:', clip.title);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  player: { flex: 1 },
});
```

## URL Patterns

### Supported Patterns

| URL Pattern | Description |
|------------|-------------|
| `https://yourdomain.com/watch/<clipId>` | Universal Link / App Link |
| `yourapp://watch/<clipId>` | Custom URL scheme |

### Mapping URLs to Content

Customize the `parseDeepLink` function for your needs:

```tsx
function parseDeepLink(url: string): DeepLinkContent | null {
  try {
    const parsed = new URL(url);

    // Clip: /watch/<clipId>
    const clipMatch = parsed.pathname.match(/^\/watch\/(\d+)$/);
    if (clipMatch) {
      return { type: 'clip', id: clipMatch[1] };
    }

    // Playlist: /playlist/<playlistId>
    const playlistMatch = parsed.pathname.match(/^\/playlist\/(\d+)$/);
    if (playlistMatch) {
      return { type: 'playlist', id: playlistMatch[1] };
    }

    // Shorts: /shorts/<shortsId>
    const shortsMatch = parsed.pathname.match(/^\/shorts\/(\d+)$/);
    if (shortsMatch) {
      return { type: 'shorts', id: shortsMatch[1] };
    }
  } catch {
    // Invalid URL
  }
  return null;
}
```

## Testing Deep Links

### Android

```bash
# Test with adb (emulator or device)
adb shell am start -a android.intent.action.VIEW \
  -d "https://www.yourdomain.com/watch/4256593" \
  com.yourpackage

# Or with custom scheme
adb shell am start -a android.intent.action.VIEW \
  -d "yourapp://watch/4256593"
```

### iOS

```bash
# Test in Simulator
xcrun simctl openurl booted "yourapp://watch/4256593"

# Test Universal Links (requires proper server setup)
xcrun simctl openurl booted "https://www.yourdomain.com/watch/4256593"
```

### Debug Tips

1. **Log incoming URLs:**
   ```tsx
   Linking.addEventListener('url', (event) => {
     console.log('Deep link received:', event.url);
   });
   ```

2. **Check initial URL on launch:**
   ```tsx
   const initialUrl = await Linking.getInitialURL();
   console.log('Initial URL:', initialUrl);
   ```

3. **Verify Android intent filters:**
   ```bash
   adb shell dumpsys package d | grep -A5 "yourdomain.com"
   ```

## Universal Links / App Links Verification

### Android App Links

1. Host `assetlinks.json` at `https://yourdomain.com/.well-known/assetlinks.json`:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.yourpackage",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
     }
   }]
   ```

2. Get your fingerprint:
   ```bash
   keytool -list -v -keystore your.keystore | grep SHA256
   ```

### iOS Universal Links

1. Host `apple-app-site-association` at `https://yourdomain.com/.well-known/apple-app-site-association`
2. Ensure the file is served with `Content-Type: application/json`
3. Use HTTPS with a valid certificate

## Complete Example

See the example app's implementation:
- [App.tsx](../../example/App.tsx) - Deep link handling in the main app
- [DeepLinkPlayerScreen.tsx](../../example/src/screens/DeepLinkPlayerScreen.tsx) - Player screen for deep links

## Best Practices

1. **Always validate clip IDs** before loading to prevent errors
2. **Handle loading errors** gracefully with user feedback
3. **Clean up the player** when navigating away from deep link content
4. **Test on real devices** - simulators may not fully support Universal Links
5. **Log deep link events** for analytics and debugging
6. **Provide fallback behavior** if the deep link content is unavailable

## Related Resources

- [React Native Linking API](https://reactnative.dev/docs/linking)
- [Android App Links](https://developer.android.com/training/app-links)
- [iOS Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app)
