'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TRANSLATIONS, type Dictionary, type Language } from '@/data/translations';

type LanguageContextValue = {
  language: Language;
  dictionary: Dictionary;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  dictionary: TRANSLATIONS.en,
  setLanguage: () => {},
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('site-language');
    if (saved === 'en' || saved === 'pl') setLanguageState(saved);
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    localStorage.setItem('site-language', next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    dictionary: TRANSLATIONS[language],
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'en' ? 'pl' : 'en'),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
