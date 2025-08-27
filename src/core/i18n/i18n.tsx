import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Localization from 'expo-localization';
import { loadJSON, saveJSON } from '../storage/async';
import en from './locales/en.json';

type LocaleStrings = typeof en;

interface I18nContextValue {
  t: (key: keyof LocaleStrings) => string;
  locale: string;
  setLocale: (loc: string) => void;
  available: string[];
}

const I18N_STORAGE_KEY = 'app_locale_v1';

const translations: Record<string, LocaleStrings> = {
  en,
  // more languages later
};

const fallbackLocale = 'en';
const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const device = Localization.getLocales()[0]?.languageCode ?? fallbackLocale;
  const [locale, setLocaleState] = useState(fallbackLocale);

  useEffect(() => {
    (async () => {
      const saved = await loadJSON<string | null>(I18N_STORAGE_KEY, null);
      if (saved && translations[saved]) {
        setLocaleState(saved);
      } else if (translations[device]) {
        setLocaleState(device);
      }
    })();
  }, [device]);

  const setLocale = (loc: string) => {
    if (!translations[loc]) {
      console.warn('No translations for locale', loc);
      return;
    }
    setLocaleState(loc);
    saveJSON(I18N_STORAGE_KEY, loc);
  };

  const t = (key: keyof LocaleStrings) => {
    const pack = translations[locale] || translations[fallbackLocale];
    return pack[key] || key;
  };

  return (
    <I18nContext.Provider value={{ t, locale, setLocale, available: Object.keys(translations) }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}