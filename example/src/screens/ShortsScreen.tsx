import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BBShortsView,
  type BBShortsViewMethods,
} from '@bluebillywig/react-native-bb-player';

const PUBLICATIONS = [
  { name: 'bb.dev', label: 'BB Dev' },
  { name: 'testsuite.acc', label: 'Testsuite ACC' },
  { name: 'demo', label: 'Demo' },
  { name: 'cosdemo', label: 'COS Demo' },
  { name: 'omroepbrabant', label: 'Omroep Brabant' },
];

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
  const [selectedPub, setSelectedPub] = useState(PUBLICATIONS[0]);
  const [shortsList, setShortsList] = useState<ShortsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeShorts, setActiveShorts] = useState<{ pub: string; id: string } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchShorts = useCallback(async (pub: typeof PUBLICATIONS[number]) => {
    setLoading(true);
    setShortsList([]);
    try {
      const res = await fetch(
        `https://${pub.name}.bbvms.com/papi/search?q=*:*&className[]=Shorts`
      );
      const data = await res.json();
      const items: ShortsItem[] = (data.items || []).map((item: any) => ({
        id: item.id,
        name: item.name || `Shorts ${item.id}`,
        status: item.status || 'unknown',
        publication: pub.name,
      }));
      setShortsList(items);
    } catch (err) {
      setShortsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShorts(selectedPub);
  }, [selectedPub, fetchShorts]);

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
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <SafeAreaView style={styles.playerHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {activeShorts.pub} / Shorts {activeShorts.id}
          </Text>
          <View style={styles.headerSpacer} />
        </SafeAreaView>

        <View style={styles.playerContainer}>
          <BBShortsView
            ref={shortsRef}
            jsonUrl={jsonUrl}
            style={styles.player}
            onDidSetupWithJsonUrl={handleSetupWithJsonUrl}
            onDidFailWithError={handleError}
          />
        </View>

        <SafeAreaView style={styles.statusOverlay} pointerEvents="none">
          <View style={styles.statusContainer}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
              <Text style={styles.statusText}>
                {isReady ? 'Swipe to navigate' : 'Loading Shorts...'}
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

      {/* Publication selector */}
      <View style={styles.pubSelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={PUBLICATIONS}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.pubSelectorContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.pubButton,
                selectedPub.name === item.name && styles.pubButtonActive,
              ]}
              onPress={() => setSelectedPub(item)}
            >
              <Text
                style={[
                  styles.pubButtonText,
                  selectedPub.name === item.name && styles.pubButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
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
