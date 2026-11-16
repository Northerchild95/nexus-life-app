import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { es } from './locales/es';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export type AppLanguage = 'en' | 'es';

export const configureI18n = async (language: AppLanguage = 'en') => {
  // The selected language is persisted in the app store and restored on start.
  await i18n.changeLanguage(language);
};

export default i18n;
