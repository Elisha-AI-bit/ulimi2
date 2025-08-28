// Offline Synchronization Service for handling data sync when online/offline
import React from 'react';
import { storage } from '../utils/storage';

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'farm' | 'task' | 'order' | 'inventory' | 'marketplace_item' | 'user_profile';
  entityId: string;
  data: any;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTimestamp: string | null;
  pendingOperations: number;
  failedOperations: number;
  syncInProgress: boolean;
}

class OfflineSyncService {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private syncQueue: SyncOperation[] = [];
  private maxRetries: number = 3;
  private syncInterval: number = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // Load existing sync queue from storage
    this.syncQueue = storage.getSyncQueue() || [];
    
    // Set up online/offline event listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Start automatic sync if online
    if (this.isOnline) {
      this.startPeriodicSync();
    }
  }

  private handleOnline() {
    console.log('Application is back online');
    this.isOnline = true;
    this.startPeriodicSync();
    this.syncPendingOperations();
  }

  private handleOffline() {
    console.log('Application is offline');
    this.isOnline = false;
    this.stopPeriodicSync();
  }

  private startPeriodicSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncPendingOperations();
      }
    }, this.syncInterval);
  }

  private stopPeriodicSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Add operation to sync queue
  public addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>) {
    const syncOperation: SyncOperation = {
      ...operation,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending'
    };

    this.syncQueue.push(syncOperation);
    this.saveSyncQueue();

    // If online, attempt immediate sync
    if (this.isOnline && !this.syncInProgress) {
      this.syncPendingOperations();
    }

    return syncOperation.id;
  }

  // Sync all pending operations
  public async syncPendingOperations(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      const pendingOps = this.syncQueue.filter(op => op.status === 'pending' || op.status === 'failed');
      
      for (const operation of pendingOps) {
        try {
          operation.status = 'syncing';
          this.saveSyncQueue();

          await this.syncOperation(operation);
          
          operation.status = 'completed';
          operation.retryCount = 0;
          
        } catch (error) {
          console.error(`Sync failed for operation ${operation.id}:`, error);
          operation.retryCount++;
          
          if (operation.retryCount >= this.maxRetries) {
            operation.status = 'failed';
            console.error(`Operation ${operation.id} failed after ${this.maxRetries} retries`);
          } else {
            operation.status = 'pending';
          }
        }
      }

      // Remove completed operations
      this.syncQueue = this.syncQueue.filter(op => op.status !== 'completed');
      this.saveSyncQueue();

      // Update last sync timestamp
      storage.set('last_sync_timestamp', new Date().toISOString());

    } finally {
      this.syncInProgress = false;
    }
  }

  // Simulate API sync for individual operation
  private async syncOperation(operation: SyncOperation): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) { // 10% failure rate for simulation
      throw new Error('Network error during sync');
    }

    // In a real implementation, this would make actual API calls
    console.log(`Syncing ${operation.type} operation for ${operation.entity}:`, operation.data);
    
    // Update local data based on sync result if needed
    switch (operation.entity) {
      case 'farm':
        this.updateLocalFarmData(operation);
        break;
      case 'task':
        this.updateLocalTaskData(operation);
        break;
      case 'order':
        this.updateLocalOrderData(operation);
        break;
      case 'marketplace_item':
        this.updateLocalMarketplaceData(operation);
        break;
      default:
        break;
    }
  }

  private updateLocalFarmData(operation: SyncOperation) {
    const farms = storage.getFarms();
    
    switch (operation.type) {
      case 'create':
        // Farm creation should already be in local storage, just mark as synced
        const farmIndex = farms.findIndex(f => f.id === operation.entityId);
        if (farmIndex >= 0) {
          farms[farmIndex].synced = true;
          farms[farmIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'update':
        const updateIndex = farms.findIndex(f => f.id === operation.entityId);
        if (updateIndex >= 0) {
          farms[updateIndex] = { ...farms[updateIndex], ...operation.data };
          farms[updateIndex].synced = true;
          farms[updateIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'delete':
        const deleteIndex = farms.findIndex(f => f.id === operation.entityId);
        if (deleteIndex >= 0) {
          farms.splice(deleteIndex, 1);
        }
        break;
    }
    
    storage.saveFarms(farms);
  }

  private updateLocalTaskData(operation: SyncOperation) {
    const tasks = storage.getTasks();
    
    switch (operation.type) {
      case 'create':
        const taskIndex = tasks.findIndex(t => t.id === operation.entityId);
        if (taskIndex >= 0) {
          tasks[taskIndex].synced = true;
          tasks[taskIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'update':
        const updateIndex = tasks.findIndex(t => t.id === operation.entityId);
        if (updateIndex >= 0) {
          tasks[updateIndex] = { ...tasks[updateIndex], ...operation.data };
          tasks[updateIndex].synced = true;
          tasks[updateIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'delete':
        const deleteIndex = tasks.findIndex(t => t.id === operation.entityId);
        if (deleteIndex >= 0) {
          tasks.splice(deleteIndex, 1);
        }
        break;
    }
    
    storage.saveTasks(tasks);
  }

  private updateLocalOrderData(operation: SyncOperation) {
    const orders = storage.getOrders();
    
    switch (operation.type) {
      case 'create':
        const orderIndex = orders.findIndex(o => o.id === operation.entityId);
        if (orderIndex >= 0) {
          orders[orderIndex].synced = true;
          orders[orderIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'update':
        const updateIndex = orders.findIndex(o => o.id === operation.entityId);
        if (updateIndex >= 0) {
          orders[updateIndex] = { ...orders[updateIndex], ...operation.data };
          orders[updateIndex].synced = true;
          orders[updateIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'delete':
        const deleteIndex = orders.findIndex(o => o.id === operation.entityId);
        if (deleteIndex >= 0) {
          orders.splice(deleteIndex, 1);
        }
        break;
    }
    
    storage.saveOrders(orders);
  }

  private updateLocalMarketplaceData(operation: SyncOperation) {
    const items = storage.getMarketplaceItems();
    
    switch (operation.type) {
      case 'create':
        const itemIndex = items.findIndex(i => i.id === operation.entityId);
        if (itemIndex >= 0) {
          items[itemIndex].synced = true;
          items[itemIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'update':
        const updateIndex = items.findIndex(i => i.id === operation.entityId);
        if (updateIndex >= 0) {
          items[updateIndex] = { ...items[updateIndex], ...operation.data };
          items[updateIndex].synced = true;
          items[updateIndex].lastSyncAt = new Date().toISOString();
        }
        break;
      case 'delete':
        const deleteIndex = items.findIndex(i => i.id === operation.entityId);
        if (deleteIndex >= 0) {
          items.splice(deleteIndex, 1);
        }
        break;
    }
    
    storage.saveMarketplaceItems(items);
  }

  private saveSyncQueue() {
    storage.set('sync_queue', this.syncQueue);
  }

  // Get current sync status
  public getSyncStatus(): SyncStatus {
    const pendingOps = this.syncQueue.filter(op => op.status === 'pending').length;
    const failedOps = this.syncQueue.filter(op => op.status === 'failed').length;
    const lastSyncTimestamp = storage.get<string>('last_sync_timestamp');

    return {
      isOnline: this.isOnline,
      lastSyncTimestamp,
      pendingOperations: pendingOps,
      failedOperations: failedOps,
      syncInProgress: this.syncInProgress
    };
  }

  // Force manual sync
  public async forceSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncPendingOperations();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }

  // Clear all failed operations
  public clearFailedOperations(): void {
    this.syncQueue = this.syncQueue.filter(op => op.status !== 'failed');
    this.saveSyncQueue();
  }

  // Get detailed sync queue information
  public getSyncQueueDetails(): SyncOperation[] {
    return [...this.syncQueue];
  }

  // Helper methods for components to use
  public isOfflineMode(): boolean {
    return !this.isOnline;
  }

  public hasPendingSync(): boolean {
    return this.syncQueue.some(op => op.status === 'pending' || op.status === 'failed');
  }

  // Clean up resources
  public destroy(): void {
    this.stopPeriodicSync();
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
  }
}

// Create and export singleton instance
export const offlineSyncService = new OfflineSyncService();

// Helper hooks for React components
export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = React.useState<SyncStatus>(offlineSyncService.getSyncStatus());

  React.useEffect(() => {
    const updateStatus = () => {
      setSyncStatus(offlineSyncService.getSyncStatus());
    };

    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    syncStatus,
    forceSync: () => offlineSyncService.forceSync(),
    addToSyncQueue: (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>) => 
      offlineSyncService.addToSyncQueue(operation),
    clearFailedOperations: () => offlineSyncService.clearFailedOperations(),
    isOfflineMode: () => offlineSyncService.isOfflineMode(),
    hasPendingSync: () => offlineSyncService.hasPendingSync()
  };
};