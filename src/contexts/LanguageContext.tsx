import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  languages, 
  translations, 
  detectUserLanguage, 
  getTranslation, 
  getLanguageDirection,
  getLanguageNativeName,
  formatCurrencyLocal,
  formatDateLocal
} from '../utils/zambia-data';
import { storage } from '../utils/storage';

interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: Record<string, string>;
  direction: 'ltr' | 'rtl';
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getLanguageDisplayName: (language: string) => string;
  isLanguageSupported: (language: string) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Initialize with saved language preference or detected language
    const savedLanguage = storage.get<string>('language');
    return savedLanguage || detectUserLanguage();
  });

  useEffect(() => {
    // Save language preference when it changes
    storage.set('language', currentLanguage);
    
    // Set document language attribute
    document.documentElement.lang = currentLanguage;
    
    // Set document direction
    document.documentElement.dir = getLanguageDirection(currentLanguage);
  }, [currentLanguage]);

  const setLanguage = (language: string) => {
    if (Object.keys(languages).includes(language)) {
      setCurrentLanguage(language);
    } else {
      console.warn(`Language '${language}' is not supported. Available languages:`, Object.keys(languages));
    }
  };

  const t = (key: string): string => {
    return getTranslation(key, currentLanguage);
  };

  const formatCurrency = (amount: number): string => {
    return formatCurrencyLocal(amount, currentLanguage);
  };

  const formatDate = (date: string): string => {
    return formatDateLocal(date, currentLanguage);
  };

  const getLanguageDisplayName = (language: string): string => {
    return getLanguageNativeName(language);
  };

  const isLanguageSupported = (language: string): boolean => {
    return Object.keys(languages).includes(language);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    availableLanguages: languages,
    direction: getLanguageDirection(currentLanguage),
    setLanguage,
    t,
    formatCurrency,
    formatDate,
    getLanguageDisplayName,
    isLanguageSupported
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Higher-order component for easy language integration
export const withLanguage = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const languageContext = useLanguage();
    return <Component {...props} {...languageContext} />;
  };
};

// Hook for component-level translation
export const useTranslation = () => {
  const { t, currentLanguage, formatCurrency, formatDate } = useLanguage();
  
  return {
    t,
    currentLanguage,
    formatCurrency,
    formatDate,
    // Shorthand for common translations
    translations: {
      loading: t('loading'),
      save: t('save'),
      cancel: t('cancel'),
      edit: t('edit'),
      delete: t('delete'),
      add: t('add'),
      search: t('search'),
      filter: t('filter'),
      noData: t('no_data'),
      error: t('error'),
      success: t('success')
    }
  };
};

// Component for displaying language-specific text
interface TranslatedTextProps {
  textKey: string;
  fallback?: string;
  className?: string;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  textKey, 
  fallback, 
  className 
}) => {
  const { t } = useLanguage();
  const text = t(textKey) || fallback || textKey;
  
  return <span className={className}>{text}</span>;
};

// Language switcher component
interface LanguageSwitcherProps {
  className?: string;
  showNativeNames?: boolean;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '',
  showNativeNames = false,
  compact = false
}) => {
  const { currentLanguage, availableLanguages, setLanguage, getLanguageDisplayName } = useLanguage();

  if (compact) {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        className={`text-sm border border-gray-300 rounded-md px-2 py-1 ${className}`}
      >
        {Object.entries(availableLanguages).map(([code, name]) => (
          <option key={code} value={code}>
            {showNativeNames ? getLanguageDisplayName(code) : name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={`language-switcher ${className}`}>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(availableLanguages).map(([code, name]) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              currentLanguage === code
                ? 'bg-green-100 text-green-800 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">
                {showNativeNames ? getLanguageDisplayName(code) : name}
              </div>
              <div className="text-xs text-gray-500 uppercase">{code}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Hook for language-aware form validation messages
export const useFormTranslation = () => {
  const { t } = useLanguage();
  
  return {
    required: (field: string) => t('field_required').replace('{field}', t(field)) || `${field} is required`,
    minLength: (field: string, min: number) => 
      t('field_min_length').replace('{field}', t(field)).replace('{min}', min.toString()) || 
      `${field} must be at least ${min} characters`,
    maxLength: (field: string, max: number) => 
      t('field_max_length').replace('{field}', t(field)).replace('{max}', max.toString()) || 
      `${field} must not exceed ${max} characters`,
    email: () => t('invalid_email') || 'Please enter a valid email address',
    phone: () => t('invalid_phone') || 'Please enter a valid phone number'
  };
};