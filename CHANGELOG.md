# Changelog

All notable changes to react-native-bb-player will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/bluebillywig/react-native-bb-player/releases/tag/v1.0.0
