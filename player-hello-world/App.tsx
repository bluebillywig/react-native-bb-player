import React, { useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from 'expo-bb-player';

export default function App() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Hello World - Blue Billywig Player</Text>
        <Text style={styles.subtitle}>Demo Video</Text>
      </View>

      <View style={styles.playerContainer}>
        <ExpoBBPlayerView
          ref={playerRef}
          jsonUrl="https://demo.bbvms.com/p/default/c/6323522.json"
          options={{
            autoPlay: true,
            allowCollapseExpand: true,
          }}
          onDidTriggerMediaClipLoaded={(clip) => {
            console.log('Media clip loaded:', clip);
          }}
          onDidTriggerPhaseChange={(phase) => {
            console.log('Phase changed:', phase);
          }}
          onDidTriggerStateChange={(state) => {
            console.log('State changed:', state);
          }}
          onDidFailWithError={(error) => {
            console.error('Player error:', error);
          }}
          onDidSetupWithJsonUrl={(url) => {
            console.log('Setup with JSON URL:', url);
            // Manually trigger play since autoPlay is disabled in playout config
            playerRef.current?.play();
          }}
          style={styles.player}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Blue Billywig Native Player
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  player: {
    flex: 1,
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
