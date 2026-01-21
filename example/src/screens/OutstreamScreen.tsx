import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBOutstreamView,
  type BBOutstreamViewMethods,
  type OutstreamAnimationType,
} from '@bluebillywig/react-native-bb-player';

// Outstream ad URL - uses /a/ instead of /p/
const OUTSTREAM_URL = 'https://demo.bbvms.com/a/native_sdk_outstream.json';

// Animation options for testing
const ANIMATION_OPTIONS: { label: string; type: OutstreamAnimationType }[] = [
  { label: 'Timing', type: 'timing' },
  { label: 'Spring', type: 'spring' },
  { label: 'Layout', type: 'layout' },
  { label: 'None', type: 'none' },
];

interface OutstreamScreenProps {
  onBack?: () => void;
}

export function OutstreamScreen({ onBack }: OutstreamScreenProps) {
  const outstreamRef = useRef<BBOutstreamViewMethods>(null);
  const [animationType, setAnimationType] = useState<OutstreamAnimationType>('timing');
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      outstreamRef.current?.destroy();
    };
  }, []);

  const addEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEventLog((prev) => [`[${timestamp}] ${event}`, ...prev.slice(0, 19)]);
  }, []);

  const handleCollapsed = useCallback(() => {
    setIsCollapsed(true);
    addEvent('Collapsed');
  }, [addEvent]);

  const handleExpanded = useCallback(() => {
    setIsCollapsed(false);
    addEvent('Expanded');
  }, [addEvent]);

  // Lorem ipsum paragraphs for article simulation
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Outstream Demo</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Animation Type Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>Animation:</Text>
        {ANIMATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.selectorButton,
              animationType === option.type && styles.selectorButtonActive,
            ]}
            onPress={() => setAnimationType(option.type)}
          >
            <Text
              style={[
                styles.selectorButtonText,
                animationType === option.type && styles.selectorButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Manual Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isCollapsed && styles.controlButtonDisabled]}
          onPress={() => outstreamRef.current?.animateCollapse()}
          disabled={isCollapsed}
        >
          <Text style={styles.controlButtonText}>Collapse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, !isCollapsed && styles.controlButtonDisabled]}
          onPress={() => outstreamRef.current?.animateExpand()}
          disabled={!isCollapsed}
        >
          <Text style={styles.controlButtonText}>Expand</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => outstreamRef.current?.play()}
        >
          <Text style={styles.controlButtonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => outstreamRef.current?.pause()}
        >
          <Text style={styles.controlButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Article Content */}
      <ScrollView style={styles.articleContainer}>
        <Text style={styles.articleTitle}>Sample Article</Text>
        <Text style={styles.articleText}>{loremIpsum}</Text>

        {/* Outstream Ad Placement */}
        <View style={styles.adWrapper}>
          <Text style={styles.adLabel}>ADVERTISEMENT</Text>
          <BBOutstreamView
            ref={outstreamRef}
            jsonUrl={OUTSTREAM_URL}
            expandedHeight={250}
            animation={{
              type: animationType,
              duration: 300,
              damping: 15,
              stiffness: 100,
            }}
            options={{
              autoPlay: false,
              autoMute: true,
            }}
            style={styles.outstreamPlayer}
            onCollapsed={handleCollapsed}
            onExpanded={handleExpanded}
            onAnimationStart={(collapsing) =>
              addEvent(`Animation start: ${collapsing ? 'collapsing' : 'expanding'}`)
            }
            onDidSetupWithJsonUrl={(url) => addEvent(`Setup: ${url}`)}
            onDidTriggerAdLoadStart={() => addEvent('Ad loading...')}
            onDidTriggerAdLoaded={() => addEvent('Ad loaded')}
            onDidTriggerAdStarted={() => addEvent('Ad started')}
            onDidTriggerAdFinished={() => addEvent('Ad finished')}
            onDidTriggerAdError={(error) => addEvent(`Ad error: ${error}`)}
            onDidTriggerAdNotFound={() => addEvent('No ad available')}
            onDidTriggerAdQuartile1={() => addEvent('Quartile 1 (25%)')}
            onDidTriggerAdQuartile2={() => addEvent('Quartile 2 (50%)')}
            onDidTriggerAdQuartile3={() => addEvent('Quartile 3 (75%)')}
            onDidTriggerAllAdsCompleted={() => addEvent('All ads completed')}
            onDidFailWithError={(error) => addEvent(`Error: ${error}`)}
          />
        </View>

        <Text style={styles.articleText}>{loremIpsum}</Text>
        <Text style={styles.articleText}>{loremIpsum}</Text>
      </ScrollView>

      {/* Event Log */}
      <View style={styles.eventLogContainer}>
        <Text style={styles.eventLogTitle}>Event Log</Text>
        <ScrollView style={styles.eventLog}>
          {eventLog.map((event, index) => (
            <Text key={index} style={styles.eventLogItem}>
              {event}
            </Text>
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
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    color: '#333',
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectorLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  selectorButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 6,
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
  },
  selectorButtonText: {
    fontSize: 12,
    color: '#666',
  },
  selectorButtonTextActive: {
    color: '#fff',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  controlButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  controlButtonDisabled: {
    backgroundColor: '#ccc',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  articleContainer: {
    flex: 1,
    padding: 16,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
  },
  adWrapper: {
    marginVertical: 16,
  },
  adLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
  },
  outstreamPlayer: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  eventLogContainer: {
    height: 100,
    backgroundColor: '#1e1e1e',
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

export default OutstreamScreen;
