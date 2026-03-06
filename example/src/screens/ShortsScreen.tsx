import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBShortsView,
  type BBShortsViewMethods,
} from '@bluebillywig/react-native-bb-player';

const DEFAULT_PUBLICATIONS = [
  { name: 'bb.dev', label: 'BB Dev' },
  { name: 'testsuite.acc', label: 'Testsuite ACC' },
  { name: 'demo', label: 'Demo' },
  { name: 'cosdemo', label: 'COS Demo' },
];

// Remember chosen publication across navigations (module-level state)
let rememberedPublication: string = DEFAULT_PUBLICATIONS[0]!.name;

type ShortsItem = {
  id: string;
  name: string;
  status: string;
  publication: string;
};

interface ShortsScreenProps {
  onBack?: () => void;
}

export function ShortsScreen({ onBack }: ShortsScreenProps) {
  const shortsRef = useRef<BBShortsViewMethods>(null);
  const [customPub, setCustomPub] = useState(rememberedPublication);
  const [activePub, setActivePub] = useState(rememberedPublication);
  const [shortsList, setShortsList] = useState<ShortsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeShorts, setActiveShorts] = useState<{ pub: string; id: string } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [displayFormat, setDisplayFormat] = useState<'full' | 'list'>('full');

  const selectPublication = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCustomPub(trimmed);
    setActivePub(trimmed);
    rememberedPublication = trimmed;
    Keyboard.dismiss();
  }, []);

  const fetchShorts = useCallback(async (pub: string) => {
    setLoading(true);
    setShortsList([]);
    try {
      const res = await fetch(
        `https://${pub}.bbvms.com/papi/search?q=*:*&className[]=Shorts&sort=createddate desc`
      );
      const data = await res.json();
      const items: ShortsItem[] = (data.items || []).map((item: any) => ({
        id: item.id,
        name: item.name || `Shorts ${item.id}`,
        status: item.status || 'unknown',
        publication: pub,
      }));
      setShortsList(items);
    } catch (err) {
      setShortsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShorts(activePub);
  }, [activePub, fetchShorts]);

  // Cleanup shorts when screen unmounts
  useEffect(() => {
    return () => {
      shortsRef.current?.destroy();
    };
  }, []);

  const handleSelectShorts = useCallback((pub: string, id: string) => {
    setActiveShorts({ pub, id });
    setIsReady(false);
    setErrorMessage(null);
  }, []);

  const handleBack = useCallback(() => {
    if (activeShorts) {
      shortsRef.current?.destroy();
      setActiveShorts(null);
      setIsReady(false);
      setErrorMessage(null);
    } else {
      onBack?.();
    }
  }, [activeShorts, onBack]);

  const handleSetupWithJsonUrl = useCallback((url: string) => {
    setIsReady(true);
    setErrorMessage(null);
  }, []);

  const handleError = useCallback((error: string) => {
    setErrorMessage(error);
  }, []);

  // Shorts player view
  if (activeShorts) {
    const jsonUrl = `https://${activeShorts.pub}.bbvms.com/sh/${activeShorts.id}.json`;
    const isShelf = displayFormat === 'list';
    const shortsOptions = isShelf
      ? { displayFormat: 'list' as const, shelfStartSpacing: 16, shelfEndSpacing: 16 }
      : undefined;

    return (
      <View style={isShelf ? styles.shelfContainer : styles.container}>
        <StatusBar
          barStyle={isShelf ? 'dark-content' : 'light-content'}
          backgroundColor={isShelf ? '#f5f5f5' : '#000000'}
        />

        <SafeAreaView style={isShelf ? styles.shelfHeader : styles.playerHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={isShelf ? styles.listBackText : styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={isShelf ? styles.shelfHeaderTitle : styles.headerTitle} numberOfLines={1}>
            {activeShorts.pub} / Shorts {activeShorts.id}
          </Text>
          <View style={styles.headerSpacer} />
        </SafeAreaView>

        <View style={isShelf ? styles.shelfPlayerContainer : styles.playerContainer}>
          <BBShortsView
            ref={shortsRef}
            jsonUrl={jsonUrl}
            options={shortsOptions}
            style={isShelf ? styles.shelfPlayer : styles.player}
            onDidSetupWithJsonUrl={handleSetupWithJsonUrl}
            onDidFailWithError={handleError}
          />
        </View>

        <SafeAreaView style={isShelf ? styles.shelfStatusOverlay : styles.statusOverlay} pointerEvents="none">
          <View style={styles.statusContainer}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
              <Text style={isShelf ? styles.shelfStatusText : styles.statusText}>
                {isReady
                  ? isShelf ? 'Shelf mode · Scroll horizontally' : 'Swipe to navigate'
                  : 'Loading Shorts...'}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Shorts list view
  return (
    <SafeAreaView style={styles.listContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.listHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.listBackText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.listTitle}>Shorts</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Publication input */}
      <View style={styles.pubSelector}>
        <View style={styles.pubInputRow}>
          <TextInput
            style={styles.pubInput}
            value={customPub}
            onChangeText={setCustomPub}
            onSubmitEditing={() => selectPublication(customPub)}
            placeholder="Enter publication name..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
          />
          <TouchableOpacity
            style={styles.pubGoButton}
            onPress={() => selectPublication(customPub)}
          >
            <Text style={styles.pubGoButtonText}>Go</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DEFAULT_PUBLICATIONS}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.pubSelectorContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.pubButton,
                activePub === item.name && styles.pubButtonActive,
              ]}
              onPress={() => selectPublication(item.name)}
            >
              <Text
                style={[
                  styles.pubButtonText,
                  activePub === item.name && styles.pubButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Display mode toggle */}
      <View style={styles.modeToggleRow}>
        <TouchableOpacity
          style={[styles.modeButton, displayFormat === 'full' && styles.modeButtonActive]}
          onPress={() => setDisplayFormat('full')}
        >
          <Text style={[styles.modeButtonText, displayFormat === 'full' && styles.modeButtonTextActive]}>
            Full
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, displayFormat === 'list' && styles.modeButtonActive]}
          onPress={() => setDisplayFormat('list')}
        >
          <Text style={[styles.modeButtonText, displayFormat === 'list' && styles.modeButtonTextActive]}>
            Shelf
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shorts list */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : shortsList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No Shorts found</Text>
        </View>
      ) : (
        <FlatList
          data={shortsList}
          keyExtractor={(item) => `${item.publication}-${item.id}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.shortsItem}
              onPress={() => handleSelectShorts(item.publication, item.id)}
            >
              <View style={styles.shortsItemIcon}>
                <Text style={styles.shortsItemIconText}>SH</Text>
              </View>
              <View style={styles.shortsItemContent}>
                <Text style={styles.shortsItemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.shortsItemMeta}>
                  ID: {item.id} · {item.status}
                </Text>
              </View>
              <Text style={styles.shortsItemArrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Player styles
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerHeader: {
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
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
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

  // Shelf mode styles
  shelfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  shelfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  shelfHeaderTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  shelfPlayerContainer: {
    height: 400,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  shelfPlayer: {
    flex: 1,
  },
  shelfStatusOverlay: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  shelfStatusText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },

  // Mode toggle
  modeToggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
  },

  // List styles
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  listBackText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pubSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  pubInputRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
  },
  pubInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  pubGoButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pubGoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pubSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  pubButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  pubButtonActive: {
    backgroundColor: '#007AFF',
  },
  pubButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  pubButtonTextActive: {
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    padding: 12,
  },
  shortsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  shortsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shortsItemIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  shortsItemContent: {
    flex: 1,
  },
  shortsItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  shortsItemMeta: {
    fontSize: 12,
    color: '#999',
  },
  shortsItemArrow: {
    fontSize: 22,
    color: '#ccc',
    fontWeight: '300',
    marginLeft: 8,
  },
});

export default ShortsScreen;
