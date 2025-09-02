import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { LanguageProvider } from '../contexts/LanguageContext'
import { AuthProvider } from '../contexts/AuthContext'

// Mock data for testing
export const mockUser = {
  id: 'user1',
  name: 'John Mwanza',
  email: 'john.mwanza@ulimi.com',
  role: 'farmer' as const,
  location: {
    province: 'Lusaka',
    district: 'Lusaka'
  },
  language: 'en',
  createdAt: '2024-01-01T00:00:00Z'
}

export const mockFarm = {
  id: 'farm1',
  farmerId: 'user1',
  name: 'Green Valley Farm',
  size: 5.5,
  location: {
    province: 'Lusaka',
    district: 'Lusaka',
    coordinates: [-15.3875, 28.3228]
  },
  soilType: 'Clay loam',
  crops: [],
  createdAt: '2024-01-01T00:00:00Z'
}

export const mockTask = {
  id: 'task1',
  title: 'Apply fertilizer to maize field',
  description: 'Apply NPK fertilizer to the maize crop for optimal growth',
  type: 'fertilizing' as const,
  status: 'pending' as const,
  priority: 'high' as const,
  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  estimatedDuration: 4,
  assignedTo: 'John Mwanza',
  cropId: 'crop1',
  createdAt: new Date().toISOString()
}

export const mockMarketplaceItem = {
  id: 'item1',
  sellerId: 'seller1',
  sellerName: 'AgriSupply Co.',
  name: 'NPK Fertilizer',
  category: 'inputs' as const,
  type: 'fertilizer',
  description: 'High-quality NPK fertilizer (10-10-10) for optimal crop growth',
  price: 350.00,
  currency: 'ZMW',
  quantity: 50,
  unit: 'bag',
  location: {
    province: 'Copperbelt',
    district: 'Kitwe'
  },
  images: [],
  status: 'available' as const,
  createdAt: new Date().toISOString()
}

export const mockWeatherData = {
  current: {
    temperature: 28,
    humidity: 65,
    rainfall: 0,
    conditions: 'Partly Cloudy',
    windSpeed: 8,
    uvIndex: 7
  },
  forecast: [
    { date: new Date().toISOString(), temp: 28, rainfall: 0, conditions: 'Sunny' },
    { date: new Date(Date.now() + 86400000).toISOString(), temp: 30, rainfall: 5, conditions: 'Light Rain' },
    { date: new Date(Date.now() + 172800000).toISOString(), temp: 26, rainfall: 15, conditions: 'Rainy' }
  ]
}

// Mock for storage utility
export const createMockStorage = () => {
  const storage: Record<string, any> = {}
  
  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key]
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key])
    }),
    get: vi.fn((key: string) => {
      const item = storage[`ulimi_${key}`]
      return item ? JSON.parse(item) : null
    }),
    set: vi.fn((key: string, value: any) => {
      storage[`ulimi_${key}`] = JSON.stringify(value)
    }),
    getFarms: vi.fn(() => [mockFarm]),
    getTasks: vi.fn(() => [mockTask]),
    getMarketplaceItems: vi.fn(() => [mockMarketplaceItem]),
    getWeatherData: vi.fn(() => mockWeatherData),
    getUser: vi.fn(() => mockUser),
    saveFarms: vi.fn(),
    saveTasks: vi.fn(),
    saveMarketplaceItems: vi.fn(),
    saveWeatherData: vi.fn(),
    saveUser: vi.fn()
  }
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialUser?: typeof mockUser | null
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialUser = mockUser, ...renderOptions } = options

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider initialUser={initialUser}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </AuthProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from react-testing-library
export * from '@testing-library/react'
export { renderWithProviders as render }