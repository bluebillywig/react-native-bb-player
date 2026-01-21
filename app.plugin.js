/**
 * Expo config plugin entry point for @bluebillywig/react-native-bb-player
 *
 * This file is the entry point that Expo CLI looks for when resolving plugins.
 * It points to the compiled plugin code in plugin/build.
 *
 * @see https://docs.expo.dev/config-plugins/development-for-libraries/
 */
module.exports = require("./plugin/build").default;
