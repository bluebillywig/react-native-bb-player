---
sidebar_position: 7
title: Deep Linking
description: Open video content via URLs and deep links.
---

# Deep Linking

Deep linking lets users open your app from a URL (website, email, push notification) and navigate directly to specific video content.

## Platform Setup

### Android

Add an intent filter to `AndroidManifest.xml`:

```xml
<activity android:name=".MainActivity" android:launchMode="singleTask">
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

### iOS

#### URL Schemes

In `Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key><string>Viewer</string>
    <key>CFBundleURLName</key><string>com.yourcompany.yourapp</string>
    <key>CFBundleURLSchemes</key>
    <array><string>yourapp</string></array>
  </dict>
</array>
```

#### Universal Links

Create an entitlements file:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:www.yourdomain.com</string>
</array>
```

Add to `AppDelegate.swift`:

```swift
func application(_ app: UIApplication, open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
  return RCTLinkingManager.application(app, open: url, options: options)
}

func application(_ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
  return RCTLinkingManager.application(application,
    continue: userActivity, restorationHandler: restorationHandler)
}
```

## React Native Implementation

### URL Parser

```tsx
function parseDeepLink(url: string) {
  try {
    const parsed = new URL(url);
    const clipMatch = parsed.pathname.match(/^\/watch\/(\d+)$/);
    if (clipMatch) return { type: 'clip' as const, id: clipMatch[1] };

    const shortsMatch = parsed.pathname.match(/^\/shorts\/(\d+)$/);
    if (shortsMatch) return { type: 'shorts' as const, id: shortsMatch[1] };
  } catch {}
  return null;
}
```

### Deep Link Handler

```tsx
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

function App() {
  const [clipId, setClipId] = useState<string | null>(null);

  useEffect(() => {
    // Handle initial URL (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        const result = parseDeepLink(url);
        if (result?.type === 'clip') setClipId(result.id);
      }
    });

    // Handle URL while app is running
    const sub = Linking.addEventListener('url', ({ url }) => {
      const result = parseDeepLink(url);
      if (result?.type === 'clip') setClipId(result.id);
    });

    return () => sub.remove();
  }, []);

  if (clipId) {
    return <DeepLinkPlayer clipId={clipId} onClose={() => setClipId(null)} />;
  }
  return <HomeScreen />;
}
```

### Player Component

```tsx
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { BBPlayerView, type BBPlayerViewMethods } from '@bluebillywig/react-native-bb-player';

function DeepLinkPlayer({ clipId, onClose }: { clipId: string; onClose: () => void }) {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  useEffect(() => {
    return () => { playerRef.current?.destroy(); };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <BBPlayerView
        ref={playerRef}
        jsonUrl={`https://yourpub.bbvms.com/p/default/c/${clipId}.json`}
        options={{ autoPlay: true }}
        style={{ flex: 1 }}
        onDidFailWithError={(error) => console.error('Failed:', error)}
      />
    </View>
  );
}
```

## Testing

```bash
# Android
adb shell am start -a android.intent.action.VIEW \
  -d "https://www.yourdomain.com/watch/4256593" com.yourpackage

# iOS Simulator
xcrun simctl openurl booted "yourapp://watch/4256593"
```

## Server-Side Verification

### Android App Links

Host at `https://yourdomain.com/.well-known/assetlinks.json`:

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

### iOS Universal Links

Host at `https://yourdomain.com/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.yourcompany.yourapp",
      "paths": ["/watch/*"]
    }]
  }
}
```
