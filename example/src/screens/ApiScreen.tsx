import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBPlayerView,
  type BBPlayerViewMethods,
} from '@bluebillywig/react-native-bb-player';

// Initial player URL - exactly same as native SDK demo app
const INITIAL_JSON_URL = 'https://demo.bbvms.com/p/native_sdk/c/4256593.json';

// API Actions grouped by category - matches native SDK demo app
const API_ACTIONS = {
  Playback: ['Play', 'Pause', 'Seek +10s', 'Seek -10s'],
  Audio: ['Mute', 'Unmute', 'Volume 50%', 'Volume 100%'],
  Fullscreen: ['Enter Fullscreen', 'Enter FS Landscape', 'Exit Fullscreen'],
  Getters: ['Get Duration', 'Get Time', 'Get Muted', 'Get Volume', 'Get Phase', 'Get State', 'Get Mode', 'Get Clip Data'],
  // Load actions use hardcoded IDs from same publication (demo.bbvms.com) - same as native demo
  // Note: Shorts require the separate BBShortsView component - see ShortsScreen
  Load: ['Load Clip 4256575', 'Load Clip 4256593', 'Load ClipList'],
  Other: ['Destroy', 'Show Cast Picker'],
};

interface ApiScreenProps {
  onBack?: () => void;
}

