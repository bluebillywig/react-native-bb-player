import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBShortsView,
  type BBShortsViewMethods,
} from '@bluebillywig/react-native-bb-player';

// Default Shorts URL - same publication as native SDK demo
// This loads a Shorts experience with vertical video swipe navigation
const DEFAULT_SHORTS_URL = 'https://demo.bbvms.com/sh/58.json';

// Alternative Shorts configurations for testing
// Note: Only Shorts with valid appConfig will work - many demo Shorts have null appConfig
const SHORTS_OPTIONS = [
  { label: 'Shorts 58', url: 'https://demo.bbvms.com/sh/58.json' },
  { label: 'Shorts 43', url: 'https://demo.bbvms.com/sh/43.json' },
  { label: 'Shorts 10', url: 'https://demo.bbvms.com/sh/10.json' },
];

interface ShortsScreenProps {
  onBack?: () => void;
}

export function ShortsScreen({ onBack }: ShortsScreenProps) {
  const shortsRef = useRef<BBShortsViewMethods>(null);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_SHORTS_URL);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cleanup shorts when screen unmounts to stop playback
  useEffect(() => {
    return () => {
      shortsRef.current?.destroy();
    };
  }, []);

  const handleSetupWithJsonUrl = useCallback((url: string) => {
    console.log('Shorts: Setup complete with URL -', url);
    setIsReady(true);
    setErrorMessage(null);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Shorts: Error -', error);
    setErrorMessage(error);
  }, []);

  const handleShortsSelect = useCallback((url: string) => {
    setCurrentUrl(url);
    setIsReady(false);
    setErrorMessage(null);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header with back button */}
      <SafeAreaView style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Shorts Demo</Text>
        <View style={styles.headerSpacer} />
      </SafeAreaView>

      {/* Shorts selector */}
      <View style={styles.selectorContainer}>
        {SHORTS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.url}
            style={[
              styles.selectorButton,
              currentUrl === option.url && styles.selectorButtonActive,
            ]}
            onPress={() => handleShortsSelect(option.url)}
          >
            <Text
              style={[
                styles.selectorButtonText,
                currentUrl === option.url && styles.selectorButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Full-screen Shorts player */}
      <View style={styles.playerContainer}>
        <BBShortsView
          ref={shortsRef}
          jsonUrl={currentUrl}
          style={styles.player}
          onDidSetupWithJsonUrl={handleSetupWithJsonUrl}
          onDidFailWithError={handleError}
          onDidTriggerResize={(width, height) => {
            console.log('Shorts: Resize -', width, 'x', height);
          }}
        />
      </View>

      {/* Status overlay */}
      <SafeAreaView style={styles.statusOverlay} pointerEvents="none">
        <View style={styles.statusContainer}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Text style={styles.statusText}>
              {isReady ? 'Shorts Ready - Swipe to navigate' : 'Loading Shorts...'}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

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
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 60,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectorButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  selectorButtonTextActive: {
    color: '#fff',
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statusContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ShortsScreen;
