const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Point to the parent directory where expo-bb-player source is located
const parentDir = path.resolve(__dirname, '..');

// Add the parent directory to watchFolders so Metro can watch for changes
config.watchFolders = [parentDir];

// Configure resolver to handle symlinks and node_modules resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(parentDir, 'node_modules'),
];

module.exports = config;
