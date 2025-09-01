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
  private onlineHandler: () => void;
  private offlineHandler: () => void;

  constructor() {
    this.onlineHandler = () => this.handleOnline();
    this.offlineHandler = () => this.handleOffline();
    this.initializeService();
  }

  private async initializeService() {
    // Load existing sync queue from storage
    try {
      const queue = await storage.getSyncQueue();
      this.syncQueue = Array.isArray(queue) ? queue : [];
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
    
    // Set up online/offline event listeners
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
    
    // Start automatic sync if online
    if (this.isOnline) {
      this.startPeriodicSync();
    }
  }

  private async handleOnline() {
    console.log('Application is back online');
    this.isOnline = true;
    this.startPeriodicSync();
    this.syncPendingOperations();
  }

  private async handleOffline() {
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
        await this.updateLocalFarmData(operation);
        break;
      case 'task':
        await this.updateLocalTaskData(operation);
        break;
      case 'order':
        await this.updateLocalOrderData(operation);
        break;
      case 'marketplace_item':
        await this.updateLocalMarketplaceData(operation);
        break;
      default:
        break;
    }
  }

  private async updateLocalFarmData(operation: SyncOperation) {
    const farms = await storage.getFarms('default-user-id'); // TODO: Get actual user ID
    
    switch (operation.type) {
      case 'create':
        // Farm creation should already be in local storage, just log that it's synced
        const farmIndex = farms.findIndex(f => f.id === operation.entityId);
        if (farmIndex >= 0) {
          console.log(`Farm ${operation.entityId} marked as synced`);
        }
        break;
      case 'update':
        const updateIndex = farms.findIndex(f => f.id === operation.entityId);
        if (updateIndex >= 0) {
          farms[updateIndex] = { ...farms[updateIndex], ...operation.data };
          console.log(`Farm ${operation.entityId} updated and marked as synced`);
        }
        break;
      case 'delete':
        const deleteIndex = farms.findIndex(f => f.id === operation.entityId);
        if (deleteIndex >= 0) {
          farms.splice(deleteIndex, 1);
          console.log(`Farm ${operation.entityId} deleted`);
        }
        break;
    }
    
    storage.saveFarms(farms);
  }

  private async updateLocalTaskData(operation: SyncOperation) {
    const tasks = await storage.getTasks('default-farm-id'); // TODO: Get actual farm ID
    
    switch (operation.type) {
      case 'create':
        const taskIndex = tasks.findIndex(t => t.id === operation.entityId);
        if (taskIndex >= 0) {
          console.log(`Task ${operation.entityId} marked as synced`);
        }
        break;
      case 'update':
        const updateIndex = tasks.findIndex(t => t.id === operation.entityId);
        if (updateIndex >= 0) {
          tasks[updateIndex] = { ...tasks[updateIndex], ...operation.data };
          console.log(`Task ${operation.entityId} updated and marked as synced`);
        }
        break;
      case 'delete':
        const deleteIndex = tasks.findIndex(t => t.id === operation.entityId);
        if (deleteIndex >= 0) {
          tasks.splice(deleteIndex, 1);
          console.log(`Task ${operation.entityId} deleted`);
        }
        break;
    }
    
    storage.saveTasks(tasks);
  }

  private async updateLocalOrderData(operation: SyncOperation) {
    const orders = await storage.getOrders('default-user-id'); // TODO: Get actual user ID
    
    switch (operation.type) {
      case 'create':
        const orderIndex = orders.findIndex(o => o.id === operation.entityId);
        if (orderIndex >= 0) {
          console.log(`Order ${operation.entityId} marked as synced`);
        }
        break;
      case 'update':
        const updateIndex = orders.findIndex(o => o.id === operation.entityId);
        if (updateIndex >= 0) {
          orders[updateIndex] = { ...orders[updateIndex], ...operation.data };
          console.log(`Order ${operation.entityId} updated and marked as synced`);
        }
        break;
      case 'delete':
        const deleteIndex = orders.findIndex(o => o.id === operation.entityId);
        if (deleteIndex >= 0) {
          orders.splice(deleteIndex, 1);
          console.log(`Order ${operation.entityId} deleted`);
        }
        break;
    }
    
    storage.saveOrders(orders);
  }

  private async updateLocalMarketplaceData(operation: SyncOperation) {
    const items = await storage.getMarketplaceItems();
    
    switch (operation.type) {
      case 'create':
        const itemIndex = items.findIndex(i => i.id === operation.entityId);
        if (itemIndex >= 0) {
          console.log(`Marketplace item ${operation.entityId} marked as synced`);
        }
        break;
      case 'update':
        const updateIndex = items.findIndex(i => i.id === operation.entityId);
        if (updateIndex >= 0) {
          items[updateIndex] = { ...items[updateIndex], ...operation.data };
          console.log(`Marketplace item ${operation.entityId} updated and marked as synced`);
        }
        break;
      case 'delete':
        const deleteIndex = items.findIndex(i => i.id === operation.entityId);
        if (deleteIndex >= 0) {
          items.splice(deleteIndex, 1);
          console.log(`Marketplace item ${operation.entityId} deleted`);
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
    window.removeEventListener('online', this.onlineHandler);
    window.removeEventListener('offline', this.offlineHandler);
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