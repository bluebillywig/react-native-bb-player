import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
} from '@bluebillywig/react-native-bb-player';

interface BarePlayerScreenProps {
  onBack?: () => void;
}

// Bare minimum player - BBPlayerView with no event handlers, for baseline comparison
export function BarePlayerScreen({ onBack }: BarePlayerScreenProps) {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {onBack && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.playerContainer}>
        <BBPlayerView
          ref={playerRef}
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
  header: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
