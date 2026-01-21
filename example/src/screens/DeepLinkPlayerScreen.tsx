import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
} from '@bluebillywig/react-native-bb-player';

interface DeepLinkPlayerScreenProps {
  clipId: string;
  onBack: () => void;
}

/**
 * Player screen launched via deep link
 * Loads the clip from demo.bbvms.com using the provided clip ID
 *
 * URL patterns supported:
 * - https://www.bluebillywig.tv/watch/<clipId>
 * - bbplayer://watch/<clipId>
 */
export function DeepLinkPlayerScreen({ clipId, onBack }: DeepLinkPlayerScreenProps) {
  const playerRef = useRef<BBPlayerViewMethods>(null);

  // Construct the JSON URL for demo.bbvms.com
  // In a production app, you'd map this to your own publication
  const jsonUrl = `https://demo.bbvms.com/p/default/c/${clipId}.json`;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Deep link player error:', error);
  }, []);

  const handleSetup = useCallback((url: string) => {
    console.log('Deep link player ready:', url);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Clip {clipId}</Text>
          <Text style={styles.subtitle}>Opened via deep link</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Full-screen Player */}
      <View style={styles.playerContainer}>
        <BBPlayerView
          ref={playerRef}
          jsonUrl={jsonUrl}
          style={styles.player}
          options={{
            autoPlay: true,
          }}
          onDidSetupWithJsonUrl={handleSetup}
          onDidFailWithError={handleError}
          onDidTriggerMediaClipLoaded={(clip) => {
            console.log('Loaded clip:', clip.title);
          }}
        />
      </View>

      {/* Info Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>JSON URL:</Text>
        <Text style={styles.footerUrl} numberOfLines={1}>
          {jsonUrl}
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  headerSpacer: {
    width: 60,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  footerLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginBottom: 4,
  },
  footerUrl: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});

export default DeepLinkPlayerScreen;
