import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, mockUser, mockFarm, mockTask, mockWeatherData, createMockStorage } from '../test/test-utils'
import Dashboard from '../components/Dashboard'

// Mock the storage module
vi.mock('../utils/storage', () => ({
  storage: createMockStorage()
}))

// Mock the services
vi.mock('../services/AICapabilitiesService', () => ({
  aiCapabilitiesService: {
    getModelPerformance: vi.fn(() => [
      { modelName: 'Crop Optimizer', version: '1.0', accuracy: 92.5, lastUpdated: new Date().toISOString() },
      { modelName: 'Pest Detector', version: '2.1', accuracy: 88.3, lastUpdated: new Date().toISOString() }
    ])
  }
}))

vi.mock('../services/DataIntegrationService', () => ({
  dataIntegrationService: {
    getDataSyncStatus: vi.fn(() => ({ status: 'synced', lastSync: new Date().toISOString() }))
  }
}))

vi.mock('../services/OfflineSyncService', () => ({
  useOfflineSync: vi.fn(() => ({
    syncStatus: {
      isOnline: true,
      pendingOperations: 0,
      failedOperations: 0,
      syncInProgress: false
    },
    isOfflineMode: vi.fn(() => false)
  }))
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title and description', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/farming activities/i)).toBeInTheDocument()
  })

  it('displays stats cards with correct data', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Farms')).toBeInTheDocument()
      expect(screen.getByText('Active Tasks')).toBeInTheDocument()
      expect(screen.getByText('AI Models')).toBeInTheDocument()
      expect(screen.getByText('Data Sources')).toBeInTheDocument()
    })
  })

  it('shows quick actions grid', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      expect(screen.getByText('Access key features')).toBeInTheDocument()
    })
  })

  it('displays weather widget when weather data is available', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Weather')).toBeInTheDocument()
      expect(screen.getByText('28°C')).toBeInTheDocument()
      expect(screen.getByText('Partly Cloudy')).toBeInTheDocument()
    })
  })

  it('shows system status indicators', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByText('Connection')).toBeInTheDocument()
      expect(screen.getByText('Online')).toBeInTheDocument()
    })
  })

  it('displays AI recommendations when available', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('AI Recommendations')).toBeInTheDocument()
    })
  })

  it('handles loading state properly', () => {
    render(<Dashboard />)
    
    // Initially should show loading or skeleton states
    expect(screen.queryByText('Loading...')).toBeInTheDocument() || 
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays correct farm statistics', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      // Should show 1 farm from mock data
      expect(screen.getByText('1')).toBeInTheDocument() // farm count
    })
  })

  it('shows task statistics correctly', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      // Should show task statistics
      const taskElements = screen.getAllByText(/task/i)
      expect(taskElements.length).toBeGreaterThan(0)
    })
  })

  it('handles offline mode display', async () => {
    // Mock offline mode
    vi.doMock('../services/OfflineSyncService', () => ({
      useOfflineSync: vi.fn(() => ({
        syncStatus: {
          isOnline: false,
          pendingOperations: 2,
          failedOperations: 1,
          syncInProgress: false
        },
        isOfflineMode: vi.fn(() => true)
      }))
    }))

    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('Offline')).toBeInTheDocument()
    })
  })

  it('displays forecast information in weather widget', async () => {
    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('3-Day Forecast')).toBeInTheDocument()
      expect(screen.getByText('Today')).toBeInTheDocument()
    })
  })

  it('shows pending sync operations when available', async () => {
    // Mock pending operations
    vi.doMock('../services/OfflineSyncService', () => ({
      useOfflineSync: vi.fn(() => ({
        syncStatus: {
          isOnline: true,
          pendingOperations: 3,
          failedOperations: 0,
          syncInProgress: false
        },
        isOfflineMode: vi.fn(() => false)
      }))
    }))

    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/3 operations pending sync/)).toBeInTheDocument()
    })
  })

  it('handles empty data states gracefully', async () => {
    // Mock empty data
    vi.doMock('../utils/storage', () => ({
      storage: {
        ...createMockStorage(),
        getFarms: vi.fn(() => []),
        getTasks: vi.fn(() => []),
        getAIRecommendations: vi.fn(() => [])
      }
    }))

    render(<Dashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument() // Should show 0 for empty data
    })
  })
})