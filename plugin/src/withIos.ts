import {
  ConfigPlugin,
  withInfoPlist,
  InfoPlist,
} from "expo/config-plugins";

import type { BBPlayerPluginProps } from "./index";

/**
 * Configures iOS for the Blue Billywig Player SDK
 *
 * Note: BlueBillywigNativePlayerKit-iOS is available on CocoaPods trunk,
 * so no custom pod source is needed.
 *
 * The SDK is automatically linked via React Native's autolinking mechanism
 * through react-native.config.js. No manual pod configuration is needed.
 */
export const withIosBBPlayer: ConfigPlugin<BBPlayerPluginProps> = (
  config,
  props
) => {
  // Optionally add background audio capability
  if (props.enableBackgroundAudio) {
    config = withBackgroundAudio(config);
  }

  return config;
};

/**
 * Adds UIBackgroundModes with 'audio' to Info.plist for background audio playback
 */
const withBackgroundAudio: ConfigPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    const infoPlist = config.modResults as InfoPlist;

    // Get existing background modes or create new array
    const existingModes = (infoPlist.UIBackgroundModes as string[]) || [];

    // Add 'audio' if not already present
    if (!existingModes.includes("audio")) {
      infoPlist.UIBackgroundModes = [...existingModes, "audio"];
    }

    return config;
  });
};
