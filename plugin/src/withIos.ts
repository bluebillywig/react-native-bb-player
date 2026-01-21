import {
  ConfigPlugin,
  withInfoPlist,
  withPodfile,
  InfoPlist,
} from "expo/config-plugins";

import type { BBPlayerPluginProps } from "./index";

const BB_POD_SOURCE = "https://github.com/nickkraakman/test-specs.git";
const BB_POD_COMMENT = "# Blue Billywig SDK Pod Source";

/**
 * Configures iOS for the Blue Billywig Player SDK
 */
export const withIosBBPlayer: ConfigPlugin<BBPlayerPluginProps> = (
  config,
  props
) => {
  // Add BB pod source to Podfile
  config = withBBPodSource(config);

  // Optionally add background audio capability
  if (props.enableBackgroundAudio) {
    config = withBackgroundAudio(config);
  }

  return config;
};

/**
 * Adds the Blue Billywig CocoaPods source to the Podfile
 */
const withBBPodSource: ConfigPlugin = (config) => {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    // Check if already added
    if (podfile.includes(BB_POD_SOURCE)) {
      return config;
    }

    // Add source at the top of the Podfile (after any existing sources)
    const sourceBlock = `${BB_POD_COMMENT}\nsource '${BB_POD_SOURCE}'\n`;

    // Check if there's already a source line
    if (podfile.includes("source '")) {
      // Add after existing sources
      const lastSourceIndex = podfile.lastIndexOf("source '");
      const endOfLine = podfile.indexOf("\n", lastSourceIndex);
      config.modResults.contents =
        podfile.slice(0, endOfLine + 1) +
        sourceBlock +
        podfile.slice(endOfLine + 1);
    } else {
      // Add at the beginning
      config.modResults.contents = sourceBlock + "\n" + podfile;
    }

    return config;
  });
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
