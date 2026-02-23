import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
} from '@bluebillywig/react-native-bb-player';

// Simple player - no event handlers, no logging, just video playback
const VIDEO_URL = 'https://demo.bbvms.com/p/native_sdk/c/4256593.json';

export function SimplePlayerScreen() {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#000" />
      <View style={styles.playerContainer}>
        <BBPlayerView
          ref={playerRef}
          jsonUrl={VIDEO_URL}
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
