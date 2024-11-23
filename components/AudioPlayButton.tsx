import { TouchableOpacity, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioPlayButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function AudioPlayButton({
  isPlaying,
  isLoading,
  onPress,
  size = 50,
  color = "#A1CEDC",
  style
}: AudioPlayButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.playButton,
        { width: size + 8, height: size + 8 },
        isPlaying && styles.playButtonActive,
        style
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={color} />
      ) : (
        <Ionicons 
          name={isPlaying ? "pause-circle" : "play-circle"} 
          size={size} 
          color={color} 
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    opacity: 0.8,
  },
});
