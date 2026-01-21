import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";

import { withAndroidBBPlayer } from "./withAndroid";
import { withIosBBPlayer } from "./withIos";

// Import package.json for version info
const pkg = require("../../package.json");

export interface BBPlayerPluginProps {
  /**
   * iOS: Enables background audio playback capability.
   * Adds UIBackgroundModes with 'audio' to Info.plist.
   * @default false
   */
  enableBackgroundAudio?: boolean;

  /**
   * Android: Custom Maven repository URL for BB SDK.
   * Only needed if using a private/custom repository.
   * @default 'https://maven.bluebillywig.com/releases'
   */
  androidMavenUrl?: string;
}

/**
 * Config plugin for @bluebillywig/react-native-bb-player
 *
 * This plugin configures the native projects for the Blue Billywig Player SDK:
 *
 * **iOS:**
 * - Adds BB SDK CocoaPods repository
 * - Optionally enables background audio capability
 *
 * **Android:**
 * - Adds BB SDK Maven repository to build.gradle
 *
 * @example
 * // app.json / app.config.js
 * {
 *   "expo": {
 *     "plugins": [
 *       ["@bluebillywig/react-native-bb-player", {
 *         "enableBackgroundAudio": true
 *       }]
 *     ]
 *   }
 * }
 */
const withBBPlayer: ConfigPlugin<BBPlayerPluginProps | void> = (
  config,
  props = {}
) => {
  const pluginProps: BBPlayerPluginProps = props || {};

  // Apply Android configuration
  config = withAndroidBBPlayer(config, pluginProps);

  // Apply iOS configuration
  config = withIosBBPlayer(config, pluginProps);

  return config;
};

export default createRunOncePlugin(withBBPlayer, pkg.name, pkg.version);

// Export individual platform plugins for advanced use cases
export { withAndroidBBPlayer } from "./withAndroid";
export { withIosBBPlayer } from "./withIos";
