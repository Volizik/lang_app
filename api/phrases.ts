import { Phrase } from '../types/phrase';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
const AUDIO_BASE_URL = `${API_URL}/audio`; // Базовый путь к аудио файлам

interface PhrasesResponse {
  success: boolean;
  data: Phrase[];
}

export async function getRandomPhrases(limit: number = 5): Promise<Phrase[]> {
  try {
    console.log('Fetching random phrases from:', `${API_URL}/api/phrases/random?limit=${limit}&language=en`);
    const response = await fetch(`${API_URL}/api/phrases/random?limit=${limit}&language=en`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch phrases');
    }
    
    const phrases: Array<{
      id: string;
      text: string;
      language: string;
      audio: string;
      created_at: string;
      updated_at: string;
    }> = await response.json();
    
    // Преобразуем ответ сервера в формат Phrase
    return phrases.map(phrase => ({
      id: phrase.id,
      text: phrase.text,
      audioUrl: `${AUDIO_BASE_URL}/${phrase.audio}`, // Формируем полный URL к аудио файлу
      language: phrase.language
    }));
  } catch (error) {
    console.error('Error fetching phrases:', error);
    throw error;
  }
}
