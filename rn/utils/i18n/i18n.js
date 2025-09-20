import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: require('./locales/en.json') },
  hi: { translation: require('./locales/hi.json') },
  bn: { translation: require('./locales/bn.json') },
  ta: { translation: require('./locales/ta.json') },
  te: { translation: require('./locales/te.json') },
  mr: { translation: require('./locales/mr.json') },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // This will be overridden by AsyncStorage
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3', // Important for React Native
  });

export default i18n;