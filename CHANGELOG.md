# Changelog

All notable changes to react-native-bb-player will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.0.0]: https://github.com/bluebillywig/react-native-bb-player/releases/tag/v2.0.0
[1.0.0]: https://github.com/bluebillywig/react-native-bb-player/releases/tag/v1.0.0
