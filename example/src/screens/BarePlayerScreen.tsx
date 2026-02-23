import React from 'react';
import { StyleSheet, View, StatusBar, requireNativeComponent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Use the native view directly without the wrapper's JS layer
const RawBBPlayerView = requireNativeComponent('BBPlayerView');

// Bare minimum player - native view only, no wrapper overhead
export function BarePlayerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      <View style={styles.playerContainer}>
        <RawBBPlayerView
          jsonUrl="https://demo.bbvms.com/p/native_sdk/c/4256593.json"
          options={{ noChromeCast: true }}
          style={styles.player}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
