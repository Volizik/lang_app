import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { StyleProp, ViewStyle } from 'react-native';
import { AudioPlayButton } from '../AudioPlayButton';

// Глобальный объект для управления текущим звуком
let globalSound: Audio.Sound | null = null;

interface AudioControllerProps {
  audioUrl: string;
  index: number;
  currentPlayingIndex: number | null;
  onPlayingIndexChange: (index: number | null) => void;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
}

export function AudioController({ 
  audioUrl, 
  index,
  currentPlayingIndex,
  onPlayingIndexChange,
  style,
  iconColor
}: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Эффект для остановки воспроизведения, когда начинает играть другой трек
  useEffect(() => {
    if (currentPlayingIndex !== index && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentPlayingIndex]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (isPlaying) {
        handleStop();
      }
    };
  }, []);

  const handleStop = async () => {
    if (globalSound) {
      await globalSound.unloadAsync();
      globalSound = null;
      setIsPlaying(false);
      onPlayingIndexChange(null);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await handleStop();
      } else {
        setIsLoading(true);
        try {
          // Останавливаем предыдущий звук, если он есть
          if (globalSound) {
            await handleStop();
          }

          // Настраиваем аудио режим
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
          });

          // Загружаем новый трек
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true },
            (status) => {
              if (!status.isLoaded || status.didJustFinish) {
                handleStop();
              }
            }
          );

          globalSound = newSound;
          setIsPlaying(true);
          onPlayingIndexChange(index);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error playing sound. Details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        audioUrl
      });
      handleStop();
      setIsLoading(false);
    }
  };

  return (
    <AudioPlayButton
      isPlaying={isPlaying}
      isLoading={isLoading}
      onPress={handlePlayPause}
      color={iconColor}
      style={style}
    />
  );
}
