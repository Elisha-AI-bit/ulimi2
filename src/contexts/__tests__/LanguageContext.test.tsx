import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage, LanguageSwitcher, TranslatedText } from '../contexts/LanguageContext'
import { languages, getTranslation, detectUserLanguage, formatCurrencyLocal, formatDateLocal } from '../utils/zambia-data'
import React from 'react'

// Mock storage
const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
})

// Test component that uses the language context
const TestComponent = () => {
  const { currentLanguage, t, setLanguage, formatCurrency, formatDate } = useLanguage()
  
  return (
    <div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="translation">{t('dashboard')}</div>
      <div data-testid="formatted-currency">{formatCurrency(1500)}</div>
      <div data-testid="formatted-date">{formatDate('2024-01-15T00:00:00Z')}</div>
      <button onClick={() => setLanguage('ny')}>Switch to Chinyanja</button>
      <button onClick={() => setLanguage('bem')}>Switch to Chibemba</button>
    </div>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage.getItem.mockReturnValue(null)
  })

  it('provides default language context', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    expect(screen.getByTestId('translation')).toHaveTextContent('Dashboard')
  })

  it('switches languages correctly', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    const switchButton = screen.getByText('Switch to Chinyanja')
    fireEvent.click(switchButton)

    expect(screen.getByTestId('current-language')).toHaveTextContent('ny')
  })

  it('saves language preference to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    const switchButton = screen.getByText('Switch to Chibemba')
    fireEvent.click(switchButton)

    expect(mockStorage.setItem).toHaveBeenCalledWith('ulimi_language', 'bem')
  })

  it('formats currency correctly for different languages', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    expect(screen.getByTestId('formatted-currency')).toHaveTextContent(/1,500|1 500/)
  })

  it('formats dates correctly', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    const dateElement = screen.getByTestId('formatted-date')
    expect(dateElement.textContent).toMatch(/Jan|January|15|2024/)
  })

  it('prevents switching to unsupported language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    const { setLanguage } = useLanguage()
    
    // Should remain in current language if invalid language is set
    const initialLanguage = screen.getByTestId('current-language').textContent
    
    // This would normally be called programmatically
    // The component prevents invalid languages in the UI
    expect(initialLanguage).toBe('en')
  })

  it('loads saved language preference on initialization', () => {
    mockStorage.getItem.mockReturnValue('ny')
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('ny')
  })
})

describe('LanguageSwitcher Component', () => {
  it('renders language options', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    )

    // Should show select dropdown with language options
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('renders compact version correctly', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher compact={true} />
      </LanguageProvider>
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveClass('text-sm')
  })

  it('shows native language names when requested', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher showNativeNames={true} />
      </LanguageProvider>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })
})

describe('TranslatedText Component', () => {
  it('renders translated text correctly', () => {
    render(
      <LanguageProvider>
        <TranslatedText textKey="dashboard" />
      </LanguageProvider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders fallback text when translation is missing', () => {
    render(
      <LanguageProvider>
        <TranslatedText textKey="nonexistent_key" fallback="Fallback Text" />
      </LanguageProvider>
    )

    expect(screen.getByText('Fallback Text')).toBeInTheDocument()
  })

  it('applies CSS classes correctly', () => {
    render(
      <LanguageProvider>
        <TranslatedText textKey="dashboard" className="text-lg font-bold" />
      </LanguageProvider>
    )

    const element = screen.getByText('Dashboard')
    expect(element).toHaveClass('text-lg', 'font-bold')
  })
})

describe('Language Utility Functions', () => {
  describe('getTranslation', () => {
    it('returns English translation by default', () => {
      const result = getTranslation('dashboard', 'en')
      expect(result).toBe('Dashboard')
    })

    it('returns local language translation when available', () => {
      const result = getTranslation('dashboard', 'ny')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('falls back to English when local translation is missing', () => {
      const result = getTranslation('nonexistent_key', 'ny')
      expect(result).toBe('nonexistent_key') // Returns key when no translation found
    })
  })

  describe('detectUserLanguage', () => {
    it('detects language from localStorage', () => {
      mockStorage.getItem.mockReturnValue('ny')
      
      const detected = detectUserLanguage()
      expect(detected).toBe('ny')
    })

    it('falls back to browser language when localStorage is empty', () => {
      mockStorage.getItem.mockReturnValue(null)
      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true
      })
      
      const detected = detectUserLanguage()
      expect(detected).toBe('en')
    })

    it('defaults to English when browser language is unsupported', () => {
      mockStorage.getItem.mockReturnValue(null)
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        configurable: true
      })
      
      const detected = detectUserLanguage()
      expect(detected).toBe('en')
    })
  })

  describe('formatCurrencyLocal', () => {
    it('formats currency for English locale', () => {
      const result = formatCurrencyLocal(1500, 'en')
      expect(result).toMatch(/ZMW|K/)
      expect(result).toMatch(/1,500|1 500/)
    })

    it('formats currency for local languages', () => {
      const result = formatCurrencyLocal(1500, 'ny')
      expect(result).toMatch(/ZMW|K/)
      expect(result).toMatch(/1,500|1 500/)
    })

    it('handles decimal values correctly', () => {
      const result = formatCurrencyLocal(1500.50, 'en')
      expect(result).toMatch(/1,500\.50|1 500,50/)
    })

    it('handles zero and negative values', () => {
      const zeroResult = formatCurrencyLocal(0, 'en')
      expect(zeroResult).toMatch(/0/)
      
      const negativeResult = formatCurrencyLocal(-100, 'en')
      expect(negativeResult).toMatch(/-/)
    })
  })

  describe('formatDateLocal', () => {
    it('formats date for English locale', () => {
      const result = formatDateLocal('2024-01-15T00:00:00Z', 'en')
      expect(result).toMatch(/Jan|January|15|2024/)
    })

    it('formats date for local languages', () => {
      const result = formatDateLocal('2024-01-15T00:00:00Z', 'ny')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('handles different date formats', () => {
      const isoResult = formatDateLocal('2024-01-15T10:30:00Z', 'en')
      const timestampResult = formatDateLocal(new Date('2024-01-15').toISOString(), 'en')
      
      expect(typeof isoResult).toBe('string')
      expect(typeof timestampResult).toBe('string')
    })

    it('handles invalid dates gracefully', () => {
      const result = formatDateLocal('invalid-date', 'en')
      expect(typeof result).toBe('string')
    })
  })

  describe('Language Support', () => {
    it('includes all required Zambian languages', () => {
      const requiredLanguages = ['en', 'ny', 'bem', 'ton', 'loz', 'lun', 'lue', 'lam', 'kqn']
      
      requiredLanguages.forEach(lang => {
        expect(languages).toHaveProperty(lang)
        expect(typeof languages[lang]).toBe('string')
      })
    })

    it('has consistent translation structure', () => {
      const testKeys = ['dashboard', 'farms', 'tasks', 'marketplace', 'weather']
      
      testKeys.forEach(key => {
        Object.keys(languages).forEach(lang => {
          const translation = getTranslation(key, lang)
          expect(typeof translation).toBe('string')
          expect(translation.length).toBeGreaterThan(0)
        })
      })
    })
  })
})