export function ApiScreen({ onBack }: ApiScreenProps) {
  const playerRef = useRef<BBPlayerViewMethods>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<string>('');

  // Cleanup player when screen unmounts to stop playback
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  const addEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog(prev => [`[${timestamp}] ${event}`, ...prev.slice(0, 49)]);
  }, []);

  const showResult = useCallback((title: string, value: unknown) => {
    const message = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? 'null');
    setLastResult(`${title}: ${message}`);
    addEvent(`${title}: ${message}`);
  }, [addEvent]);

  const handleAction = useCallback(async (action: string) => {
    if (!playerRef.current) {
      Alert.alert('Error', 'Player not ready');
      return;
    }

    addEvent(`Action: ${action}`);

    switch (action) {
      // Playback
      case 'Play':
        playerRef.current.play();
        break;
      case 'Pause':
        playerRef.current.pause();
        break;
      case 'Seek +10s':
        playerRef.current.seekRelative(10);
        break;
      case 'Seek -10s':
        playerRef.current.seekRelative(-10);
        break;

      // Audio
      case 'Mute':
        playerRef.current.setMuted(true);
        break;
      case 'Unmute':
        playerRef.current.setMuted(false);
        break;
      case 'Volume 50%':
        playerRef.current.setVolume(0.5);
        break;
      case 'Volume 100%':
        playerRef.current.setVolume(1.0);
        break;

      // Fullscreen
      case 'Enter Fullscreen':
        playerRef.current.enterFullscreen();
        break;
      case 'Enter FS Landscape':
        playerRef.current.enterFullscreenLandscape();
        break;
      case 'Exit Fullscreen':
        playerRef.current.exitFullscreen();
        break;

      // Getters
      case 'Get Duration':
        const duration = await playerRef.current.getDuration();
        showResult('Duration', duration);
        break;
      case 'Get Time':
        const time = await playerRef.current.getCurrentTime();
        showResult('Current Time', time);
        break;
      case 'Get Muted':
        const muted = await playerRef.current.getMuted();
        showResult('Muted', muted);
        break;
      case 'Get Volume':
        const volume = await playerRef.current.getVolume();
        showResult('Volume', volume);
        break;
      case 'Get Phase':
        const phase = await playerRef.current.getPhase();
        showResult('Phase', phase);
        break;
      case 'Get State':
        const state = await playerRef.current.getState();
        showResult('State', state);
        break;
      case 'Get Mode':
        const mode = await playerRef.current.getMode();
        showResult('Mode', mode);
        break;
      case 'Get Clip Data':
        const clipData = await playerRef.current.getClipData();
        showResult('Clip Data', clipData);
        break;

      // Load - using hardcoded IDs from same publication (demo.bbvms.com), same as native demo
      case 'Load Clip 4256575':
        playerRef.current.loadWithClipId('4256575', 'external', true, 0);
        break;
      case 'Load Clip 4256593':
        playerRef.current.loadWithClipId('4256593', 'external', true, 0);
        break;
      case 'Load ClipList':
        // Same clip list ID as native SDK demo app
        playerRef.current.loadWithClipListId('1619442239940600', 'external', true, 0);
        break;
      // Note: Shorts require BBShortsView - see ShortsScreen for example

      // Other
      case 'Destroy':
        playerRef.current.destroy();
        break;
      case 'Show Cast Picker':
        playerRef.current.showCastPicker();
        break;
    }
  }, [addEvent, showResult]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with back button */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>BB Player API Reference</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Player */}
      <View style={styles.playerContainer}>
        <BBPlayerView
          ref={playerRef}
          jsonUrl={INITIAL_JSON_URL}
          style={styles.player}
          onDidTriggerApiReady={() => addEvent('API Ready')}
          onDidTriggerPlay={() => addEvent('Play')}
          onDidTriggerPause={() => addEvent('Pause')}
          onDidTriggerPlaying={() => addEvent('Playing')}
          onDidTriggerEnded={() => addEvent('Ended')}
          onDidTriggerStateChange={(state) => addEvent(`State: ${state}`)}
          onDidTriggerPhaseChange={(phase) => addEvent(`Phase: ${phase}`)}
          onDidTriggerFullscreen={() => addEvent('Fullscreen')}
          onDidTriggerRetractFullscreen={() => addEvent('Exit Fullscreen')}
          onDidTriggerDurationChange={(duration) => addEvent(`Duration: ${duration}s`)}
          onDidTriggerSeeked={(pos) => addEvent(`Seeked to: ${pos}s`)}
          onDidTriggerSeeking={() => addEvent('Seeking...')}
          onDidTriggerVolumeChange={(vol) => addEvent(`Volume: ${vol}`)}
          onDidTriggerMediaClipLoaded={(clip) => addEvent(`Clip Loaded: ${clip.title}`)}
          onDidTriggerMediaClipFailed={() => addEvent('Clip Failed')}
          onDidTriggerCanPlay={() => addEvent('Can Play')}
          onDidTriggerStall={() => addEvent('Stall')}
          onDidTriggerAdStarted={() => addEvent('Ad Started')}
          onDidTriggerAdFinished={() => addEvent('Ad Finished')}
          onDidTriggerAdError={(err) => addEvent(`Ad Error: ${err}`)}
          onDidFailWithError={(err) => addEvent(`Error: ${err}`)}
        />
      </View>

      {/* Last Result Display */}
      {lastResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText} numberOfLines={2}>{lastResult}</Text>
        </View>
      ) : null}

      {/* API Actions */}
      <ScrollView style={styles.actionsContainer}>
        {Object.entries(API_ACTIONS).map(([category, actions]) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.actionsRow}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={styles.actionButton}
                  onPress={() => handleAction(action)}
                >
                  <Text style={styles.actionButtonText}>{action}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Event Log */}
      <View style={styles.eventLogContainer}>
        <Text style={styles.eventLogTitle}>Event Log</Text>
        <ScrollView style={styles.eventLog}>
          {eventLog.map((event, index) => (
            <Text key={index} style={styles.eventLogItem}>{event}</Text>
          ))}
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
  },
  resultContainer: {
    backgroundColor: '#e8f4fd',
    padding: 8,
    marginHorizontal: 8,
    marginTop: 4,
    borderRadius: 6,
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  actionsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  eventLogContainer: {
    height: 100,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 6,
    padding: 8,
  },
  eventLogTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
    marginBottom: 4,
  },
  eventLog: {
    flex: 1,
  },
  eventLogItem: {
    fontSize: 10,
    color: '#0f0',
    fontFamily: 'monospace',
  },
});

export default ApiScreen;
