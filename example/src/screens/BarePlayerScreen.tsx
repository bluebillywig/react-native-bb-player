import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, requireNativeComponent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Use the native view directly without the wrapper's JS layer
const RawBBPlayerView = requireNativeComponent('BBPlayerView');

interface BarePlayerScreenProps {
  onBack?: () => void;
}

// Bare minimum player - native view only, no wrapper overhead
export function BarePlayerScreen({ onBack }: BarePlayerScreenProps) {
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
