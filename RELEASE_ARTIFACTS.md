# Release Artifacts

Every release of react-native-bb-player includes public artifacts that can be downloaded directly from GitHub Releases.

## 📦 Available Artifacts

### 1. Android Demo APK
**File**: `player-api-example-{version}.apk`

A fully functional demo app showing all features of the video player.

**How to use**:
```bash
# Download the APK
wget https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/player-api-example-8.37.0.apk

# Install on device via adb
adb install player-api-example-8.37.0.apk
```

**Features in demo**:
- Video playback with Blue Billywig player
- Fullscreen support (regular and landscape)
- Volume and mute controls
- Seek controls
- Event monitoring
- Various media clip examples

**Use cases**:
- Test the player before integrating
- Show demos to stakeholders
- Verify bug fixes in new releases
- Compare behavior across versions

---

### 2. npm Package Tarball
**File**: `react-native-bb-player-{version}.tgz`

The complete npm package that can be installed offline or hosted privately.

**How to use**:
```bash
# Download the package
wget https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/react-native-bb-player-8.37.0.tgz

# Install from local tarball
npm install ./react-native-bb-player-8.37.0.tgz

# Or reference in package.json
{
  "dependencies": {
    "react-native-bb-player": "file:./react-native-bb-player-8.37.0.tgz"
  }
}
```

**Use cases**:
- Offline installations
- Private package registries
- Air-gapped environments
- Version pinning without npm registry dependency

---

### 3. Documentation Bundle
**File**: `react-native-bb-player-docs-{version}.tar.gz`

Complete offline documentation including README, CHANGELOG, guides, and license.

**How to use**:
```bash
# Download documentation
wget https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/react-native-bb-player-docs-8.37.0.tar.gz

# Extract documentation
tar -xzf react-native-bb-player-docs-8.37.0.tar.gz -C ./docs

# View documentation
cd docs
cat README.md
```

**Contents**:
- `README.md` - Getting started and API reference
- `CHANGELOG.md` - Version history and changes
- `FULLSCREEN.md` - Fullscreen implementation guide
- `LICENSE` - MIT License
- `DOCUMENTATION.md` - Overview and quick links

**Use cases**:
- Offline documentation access
- Internal wiki/documentation system
- Version-specific documentation archival
- Customer documentation packages

---

## 🔗 Finding Release Artifacts

### Method 1: GitHub Releases Page

1. Go to https://github.com/bluebillywig/react-native-bb-player/releases
2. Select the desired release version
3. Scroll to "Assets" section at the bottom
4. Download the artifact you need

### Method 2: Direct URL

All artifacts follow a consistent URL pattern:

```
https://github.com/bluebillywig/react-native-bb-player/releases/download/{tag}/{filename}
```

**Examples**:
```bash
# Demo APK
https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/player-api-example-8.37.0.apk

# npm package
https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/react-native-bb-player-8.37.0.tgz

# Documentation
https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/react-native-bb-player-docs-8.37.0.tar.gz
```

### Method 3: GitHub API

```bash
# Get latest release info
curl -s https://api.github.com/repos/bluebillywig/react-native-bb-player/releases/latest

# Get specific release
curl -s https://api.github.com/repos/bluebillywig/react-native-bb-player/releases/tags/v8.37.0

# Download asset
curl -L -o player-demo.apk "$(curl -s https://api.github.com/repos/bluebillywig/react-native-bb-player/releases/latest | grep 'browser_download_url.*apk' | cut -d '"' -f 4)"
```

---

## 📋 Artifact Specifications

### Android Demo APK

| Property | Value |
|----------|-------|
| Architecture | arm64-v8a, armeabi-v7a, x86, x86_64 (universal) |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 36 |
| Signed | Release keystore (self-signed) |
| Size | ~70 MB |
| Permissions | Internet, External Storage |

### npm Package

| Property | Value |
|----------|-------|
| Format | gzip compressed tarball (.tgz) |
| Size | ~40 KB |
| Contents | Source code, native modules, TypeScript definitions |
| Compression | gzip |

### Documentation Bundle

| Property | Value |
|----------|-------|
| Format | gzip compressed tarball (.tar.gz) |
| Size | ~50 KB |
| Contents | Markdown documentation, license |
| Compression | gzip |

