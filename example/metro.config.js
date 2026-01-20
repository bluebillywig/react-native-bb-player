const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '..');

const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  // Watch the SDK source folder for development
  watchFolders: [sdkRoot],

  resolver: {
    // Block SDK's nested node_modules to prevent duplicate dependencies
    blockList: [
      new RegExp(`${sdkRoot.replace(/[/\\]/g, '[/\\\\]')}/node_modules/.*`),
      // Also block any nested node_modules in the SDK copy within example's node_modules
      /node_modules\/@bluebillywig\/react-native-bb-player\/node_modules\/.*/,
    ],

    // Resolve all modules from example's node_modules only
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
    ],

    // Ensure SDK dependencies resolve to example's node_modules
    extraNodeModules: {
      'react': path.resolve(projectRoot, 'node_modules/react'),
      'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
