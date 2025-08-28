import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { offlineSyncService } from '../services/OfflineSyncService'
import { createMockStorage } from '../test/test-utils'

// Mock the storage module
const mockStorage = createMockStorage()
vi.mock('../utils/storage', () => ({
  storage: mockStorage
}))

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
})

// Mock window events
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()
Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
})
Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
})

describe('OfflineSyncService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    navigator.onLine = true
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('initializes correctly', () => {
    expect(offlineSyncService).toBeDefined()
    expect(offlineSyncService.getSyncStatus).toBeDefined()
    expect(offlineSyncService.addToSyncQueue).toBeDefined()
  })

  it('detects online status correctly', () => {
    const status = offlineSyncService.getSyncStatus()
    expect(status.isOnline).toBe(true)
  })

  it('detects offline status correctly', () => {
    navigator.onLine = false
    const status = offlineSyncService.getSyncStatus()
    expect(status.isOnline).toBe(false)
  })

  it('adds operations to sync queue', () => {
    const operation = {
      type: 'create' as const,
      entity: 'task' as const,
      entityId: 'task1',
      data: { title: 'Test Task', description: 'Test Description' }
    }

    const operationId = offlineSyncService.addToSyncQueue(operation)
    expect(operationId).toBeDefined()
    expect(typeof operationId).toBe('string')
  })

  it('returns correct sync status', () => {
    const status = offlineSyncService.getSyncStatus()
    
    expect(status).toHaveProperty('isOnline')
    expect(status).toHaveProperty('lastSyncTimestamp')
    expect(status).toHaveProperty('pendingOperations')
    expect(status).toHaveProperty('failedOperations')
    expect(status).toHaveProperty('syncInProgress')
    
    expect(typeof status.isOnline).toBe('boolean')
    expect(typeof status.pendingOperations).toBe('number')
    expect(typeof status.failedOperations).toBe('number')
    expect(typeof status.syncInProgress).toBe('boolean')
  })

  it('clears failed operations', () => {
    // Add some operations first
    offlineSyncService.addToSyncQueue({
      type: 'create',
      entity: 'task',
      entityId: 'task1',
      data: {}
    })

    offlineSyncService.clearFailedOperations()
    
    const status = offlineSyncService.getSyncStatus()
    expect(status.failedOperations).toBe(0)
  })

  it('identifies offline mode correctly', () => {
    navigator.onLine = false
    expect(offlineSyncService.isOfflineMode()).toBe(true)
    
    navigator.onLine = true
    expect(offlineSyncService.isOfflineMode()).toBe(false)
  })

  it('checks for pending sync operations', () => {
    // Initially should have no pending operations
    expect(offlineSyncService.hasPendingSync()).toBe(false)
    
    // Add an operation
    offlineSyncService.addToSyncQueue({
      type: 'create',
      entity: 'task',
      entityId: 'task1',
      data: {}
    })
    
    // Now should have pending operations
    expect(offlineSyncService.hasPendingSync()).toBe(true)
  })

  it('handles force sync when online', async () => {
    navigator.onLine = true
    
    // Should not throw error when forcing sync online
    await expect(offlineSyncService.forceSync()).resolves.not.toThrow()
  })

  it('rejects force sync when offline', async () => {
    navigator.onLine = false
    
    // Should throw error when forcing sync offline
    await expect(offlineSyncService.forceSync()).rejects.toThrow('Cannot sync while offline')
  })

  it('provides detailed sync queue information', () => {
    // Add some operations
    offlineSyncService.addToSyncQueue({
      type: 'create',
      entity: 'task',
      entityId: 'task1',
      data: { title: 'Task 1' }
    })
    
    offlineSyncService.addToSyncQueue({
      type: 'update',
      entity: 'farm',
      entityId: 'farm1',
      data: { name: 'Updated Farm' }
    })
    
    const queueDetails = offlineSyncService.getSyncQueueDetails()
    expect(Array.isArray(queueDetails)).toBe(true)
    expect(queueDetails.length).toBeGreaterThan(0)
    
    if (queueDetails.length > 0) {
      const operation = queueDetails[0]
      expect(operation).toHaveProperty('id')
      expect(operation).toHaveProperty('type')
      expect(operation).toHaveProperty('entity')
      expect(operation).toHaveProperty('entityId')
      expect(operation).toHaveProperty('data')
      expect(operation).toHaveProperty('timestamp')
      expect(operation).toHaveProperty('retryCount')
      expect(operation).toHaveProperty('status')
    }
  })

  it('handles different entity types in sync queue', () => {
    const entities = ['farm', 'task', 'order', 'inventory', 'marketplace_item', 'user_profile'] as const
    
    entities.forEach((entity, index) => {
      offlineSyncService.addToSyncQueue({
        type: 'create',
        entity: entity,
        entityId: `${entity}${index}`,
        data: { test: true }
      })
    })
    
    const queueDetails = offlineSyncService.getSyncQueueDetails()
    expect(queueDetails.length).toBe(entities.length)
    
    entities.forEach((entity) => {
      const operationExists = queueDetails.some(op => op.entity === entity)
      expect(operationExists).toBe(true)
    })
  })

  it('handles different operation types in sync queue', () => {
    const operations = ['create', 'update', 'delete'] as const
    
    operations.forEach((opType, index) => {
      offlineSyncService.addToSyncQueue({
        type: opType,
        entity: 'task',
        entityId: `task${index}`,
        data: { test: true }
      })
    })
    
    const queueDetails = offlineSyncService.getSyncQueueDetails()
    expect(queueDetails.length).toBeGreaterThanOrEqual(operations.length)
    
    operations.forEach((opType) => {
      const operationExists = queueDetails.some(op => op.type === opType)
      expect(operationExists).toBe(true)
    })
  })

  it('sets up event listeners for online/offline events', () => {
    expect(mockAddEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(mockAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('tracks sync timestamps correctly', () => {
    const initialStatus = offlineSyncService.getSyncStatus()
    // Initially may or may not have a timestamp
    expect(initialStatus.lastSyncTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$|null/)
  })

  it('manages sync progress state', () => {
    const status = offlineSyncService.getSyncStatus()
    expect(typeof status.syncInProgress).toBe('boolean')
    expect(status.syncInProgress).toBe(false) // Should not be syncing initially
  })
})