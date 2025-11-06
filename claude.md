# Expo BB Player - Build Configuration

## Build Environment

### Java Version
- **Required**: Java 17
- **Path**: `/Library/Java/JavaVirtualMachines/jdk-17.0.2.jdk/Contents/Home`
- **Set via**: `export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.0.2.jdk/Contents/Home`

### Android SDK
- **Location**: `/Users/guido/Library/Android/sdk`
- **Set via**: `export ANDROID_HOME=/Users/guido/Library/Android/sdk`
- **Configured in**: `android/local.properties` with `sdk.dir=/Users/guido/Library/Android/sdk`

## Expo SDK Version

### Current Version
- **Expo SDK**: 54.0.0 (latest stable)
- **React**: 19.1.0
- **React Native**: 0.81.5
- **TypeScript**: ~5.3.0+
- **@types/react**: ~19.1.10

### Build Configuration (SDK 54)
- **buildTools**: 36.0.0
- **minSdk**: 24
- **compileSdk**: 36
- **targetSdk**: 36
- **ndk**: 27.1.12297006
- **kotlin**: 2.1.20
- **ksp**: 2.1.20-2.0.1
- **Gradle**: 8.14.3

## Projects

### player-hello-world (Demo App)
**Location**: `player-hello-world/`

**Package Configuration**:
```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-build-properties": "~1.0.9",
    "expo-modules-core": "~3.0.24",
    "expo-status-bar": "~3.0.8",
    "react": "19.1.0",
    "react-native": "0.81.5"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~19.1.10",
    "typescript": "^5.3.0"
  },
  "expo": {
    "autolinking": {
      "nativeModulesDir": ".."
    }
  }
}
```

**App Configuration** (`app.json`):
- **Name**: Player Hello World
- **Slug**: player-hello-world
- **iOS Bundle ID**: com.bluebillywig.playerplayerplayerplayerplayerplayerplayerplayerplayerplayerhelloworld
- **Android Package**: com.bluebillywig.playerplayerplayerplayerplayerplayerplayerplayerplayerplayerhelloworld
- **Min SDK Version**: 24 (required for Hermes/React Native 0.81)
- **iOS Deployment Target**: 15.1

### example (Full Example App)
**Location**: `example/`

**Package Configuration**:
```json
{
  "dependencies": {
    "@react-navigation/native": "^7.1.9",
    "@react-navigation/native-stack": "^7.3.13",
    "expo": "~54.0.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.10.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@biomejs/biome": "1.9.4",
    "@types/react": "~19.1.10",
    "typescript": "~5.8.3"
  },
  "expo": {
    "autolinking": {
      "nativeModulesDir": ".."
    }
  }
}
```

## expo-bb-player Module

### Configuration
**File**: `expo-module.config.json`
```json
{
  "platforms": ["android", "ios"],
  "android": {
    "modules": ["expo.modules.bbplayer.BBPlayerModule"]
  },
  "ios": {
    "modules": ["ExpoBBPlayerModule"]
  }
}
```

### Android Native Dependencies
**Location**: `android/build.gradle`
```gradle
dependencies {
  implementation 'com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:8.37.0'
}
```

**Maven Repository**:
```gradle
repositories {
  mavenCentral()
  maven {
    url "https://maven.bluebillywig.com/releases"
  }
}
```

## Building Android APK

### Prerequisites
1. Install Java 17
2. Install Android SDK
3. Set environment variables

### Build Commands

```bash
# Navigate to demo app
cd player-hello-world

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Generate native Android project
rm -rf android
npx expo prebuild --platform android

# Create local.properties file
echo "sdk.dir=/Users/guido/Library/Android/sdk" > android/local.properties

# Build APK
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.0.2.jdk/Contents/Home
export ANDROID_HOME=/Users/guido/Library/Android/sdk
cd android
./gradlew assembleDebug
```

### Output Location
**Debug APK**: `player-hello-world/android/app/build/outputs/apk/debug/app-debug.apk`

### Build Time
- **Initial build**: ~5-7 minutes (includes downloading dependencies)
- **Subsequent builds**: ~2-3 minutes

## Important Notes

### Expo Autolinking
Both demo apps use Expo's autolinking feature to automatically link the local `expo-bb-player` module:
```json
"expo": {
  "autolinking": {
    "nativeModulesDir": ".."
  }
}
```

This tells Expo to look in the parent directory for native modules, which allows the apps to use the local development version of `expo-bb-player` instead of pulling from npm or GitHub.

### minSdkVersion Requirement
- **Must be 24 or higher** for Expo SDK 54 with React Native 0.81
- Previous versions used minSdkVersion 21, but this is incompatible with the Hermes engine in RN 0.81

### Common Build Issues

1. **Java Version Error**: Ensure Java 17 is installed and JAVA_HOME is set
2. **Android SDK Not Found**: Create `local.properties` file with correct SDK path
3. **minSdkVersion Mismatch**: Update `app.json` to use minSdkVersion 24
4. **Module Not Found**: Ensure `expo.autolinking.nativeModulesDir` is set to `".."`

## Development Workflow

### After Code Changes
If you modify the expo-bb-player native code:

1. **For Android**:
   ```bash
   cd player-hello-world
   rm -rf android
   npx expo prebuild --platform android
   echo "sdk.dir=/Users/guido/Library/Android/sdk" > android/local.properties
   cd android && ./gradlew assembleDebug
   ```

2. **For iOS**:
   ```bash
   cd player-hello-world
   rm -rf ios
   npx expo prebuild --platform ios
   cd ios && xcodebuild -workspace *.xcworkspace -scheme YourScheme
   ```

### Testing on Device/Emulator
```bash
cd player-hello-world
npx expo run:android  # Requires device/emulator connected
npx expo run:ios      # Requires Mac with Xcode
```

## Upgrading Expo SDK

To upgrade to a newer Expo SDK version:

```bash
# In player-hello-world or example directory
npx expo install expo@latest --fix
npm install
rm -rf android ios
npx expo prebuild
```

Make sure to update the dependencies in package.json to match the new SDK requirements.

---

**Last Updated**: November 6, 2025
**Expo SDK**: 54.0.0
**React Native**: 0.81.5
