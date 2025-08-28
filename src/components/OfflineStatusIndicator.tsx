import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { useOfflineSync } from '../services/OfflineSyncService';
import { formatDate } from '../utils/zambia-data';

interface OfflineStatusIndicatorProps {
  showDetails?: boolean;
  compact?: boolean;
}

export default function OfflineStatusIndicator({ showDetails = false, compact = false }: OfflineStatusIndicatorProps) {
  const { syncStatus, forceSync, clearFailedOperations, isOfflineMode, hasPendingSync } = useOfflineSync();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDetailedView, setShowDetailedView] = React.useState(false);

  const handleForceSync = async () => {
    if (syncStatus.isOnline && !syncStatus.syncInProgress) {
      setIsLoading(true);
      try {
        await forceSync();
      } catch (error) {
        console.error('Force sync failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearFailedOperations = () => {
    clearFailedOperations();
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return 'text-red-600 bg-red-100';
    if (syncStatus.failedOperations > 0) return 'text-orange-600 bg-orange-100';
    if (syncStatus.pendingOperations > 0) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return WifiOff;
    if (syncStatus.syncInProgress || isLoading) return RefreshCw;
    if (syncStatus.failedOperations > 0) return AlertTriangle;
    if (syncStatus.pendingOperations > 0) return Clock;
    return CheckCircle;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline';
    if (syncStatus.syncInProgress || isLoading) return 'Syncing...';
    if (syncStatus.failedOperations > 0) return `${syncStatus.failedOperations} failed`;
    if (syncStatus.pendingOperations > 0) return `${syncStatus.pendingOperations} pending`;
    return 'Synced';
  };

  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();
  const statusText = getStatusText();

  if (compact) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        <StatusIcon className={`h-3 w-3 mr-1 ${syncStatus.syncInProgress || isLoading ? 'animate-spin' : ''}`} />
        {statusText}
      </div>
    );
  }

  return (
    <>
      {/* Main Status Indicator */}
      <div 
        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${statusColor} hover:opacity-80`}
        onClick={() => setShowDetailedView(true)}
      >
        <StatusIcon className={`h-4 w-4 mr-2 ${syncStatus.syncInProgress || isLoading ? 'animate-spin' : ''}`} />
        <span>{statusText}</span>
        {hasPendingSync() && (
          <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-current animate-pulse" />
        )}
      </div>

      {/* Detailed Status Modal */}
      {showDetailedView && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDetailedView(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sync Status</h3>
                <button
                  onClick={() => setShowDetailedView(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {syncStatus.isOnline ? (
                      <Wifi className="h-5 w-5 text-green-600 mr-3" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-red-600 mr-3" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {syncStatus.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    syncStatus.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* Sync Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{syncStatus.pendingOperations}</div>
                    <div className="text-xs text-gray-600">Pending Sync</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{syncStatus.failedOperations}</div>
                    <div className="text-xs text-gray-600">Failed Sync</div>
                  </div>
                </div>

                {/* Last Sync Time */}
                {syncStatus.lastSyncTimestamp && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Last successful sync:</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(syncStatus.lastSyncTimestamp)}
                    </div>
                  </div>
                )}

                {/* Sync Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleForceSync}
                    disabled={!syncStatus.isOnline || syncStatus.syncInProgress || isLoading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Syncing...' : 'Force Sync'}
                  </button>

                  {syncStatus.failedOperations > 0 && (
                    <button
                      onClick={handleClearFailedOperations}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Failed
                    </button>
                  )}
                </div>

                {/* Offline Mode Info */}
                {!syncStatus.isOnline && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <WifiOff className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Offline Mode</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Changes will be saved locally and synced when you're back online.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sync in Progress */}
                {syncStatus.syncInProgress && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">Syncing Data</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Synchronizing your data with the server...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}