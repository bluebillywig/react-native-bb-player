# Changelog

All notable changes to react-native-bb-player will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [8.42.10] - 2026-01-28

### Added
- **TurboModule support** for React Native New Architecture (Fabric)
  - Added `NativeBBPlayerModule` TurboModule spec for React Native codegen
  - Native module now uses `TurboModuleRegistry` when available, with automatic fallback to legacy `NativeModules`
  - Added architecture-specific source sets (`newarch`/`paper`) for Android
  - iOS module converted to Objective-C++ (`.mm`) for C++ interop required by TurboModules

### Changed
- `BBPlayerPackage.kt` now implements `TurboReactPackage` for New Architecture compatibility
- `BBPlayerModule.kt` extends generated `NativeBBPlayerModuleSpec` for type-safe TurboModule implementation
- Updated `react-native-bb-player.podspec` with New Architecture compiler flags and configuration
- Added `codegenConfig` to `package.json` for React Native codegen integration

### Technical Details
- Supports both Old Architecture (Paper) and New Architecture (Fabric/TurboModules)
- Tested with React Native 0.82.1
- No breaking changes - existing apps continue to work without modification
- New Architecture is automatically detected and used when enabled in the app

## [2.0.0] - 2026-01-20

### Changed
- **Breaking**: Converted from Expo Module to pure React Native native module
- Architecture now uses ViewManager + NativeModule pattern (no Expo dependencies)
- Supports both Old Architecture (Paper) and New Architecture (Fabric)
- Minimum React Native version is now 0.73.0

### Updated
- iOS Native SDK to 8.40.0
- Android Native SDK to 8.42.+
- Example app converted to bare React Native (no Expo)

### Added
- `BBPlayerModule` native module for command dispatch on both platforms
- Chromecast support via `showCastPicker()` method
- Full TypeScript type definitions
- **Optional Expo config plugin** for Expo SDK 51+ (development builds only)
  - Automatically configures BB Maven repository (Android)
  - Automatically configures BB CocoaPods source (iOS)
  - Optional `enableBackgroundAudio` for iOS background playback

## [1.0.0] - 2025-11-12

### Added
- Initial release of react-native-bb-player
- iOS support via BlueBillywigNativePlayerKit-iOS 8.37.0
- Android support via bbnativeplayersdk 8.37.0
- Full API implementation for playback control
- Event system for player state changes
- Fullscreen support with orientation control
- TypeScript type definitions
- Demo application (player-api-example)

### Fixed
- iOS orientation control: lock main screen to portrait, allow fullscreen rotation
- Android fullscreen landscape: proper orientation locking and state restoration
- Performance optimizations: reduced bridge traffic and memory leak fixes

[8.42.10]: https://github.com/bluebillywig/react-native-bb-player/releases/tag/v8.42.10
[2.0.0]: https://github.com/bluebillywig/react-native-bb-player/releases/tag/v2.0.0
[1.0.0]: https://github.com/bluebillywig/react-native-bb-player/releases/tag/v1.0.0
