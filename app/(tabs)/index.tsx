import { StyleSheet, ActivityIndicator, TouchableOpacity, Platform, useColorScheme, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AudioController } from '@/components/business/AudioController';
import { getRandomPhrases } from '@/api/phrases';
import { Phrase } from '@/types/phrase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  stepContainer: {
    padding: 16,
    minHeight: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeCard: {
    transform: [{ scale: 1.02 }],
  },
  gradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phraseText: {
    flex: 1,
    fontSize: 16,
    marginRight: 16,
  },
  audioButton: {
    width: 60,
    height: 60,
  },
  refreshButton: {
    backgroundColor: '#A1CEDC',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default function HomeScreen() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadPhrases();
  }, []);

  const loadPhrases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRandomPhrases(5);
      setPhrases(data);
    } catch (err) {
      setError('Failed to load phrases');
      console.error('Error loading phrases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#A1CEDC' : '#1D3D47'} />
          <ThemedText style={styles.loadingText}>Loading phrases...</ThemedText>
        </ThemedView>
      );
    }

    if (error) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}> {error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={loadPhrases}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.stepContainer}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText style={styles.title}>Random phrases</ThemedText>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadPhrases}
            disabled={isLoading}
          >
            <ThemedText style={styles.refreshIcon}>↻</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedText style={styles.subtitle}>Tap on a play button to hear it</ThemedText>
        <ThemedView style={styles.listContainer}>
          {phrases.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.delay(index * 200)}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  currentPlayingIndex === index && styles.activeCard
                ]}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={colorScheme === 'dark' 
                    ? currentPlayingIndex === index 
                      ? ['#1a3f4d', '#0f1e22'] 
                      : ['#2C5364', '#203A43']
                    : currentPlayingIndex === index
                      ? ['#89B9C9', '#6a98a8']
                      : ['#A1CEDC', '#89B9C9']}
                  style={styles.gradient}
                >
                  <ThemedText style={[styles.phraseText, { color: '#FFFFFF' }]}>{item.text}</ThemedText>
                  <AudioController
                    audioUrl={item.audioUrl}
                    style={styles.audioButton}
                    index={index}
                    currentPlayingIndex={currentPlayingIndex}
                    onPlayingIndexChange={setCurrentPlayingIndex}
                    iconColor="#FFFFFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {renderContent()}
    </ScrollView>
  );
}
