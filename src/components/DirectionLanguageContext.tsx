import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DirectionLanguageContextType {
  isRtl: boolean;
  language: string;
  setIsRtl: (isRtl: boolean) => void;
  setLanguage: (language: string) => void;
}

const DirectionLanguageContext = createContext<DirectionLanguageContextType | undefined>(undefined);

export const DirectionLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState<boolean>(() => {
    const storedRtl = localStorage.getItem('isRtl');
    return storedRtl ? JSON.parse(storedRtl) : false;
  });
  const [language, setLanguage] = useState<string>(() => {
    const storedLang = localStorage.getItem('language');
    return storedLang || 'en';
  });

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    i18n.changeLanguage(language);
    localStorage.setItem('isRtl', JSON.stringify(isRtl));
    localStorage.setItem('language', language);
  }, [isRtl, language, i18n]);

  return (
    <DirectionLanguageContext.Provider value={{ isRtl, language, setIsRtl, setLanguage }}>
      {children}
    </DirectionLanguageContext.Provider>
  );
};

export const useDirectionLanguage = () => {
  const context = useContext(DirectionLanguageContext);
  if (context === undefined) {
    throw new Error('useDirectionLanguage must be used within a DirectionLanguageProvider');
  }
  return context;
};
