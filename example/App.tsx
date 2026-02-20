import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ApiScreen } from './src/screens/ApiScreen';
import { ShortsScreen } from './src/screens/ShortsScreen';
import { OutstreamScreen } from './src/screens/OutstreamScreen';
import { DeepLinkPlayerScreen } from './src/screens/DeepLinkPlayerScreen';
import { SimplePlayerScreen } from './src/screens/SimplePlayerScreen';
import { BarePlayerScreen } from './src/screens/BarePlayerScreen';

type Screen = 'home' | 'api' | 'shorts' | 'outstream' | 'deeplink' | 'simple' | 'bare';

// Demo menu items - matching native SDK demo app structure
const DEMO_ITEMS = [
  {
    id: 'simple',
    title: 'Simple Player',
    description: 'Minimal player with no event handlers - for performance testing',
    icon: '▶️',
  },
  {
    id: 'bare',
    title: 'Bare Player',
    description: 'Native view only, bypasses JS wrapper - for baseline comparison',
    icon: '⚡',
  },
  {
    id: 'api',
    title: 'API Reference',
    description: 'Test all player API methods: play, pause, seek, volume, fullscreen, and more',
    icon: '📺',
  },
  {
    id: 'shorts',
    title: 'Shorts',
    description: 'Vertical video player with swipe navigation (TikTok-style)',
    icon: '📱',
  },
  {
    id: 'outstream',
    title: 'Outstream Ads',
    description: 'Standalone ad player with collapse/expand for article placements',
    icon: '📰',
  },
] as const;

function HomeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BB Player Demo</Text>
        <Text style={styles.headerSubtitle}>React Native SDK</Text>
      </View>

      {/* Demo Items */}
      <View style={styles.menuContainer}>
        {DEMO_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => onNavigate(item.id as Screen)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemIcon}>
              <Text style={styles.menuItemIconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Blue Billywig Native SDK
        </Text>
        <Text style={styles.footerVersion}>
          @bluebillywig/react-native-bb-player
        </Text>
      </View>
    </SafeAreaView>
  );
}

/**
 * Parse a deep link URL and extract the clip ID
 * Supports:
 * - https://www.bluebillywig.tv/watch/<clipId>
 * - bbplayer://watch/<clipId>
 */
function parseDeepLink(url: string): string | null {
  // Try regex match first (works for both URL types)
  const match = url.match(/\/watch\/(\d+)/);
  if (match) {
    return match[1];
  }

  // Fallback for custom scheme without leading slash: bbplayer://watch/123
  const schemeMatch = url.match(/^[a-z]+:\/\/watch\/(\d+)/i);
  if (schemeMatch) {
    return schemeMatch[1];
  }

  return null;
}

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [deepLinkClipId, setDeepLinkClipId] = useState<string | null>(null);

  // Handle deep links
  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const clipId = parseDeepLink(initialUrl);
        if (clipId) {
          setDeepLinkClipId(clipId);
          setCurrentScreen('deeplink');
        }
      }
    };

    // Handle URL when app is already running (deep link while app is open)
    const handleUrlChange = (event: { url: string }) => {
      const clipId = parseDeepLink(event.url);
      if (clipId) {
        setDeepLinkClipId(clipId);
        setCurrentScreen('deeplink');
      }
    };

    handleInitialUrl();
    const subscription = Linking.addEventListener('url', handleUrlChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setDeepLinkClipId(null);
    setCurrentScreen('home');
  };

  // Render current screen wrapped in SafeAreaProvider
  const renderScreen = () => {
    switch (currentScreen) {
      case 'simple':
        return <SimplePlayerScreen />;
      case 'bare':
        return <BarePlayerScreen />;
      case 'api':
        return <ApiScreen onBack={handleBack} />;
      case 'shorts':
        return <ShortsScreen onBack={handleBack} />;
      case 'outstream':
        return <OutstreamScreen onBack={handleBack} />;
      case 'deeplink':
        return deepLinkClipId ? (
          <DeepLinkPlayerScreen clipId={deepLinkClipId} onBack={handleBack} />
        ) : (
          <HomeScreen onNavigate={handleNavigate} />
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemIconText: {
    fontSize: 24,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  footerVersion: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 4,
    fontFamily: 'monospace',
  },
});

export default App;
