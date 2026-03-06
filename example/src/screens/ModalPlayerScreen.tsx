import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BBModalPlayer } from '@bluebillywig/react-native-bb-player';

// Demo clips from same publication as native SDK demo
const DEMO_CLIPS = [
  { id: '4256593', label: 'Clip 4256593' },
  { id: '4256575', label: 'Clip 4256575' },
];

const BASE_URL = 'https://demo.bbvms.com/p/native_sdk/c';

interface ModalPlayerScreenProps {
  onBack?: () => void;
}

export function ModalPlayerScreen({ onBack }: ModalPlayerScreenProps) {
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addEvent = (event: string) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setEventLog(prev => [`[${timestamp}] ${event}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    addEvent(`BBModalPlayer available: ${BBModalPlayer.isAvailable}`);

    const sub1 = BBModalPlayer.addEventListener('onModalPlayerPresented', () => {
      addEvent('Modal presented');
    });
    const sub2 = BBModalPlayer.addEventListener('onModalPlayerDismissed', () => {
      addEvent('Modal dismissed');
    });

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  const handlePresent = (clipId: string) => {
    const url = `${BASE_URL}/${clipId}.json`;
    addEvent(`Presenting modal: ${url}`);
    const success = BBModalPlayer.present(url, { autoPlay: true });
    if (!success) {
      addEvent('Failed to present - native module not available');
    }
  };

  const handleDismiss = () => {
    addEvent('Dismissing modal...');
    BBModalPlayer.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Modal Player</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          BBModalPlayer presents a native full-screen modal player overlay.
          On iOS it uses overFullScreen presentation with swipe-to-close.
          On Android it uses in-place fullscreen.
        </Text>

        <Text style={styles.sectionTitle}>Present Modal</Text>
        <View style={styles.buttonsRow}>
          {DEMO_CLIPS.map((clip) => (
            <TouchableOpacity
              key={clip.id}
              style={styles.actionButton}
              onPress={() => handlePresent(clip.id)}
            >
              <Text style={styles.actionButtonText}>{clip.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Controls</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
            <Text style={styles.actionButtonText}>Dismiss Modal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.statusText}>
          Module available: {BBModalPlayer.isAvailable ? 'Yes' : 'No'}
        </Text>
      </ScrollView>

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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dismissButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  eventLogContainer: {
    height: 120,
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

export default ModalPlayerScreen;
