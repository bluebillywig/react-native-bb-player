module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath: 'import com.bluebillywig.bbplayer.BBPlayerPackage;',
        packageInstance: 'new BBPlayerPackage()',
      },
      ios: {
        podspecPath: './react-native-bb-player.podspec',
      },
    },
  },
};
