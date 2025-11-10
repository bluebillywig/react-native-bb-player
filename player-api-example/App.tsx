import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ExpoBBPlayerView, convertPlayoutUrlToMediaclipUrl } from 'expo-bb-player';
import type { ExpoBBPlayerViewType, Phase, State } from 'expo-bb-player';
import { BlueBillywigLogo } from './BlueBillywigLogo';

// Demo video URLs
const DEMO_VIDEOS = [
  { id: '6323522', label: 'Demo Video 1', url: 'https://demo.bbvms.com/p/default/c/6323522.json' },
  { id: '6323523', label: 'Demo Video 2', url: 'https://demo.bbvms.com/p/default/c/6323523.json' },
  { id: '6323524', label: 'Demo Video 3', url: 'https://demo.bbvms.com/p/default/c/6323524.json' },
];

interface EventLogEntry {
  id: string;
  timestamp: string;
  name: string;
  data?: string;
}

export default function App() {
  const playerRef = useRef<ExpoBBPlayerViewType>(null);

  // Use refs for high-frequency updates to avoid re-renders
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);

  // Only use state for values that need to trigger UI updates
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [state, setState] = useState<State | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [useCustomControls, setUseCustomControls] = useState(false);
  const [enableEventLogging, setEnableEventLogging] = useState(false);
  const [customJsonUrl, setCustomJsonUrl] = useState('');

  // Memoize addEvent to prevent recreation on every render
  const addEvent = useCallback((name: string, data?: any) => {
    // Skip all event logging if disabled (performance optimization)
    if (!enableEventLogging) return;

    // Skip logging time updates to reduce overhead
    if (name === 'timeUpdate') return;

    const timestamp = new Date().toLocaleTimeString();
    const entry: EventLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp,
      name,
      data: data ? JSON.stringify(data) : undefined,
    };
    setEventLog(prev => [entry, ...prev].slice(0, 20)); // Keep last 20 events
  }, [enableEventLogging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    try {
      const currentState = await playerRef.current?.state();
      if (currentState === 'PLAYING') {
        await playerRef.current?.pause();
      } else {
        await playerRef.current?.play();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleSeek = async (seconds: number) => {
    try {
      await playerRef.current?.seek(seconds);
      addEvent('seek', { position: seconds });
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleSeekRelative = async (offsetSeconds: number) => {
    try {
      // Use native seekRelative method - more efficient than polling time + seeking
      await playerRef.current?.seekRelative(offsetSeconds);
      addEvent('seekRelative', { offset: offsetSeconds });
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    try {
      await playerRef.current?.setVolume(newVolume);
      setVolume(newVolume);
      addEvent('setVolume', { volume: newVolume });
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  };

  const handleToggleMute = async () => {
    try {
      const newMuted = !muted;
      await playerRef.current?.setMuted(newMuted);
      setMuted(newMuted);
      addEvent('setMuted', { muted: newMuted });
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handleLoadVideo = async (index: number) => {
    try {
      const video = DEMO_VIDEOS[index];
      // Using loadWithClipId to demonstrate dynamic loading
      await playerRef.current?.loadWithClipId(video.id, 'manual', true, 0);
      setCurrentVideoIndex(index);
      addEvent('loadWithClipId', { clipId: video.id });
    } catch (error) {
      console.error('Error loading video:', error);
    }
  };

  const handleLoadCustomUrl = async () => {
    if (!customJsonUrl.trim()) {
      return;
    }
    try {
      // Convert playout URL to mediaclip JSON URL if needed
      const convertedUrl = convertPlayoutUrlToMediaclipUrl(customJsonUrl.trim());

      // Fetch the JSON from the converted URL
      const response = await fetch(convertedUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      const jsonString = JSON.stringify(jsonData);

      // Load the content using loadWithClipJson
      await playerRef.current?.loadWithClipJson(jsonString, 'manual', true, 0);
      addEvent('loadWithClipJson', { originalUrl: customJsonUrl.trim(), convertedUrl });
    } catch (error) {
      console.error('Error loading custom URL:', error);
      addEvent('error', { message: `Failed to load custom URL: ${error}` });
    }
  };

  const handleFullscreen = async () => {
    try {
      await playerRef.current?.enterFullscreen();
      addEvent('enterFullscreen');
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const handleShowCastPicker = async () => {
    try {
      await playerRef.current?.showCastPicker();
      addEvent('showCastPicker');
    } catch (error) {
      console.error('Error showing cast picker:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <BlueBillywigLogo height={32} />
        <Text style={styles.subtitle}>Player API Demo</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Controls Mode Toggle */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Controls Mode</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, !useCustomControls && styles.buttonActive]}
              onPress={() => setUseCustomControls(false)}
            >
              <Text style={styles.buttonText}>Native Controls</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, useCustomControls && styles.buttonActive]}
              onPress={() => setUseCustomControls(true)}
            >
              <Text style={styles.buttonText}>Custom Controls</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            {useCustomControls
              ? 'Custom controls overlay is shown below the player'
              : 'Player uses native controls'}
          </Text>
        </View>

        {/* Player */}
        <View style={styles.playerContainer}>
          <ExpoBBPlayerView
            ref={playerRef}
            jsonUrl={DEMO_VIDEOS[0].url}
            options={{
              autoPlay: false,
              controls: !useCustomControls, // Disable native controls when using custom
            }}
            // Only enable time updates when custom controls need them
            enableTimeUpdates={useCustomControls}
            // Time updates - use refs to avoid re-renders on every update
            onDidTriggerTimeUpdate={(time, dur) => {
              currentTimeRef.current = time;
              durationRef.current = dur;

              // Only trigger re-render when time changes by at least 1 second
              // This reduces React re-renders while keeping UI updated
              if (Math.floor(time) !== Math.floor(currentTime)) {
                setCurrentTime(time);
                setDuration(dur);
              }
            }}
            // State changes
            onDidTriggerStateChange={(newState) => {
              setState(newState);
              addEvent('stateChange', { state: newState });
            }}
            onDidTriggerPhaseChange={(newPhase) => {
              setPhase(newPhase);
              addEvent('phaseChange', { phase: newPhase });
            }}
            // Playback events
            onDidTriggerPlay={() => addEvent('play')}
            onDidTriggerPause={() => addEvent('pause')}
            onDidTriggerEnded={() => addEvent('ended')}
            onDidTriggerPlaying={() => addEvent('playing')}
            onDidTriggerSeeking={() => addEvent('seeking')}
            onDidTriggerSeeked={(position) => addEvent('seeked', { position })}
            // Media loading
            onDidTriggerMediaClipLoaded={(clip) => addEvent('mediaClipLoaded', { id: clip.id })}
            onDidTriggerProjectLoaded={(project) => addEvent('projectLoaded', { id: project.id })}
            // Setup
            onDidSetupWithJsonUrl={(url) => {
              addEvent('setupWithJsonUrl', { url });
            }}
            onDidTriggerApiReady={() => addEvent('apiReady')}
            // Errors
            onDidFailWithError={(error) => addEvent('error', { error })}
            // Duration change
            onDidTriggerDurationChange={(newDuration) => {
              setDuration(newDuration);
              addEvent('durationChange', { duration: newDuration });
            }}
            // Volume change
            onDidTriggerVolumeChange={(newVolume) => {
              setVolume(newVolume);
              addEvent('volumeChange', { volume: newVolume });
            }}
            style={styles.player}
          />
        </View>

        {/* Custom Controls Overlay (only shown when custom controls enabled) */}
        {useCustomControls && (
          <View style={styles.customControlsOverlay}>
            <View style={styles.customControlsTop}>
              <Text style={styles.customControlsTime}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
              <View style={styles.customControlsStateInfo}>
                <Text style={styles.customControlsStateText}>{state}</Text>
                <Text style={styles.customControlsPhaseText}>{phase}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' },
                ]}
              />
            </View>

            {/* Control Buttons */}
            <View style={styles.customControlsButtons}>
              <TouchableOpacity
                style={styles.customControlButton}
                onPress={() => handleSeekRelative(-10)}
              >
                <Text style={styles.customControlButtonText}>-10s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.customControlButton, styles.customControlButtonPrimary]}
                onPress={handlePlayPause}
              >
                <Text style={styles.customControlButtonText}>
                  {state === 'PLAYING' ? '⏸ Pause' : '▶ Play'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.customControlButton}
                onPress={() => handleSeekRelative(10)}
              >
                <Text style={styles.customControlButtonText}>+10s</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Player State Display */}
        <View style={styles.timeDisplay}>
          <View style={styles.stateDisplay}>
            <Text style={styles.stateText}>State: {state || 'N/A'}</Text>
            <Text style={styles.stateText}>Phase: {phase || 'N/A'}</Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Playback Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handlePlayPause}>
              <Text style={styles.buttonText}>Play / Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSeek(0)}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSeekRelative(10)}>
              <Text style={styles.buttonText}>+10s</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Load Content */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Load Content</Text>
          <Text style={styles.helperText}>
            Enter a JSON URL to load custom content
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="https://demo.bbvms.com/p/default/c/6323522.json"
            placeholderTextColor="#999"
            value={customJsonUrl}
            onChangeText={setCustomJsonUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleLoadCustomUrl}
            disabled={!customJsonUrl.trim()}
          >
            <Text style={styles.buttonText}>Load Content</Text>
          </TouchableOpacity>
        </View>

        {/* Volume Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Volume Controls</Text>
          <View style={styles.volumeDisplay}>
            <Text style={styles.volumeText}>
              Volume: {isNaN(volume) ? 'N/A' : `${Math.round(volume * 100)}%`} {muted ? '(Muted)' : ''}
            </Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => handleVolumeChange(0)}>
              <Text style={styles.buttonText}>0%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleVolumeChange(0.5)}>
              <Text style={styles.buttonText}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleVolumeChange(1.0)}>
              <Text style={styles.buttonText}>100%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, muted && styles.buttonActive]}
              onPress={handleToggleMute}
            >
              <Text style={styles.buttonText}>Mute</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.sectionTitle}>Other Controls</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleFullscreen}>
              <Text style={styles.buttonText}>Fullscreen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleShowCastPicker}>
              <Text style={styles.buttonText}>Chromecast</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Log */}
        <View style={styles.eventLogSection}>
          <View style={styles.eventLogHeader}>
            <Text style={styles.sectionTitle}>Event Log (Last 20 Events)</Text>
            <TouchableOpacity
              style={[styles.button, styles.toggleButton, enableEventLogging && styles.buttonActive]}
              onPress={() => setEnableEventLogging(!enableEventLogging)}
            >
              <Text style={styles.buttonText}>{enableEventLogging ? 'Enabled' : 'Disabled'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            {enableEventLogging
              ? 'Event logging is active (may impact performance)'
              : 'Event logging is disabled for better performance'}
          </Text>
          <View style={styles.eventLog}>
            {!enableEventLogging ? (
              <Text style={styles.eventLogEmpty}>Event logging disabled for performance optimization</Text>
            ) : eventLog.length === 0 ? (
              <Text style={styles.eventLogEmpty}>No events yet...</Text>
            ) : (
              eventLog.map((event) => (
                <View key={event.id} style={styles.eventLogEntry}>
                  <Text style={styles.eventLogTime}>{event.timestamp}</Text>
                  <Text style={styles.eventLogName}>{event.name}</Text>
                  {event.data && (
                    <Text style={styles.eventLogData}>{event.data}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#002837',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
  playerContainer: {
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
    width: '100%',
  },
  player: {
    flex: 1,
  },
  timeDisplay: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stateDisplay: {
    alignItems: 'flex-end',
  },
  stateText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  controlsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    backgroundColor: '#649BD2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#002837',
  },
  buttonPrimary: {
    backgroundColor: '#649BD2',
    width: '100%',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  volumeDisplay: {
    marginBottom: 12,
  },
  volumeText: {
    fontSize: 14,
    color: '#666',
  },
  eventLogSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  eventLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    minWidth: 90,
  },
  eventLog: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    maxHeight: 400,
  },
  eventLogEmpty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  eventLogEntry: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventLogTime: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  eventLogName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#649BD2',
    marginBottom: 2,
  },
  eventLogData: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Custom Controls Overlay Styles
  customControlsOverlay: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderTopWidth: 3,
    borderTopColor: '#649BD2',
  },
  customControlsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customControlsTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  customControlsStateInfo: {
    alignItems: 'flex-end',
  },
  customControlsStateText: {
    fontSize: 11,
    color: '#00cc66',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  customControlsPhaseText: {
    fontSize: 11,
    color: '#66b3ff',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#649BD2',
  },
  customControlsButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  customControlButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  customControlButtonPrimary: {
    backgroundColor: '#649BD2',
    minWidth: 100,
  },
  customControlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
