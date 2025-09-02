import { describe, it, expect, vi, beforeEach } from 'vitest'
import { storage } from '../utils/storage'
import { mockUser, mockFarm, mockTask, mockMarketplaceItem, mockWeatherData } from '../test/test-utils'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Storage Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Generic Storage Methods', () => {
    it('stores and retrieves data correctly', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ test: 'data' }))
      
      storage.set('testKey', { test: 'data' })
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_testKey', JSON.stringify({ test: 'data' }))
      
      const result = storage.get('testKey')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('ulimi_testKey')
      expect(result).toEqual({ test: 'data' })
    })

    it('handles JSON parsing errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      
      const result = storage.get('testKey')
      expect(result).toBeNull()
    })

    it('removes items correctly', () => {
      storage.remove('testKey')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ulimi_testKey')
    })

    it('clears all ulimi data', () => {
      // Mock localStorage.keys
      Object.defineProperty(localStorage, 'keys', {
        value: vi.fn(() => ['ulimi_test1', 'ulimi_test2', 'other_key']),
      })
      
      Object.keys = vi.fn(() => ['ulimi_test1', 'ulimi_test2', 'other_key'])
      
      storage.clear()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ulimi_test1')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ulimi_test2')
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('other_key')
    })
  })

  describe('User Data Management', () => {
    it('saves and retrieves user data', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      storage.saveUser(mockUser)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_user', JSON.stringify(mockUser))
      
      const result = storage.getUser()
      expect(result).toEqual(mockUser)
    })
  })

  describe('Farm Data Management', () => {
    it('saves and retrieves farm data', () => {
      const farms = [mockFarm]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(farms))
      
      storage.saveFarms(farms)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_farms', JSON.stringify(farms))
      
      const result = storage.getFarms()
      expect(result).toEqual(farms)
    })

    it('returns empty array when no farms exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getFarms()
      expect(result).toEqual([])
    })
  })

  describe('Task Data Management', () => {
    it('saves and retrieves task data', () => {
      const tasks = [mockTask]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(tasks))
      
      storage.saveTasks(tasks)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_tasks', JSON.stringify(tasks))
      
      const result = storage.getTasks()
      expect(result).toEqual(tasks)
    })

    it('returns empty array when no tasks exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getTasks()
      expect(result).toEqual([])
    })
  })

  describe('Marketplace Data Management', () => {
    it('saves and retrieves marketplace items', () => {
      const items = [mockMarketplaceItem]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(items))
      
      storage.saveMarketplaceItems(items)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_marketplace', JSON.stringify(items))
      
      const result = storage.getMarketplaceItems()
      expect(result).toEqual(items)
    })

    it('returns empty array when no marketplace items exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getMarketplaceItems()
      expect(result).toEqual([])
    })
  })

  describe('Weather Data Management', () => {
    it('saves and retrieves weather data', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockWeatherData))
      
      storage.saveWeatherData(mockWeatherData)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_weather', JSON.stringify(mockWeatherData))
      
      const result = storage.getWeatherData()
      expect(result).toEqual(mockWeatherData)
    })
  })

  describe('Orders Management', () => {
    it('saves and retrieves orders', () => {
      const orders = [{ id: 'order1', items: [], total: 100 }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(orders))
      
      storage.saveOrders(orders)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_orders', JSON.stringify(orders))
      
      const result = storage.getOrders()
      expect(result).toEqual(orders)
    })

    it('returns empty array when no orders exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getOrders()
      expect(result).toEqual([])
    })
  })

  describe('Suppliers Management', () => {
    it('saves and retrieves suppliers', () => {
      const suppliers = [{ id: 'supplier1', name: 'Test Supplier' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(suppliers))
      
      storage.saveSuppliers(suppliers)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_suppliers', JSON.stringify(suppliers))
      
      const result = storage.getSuppliers()
      expect(result).toEqual(suppliers)
    })

    it('returns empty array when no suppliers exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getSuppliers()
      expect(result).toEqual([])
    })
  })

  describe('AI Recommendations Management', () => {
    it('saves and retrieves AI recommendations', () => {
      const recommendations = [{ id: 'rec1', type: 'crop_optimization', confidence: 90 }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(recommendations))
      
      storage.saveAIRecommendations(recommendations)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_ai_recommendations', JSON.stringify(recommendations))
      
      const result = storage.getAIRecommendations()
      expect(result).toEqual(recommendations)
    })

    it('returns empty array when no AI recommendations exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getAIRecommendations()
      expect(result).toEqual([])
    })
  })

  describe('User Preferences Management', () => {
    it('saves and retrieves user preferences', () => {
      const preferences = { theme: 'dark', language: 'en' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(preferences))
      
      storage.saveUserPreferences(preferences)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('ulimi_user_preferences', JSON.stringify(preferences))
      
      const result = storage.getUserPreferences()
      expect(result).toEqual(preferences)
    })

    it('returns empty object when no preferences exist', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = storage.getUserPreferences()
      expect(result).toEqual({})
    })
  })

  describe('Sync Queue Management', () => {
    it('adds items to sync queue', () => {
      const operation = { type: 'create', entity: 'task', data: {} }
      
      storage.addToSyncQueue(operation)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ulimi_sync_queue',
        expect.stringContaining('"type":"create"')
      )
    })

    it('retrieves sync queue', () => {
      const queue = [{ id: 'op1', type: 'create' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(queue))
      
      const result = storage.getSyncQueue()
      expect(result).toEqual(queue)
    })

    it('clears sync queue', () => {
      storage.clearSyncQueue()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ulimi_sync_queue')
    })
  })

  describe('Sample Data Initialization', () => {
    it('initializes sample data when storage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      storage.initializeSampleData()
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ulimi_farms',
        expect.stringContaining('Green Valley Farm')
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ulimi_marketplace',
        expect.stringContaining('Fresh Maize')
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ulimi_tasks',
        expect.stringContaining('Apply fertilizer')
      )
    })

    it('does not overwrite existing data', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockFarm]))
      
      storage.initializeSampleData()
      
      // Should not set farms again since they already exist
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        'ulimi_farms',
        expect.any(String)
      )
    })
  })

  describe('Error Handling', () => {
    it('handles localStorage setItem errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      // Should not throw error
      expect(() => storage.set('testKey', { data: 'test' })).not.toThrow()
    })

    it('handles localStorage getItem errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage access denied')
      })
      
      const result = storage.get('testKey')
      expect(result).toBeNull()
    })
  })
})