---

## 🚀 Automation & CI/CD

### Using Artifacts in CI/CD Pipelines

**Example: Download and test demo APK**:
```yaml
# GitHub Actions
- name: Download demo APK
  run: |
    VERSION="8.37.0"
    wget https://github.com/bluebillywig/react-native-bb-player/releases/download/v${VERSION}/player-api-example-${VERSION}.apk

- name: Install on emulator
  run: |
    adb install player-api-example-8.37.0.apk
```

**Example: Use specific package version**:
```yaml
# Package installation
- name: Install from GitHub release
  run: |
    npm install https://github.com/bluebillywig/react-native-bb-player/releases/download/v8.37.0/react-native-bb-player-8.37.0.tgz
```

---

## 📱 Testing Demo APK

### Prerequisites
- Android device or emulator running Android 7.0 (API 24) or higher
- ADB tools installed (if installing via command line)

### Installation Methods

**Method 1: Download directly on Android device**
1. Open the release page on your Android device
2. Download the APK file
3. Tap the downloaded file
4. Allow installation from unknown sources if prompted
5. Install the app

**Method 2: Install via ADB**
```bash
# Ensure device is connected
adb devices

# Install APK
adb install player-api-example-8.37.0.apk

# Launch app
adb shell am start -n com.bluebillywig.playerapiexample/.MainActivity
```

**Method 3: Drag and drop to emulator**
1. Start Android emulator
2. Download the APK
3. Drag and drop APK file onto the emulator window
4. App will install automatically

---

## 🔐 Security & Verification

### APK Signing

Demo APKs are signed with a release keystore for distribution purposes. For production use, you should:
- Build your own app with your signing key
- Use the react-native-bb-player package, not the demo APK

### Package Integrity

All artifacts are:
- Built by GitHub Actions (public workflow logs)
- Checksums available via GitHub API
- Linked to specific git commits/tags

**Verify package integrity**:
```bash
# Get checksums
sha256sum player-api-example-8.37.0.apk
sha256sum react-native-bb-player-8.37.0.tgz
sha256sum react-native-bb-player-docs-8.37.0.tar.gz
```

---

## 📞 Support & Issues

### Reporting Issues

If you encounter problems with release artifacts:

1. **Check the version** - Ensure you're using the correct version
2. **Review changelog** - Check if the issue is documented
3. **Test demo APK** - Verify if the issue exists in the demo
4. **Open an issue** - https://github.com/bluebillywig/react-native-bb-player/issues

Include:
- Artifact filename and version
- Device/environment details
- Steps to reproduce
- Expected vs actual behavior

---

## 📅 Release Schedule

Releases follow Blue Billywig's 2-weekly sprint cycle:

| Day | Activity |
|-----|----------|
| Monday | Native SDKs released |
| Tuesday-Wednesday | Wrapper testing |
| Thursday | Release created with artifacts |
| Friday | Artifacts available for download |

Check the [Releases page](https://github.com/bluebillywig/react-native-bb-player/releases) for the latest version.

---

## 💡 Best Practices

### For Developers

1. **Pin specific versions** in production
   ```json
   "react-native-bb-player": "8.37.0"
   ```

2. **Test with demo APK** before upgrading
   - Download APK for new version
   - Test on your target devices
   - Verify new features/fixes

3. **Keep documentation offline** for reference
   - Download docs bundle
   - Store in your project wiki
   - Share with team members

### For Organizations

1. **Mirror artifacts** to internal storage
   - Download artifacts on release day
   - Host on internal servers
   - Ensure availability for developers

2. **Automate testing** with demo APK
   - Include in CI/CD pipelines
   - Run automated UI tests
   - Verify integration compatibility

3. **Version documentation** strategy
   - Archive docs for each version in use
   - Reference specific versions in internal docs
   - Track which apps use which versions

---

## 🎯 Summary

Every release provides three public artifacts:

✅ **Android Demo APK** - Test and demo the player
✅ **npm Package** - Offline installation and private hosting
✅ **Documentation** - Complete offline documentation

All artifacts are:
- Automatically built and tested
- Publicly accessible from GitHub Releases
- Version-tagged for consistency
- Available immediately on release
