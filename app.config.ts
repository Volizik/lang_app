import 'dotenv/config';

export default {
  expo: {
    name: 'Language Learning App',
    slug: 'language-learning-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      }
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    // Добавляем схему для deep linking
    scheme: 'languageapp',
    extra: {
      apiUrl: process.env.API_URL || 'https://default-api-url.com'
    },
    experiments: {
      tsconfigPaths: true
    },
    plugins: [],
    // Включаем новую архитектуру
    newArchEnabled: true
  }
};
