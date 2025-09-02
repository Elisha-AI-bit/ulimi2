import React, { useState, useEffect } from 'react';
import { Plus, Package, AlertTriangle, Search, Filter, Edit, Trash2, Eye, TrendingDown, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';
import { InventoryItem, InventoryTransaction, InventoryAlert } from '../types';

export default function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'transactions' | 'alerts' | 'analytics'>('inventory');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeSampleData();
  }, []);

  useEffect(() => {
    let filtered = inventoryItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredItems(filtered);
  }, [inventoryItems, searchTerm, filterCategory, filterStatus]);

  const initializeSampleData = () => {
    const sampleItems: InventoryItem[] = [
      {
        id: 'inv1',
        farmId: 'farm1',
        category: 'inputs',
        subcategory: 'fertilizer',
        name: 'NPK Compound D',
        description: 'Balanced fertilizer for crop production',
        brand: 'AgriCorp',
        quantity: {
          current: 45,
          reserved: 5,
          available: 40,
          unit: 'bags',
          minimumStock: 10,
          maximumStock: 100
        },
        cost: {
          unitCost: 175.00,
          totalValue: 7875.00,
          currency: 'ZMW',
          lastPurchasePrice: 170.00,
          averageCost: 172.50
        },
        supplier: {
          name: 'Agricultural Supplies Ltd',
          contact: '+260-97-123-4567'
        },
        location: {
          warehouse: 'Main Storage',
          section: 'Fertilizers',
          shelf: 'A-2'
        },
        dates: {
          purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString()
        },
        condition: 'good',
        status: 'active',
        tracking: {
          batchNumbers: ['NPK-2024-001', 'NPK-2024-002']
        },
        usage: {
          applicableCrops: ['Maize', 'Soybeans', 'Wheat'],
          applicationRate: 200,
          applicationUnit: 'kg/ha',
          safetyInstructions: ['Wear protective gear', 'Store in dry place'],
          storageRequirements: ['Keep dry', 'Avoid direct sunlight']
        },
        alerts: [],
        transactions: [],
        tags: ['fertilizer', 'NPK', 'essential'],
        photos: [],
        documents: [],
        createdBy: 'Farm Manager',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv2',
        farmId: 'farm1',
        category: 'tools',
        subcategory: 'hand tools',
        name: 'Hand Hoes',
        description: 'Traditional farming hoes for manual cultivation',
        quantity: {
          current: 8,
          reserved: 2,
          available: 6,
          unit: 'pieces',
          minimumStock: 5,
          maximumStock: 20
        },
        cost: {
          unitCost: 35.00,
          totalValue: 280.00,
          currency: 'ZMW'
        },
        supplier: {
          name: 'Local Hardware Store'
        },
        location: {
          warehouse: 'Tool Shed',
          section: 'Hand Tools'
        },
        dates: {
          purchaseDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        condition: 'good',
        status: 'active',
        tracking: {},
        usage: {
          applicableCrops: ['All crops'],
          safetyInstructions: ['Handle with care', 'Keep sharp']
        },
        alerts: [],
        transactions: [],
        tags: ['tools', 'manual', 'cultivation'],
        photos: [],
        documents: [],
        createdBy: 'Farm Manager',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'inv3',
        farmId: 'farm1',
        category: 'inputs',
        subcategory: 'seeds',
        name: 'Maize Seeds SC627',
        description: 'Hybrid maize variety with high yield potential',
        brand: 'SeedCo',
        quantity: {
          current: 3,
          reserved: 0,
          available: 3,
          unit: 'kg',
          minimumStock: 5,
          maximumStock: 25
        },
        cost: {
          unitCost: 450.00,
          totalValue: 1350.00,
          currency: 'ZMW'
        },
        supplier: {
          name: 'SeedCo Zambia',
          contact: '+260-21-123-4567'
        },
        location: {
          warehouse: 'Cold Storage',
          section: 'Seeds'
        },
        dates: {
          purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        condition: 'new',
        status: 'active',
        tracking: {
          batchNumbers: ['SC627-2024-H1']
        },
        usage: {
          applicableCrops: ['Maize'],
          applicationRate: 25,
          applicationUnit: 'kg/ha',
          storageRequirements: ['Cool dry place', 'Temperature 15-20°C']
        },
        alerts: [
          {
            id: 'alert1',
            type: 'low_stock',
            severity: 'medium',
            message: 'Stock below minimum threshold',
            triggeredDate: new Date().toISOString(),
            actions: ['Reorder stock', 'Check with supplier'],
            status: 'active'
          }
        ],
        transactions: [],
        tags: ['seeds', 'maize', 'hybrid'],
        photos: [],
        documents: [],
        createdBy: 'Farm Manager',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setInventoryItems(sampleItems);
    
    // Consolidate all alerts
    const allAlerts = sampleItems.flatMap(item => 
      item.alerts.map(alert => ({ ...alert, itemId: item.id, itemName: item.name }))
    );
    setAlerts(allAlerts);
  };

  const handleAddItem = (formData: any) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      farmId: 'farm1',
      category: formData.category,
      subcategory: formData.subcategory || 'general',
      name: formData.name,
      description: formData.description,
      brand: formData.brand,
      quantity: {
        current: parseFloat(formData.quantity),
        reserved: 0,
        available: parseFloat(formData.quantity),
        unit: formData.unit,
        minimumStock: parseFloat(formData.minimumStock) || 0,
        maximumStock: parseFloat(formData.maximumStock) || undefined
      },
      cost: {
        unitCost: parseFloat(formData.unitCost),
        totalValue: parseFloat(formData.quantity) * parseFloat(formData.unitCost),
        currency: 'ZMW'
      },
      supplier: {
        name: formData.supplierName
      },
      location: {
        warehouse: formData.warehouse,
        section: formData.section
      },
      dates: {
        purchaseDate: formData.purchaseDate,
        expiryDate: formData.expiryDate || undefined
      },
      condition: formData.condition || 'new',
      status: 'active',
      tracking: {},
      usage: {
        applicableCrops: formData.applicableCrops ? formData.applicableCrops.split(',') : []
      },
      alerts: [],
      transactions: [],
      tags: formData.tags ? formData.tags.split(',') : [],
      photos: [],
      documents: [],
      createdBy: storage.getUser()?.name || 'User',
      createdAt: new Date().toISOString()
    };

    setInventoryItems(prev => [...prev, newItem]);
    setShowAddForm(false);
  };

  const handleTransaction = (formData: any) => {
    const transaction: InventoryTransaction = {
      id: Date.now().toString(),
      itemId: formData.itemId,
      type: formData.type,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      reason: formData.reason,
      reference: formData.reference,
      cost: parseFloat(formData.cost) || 0,
      performedBy: storage.getUser()?.name || 'User',
      date: formData.date,
      notes: formData.notes
    };

    // Update item quantity based on transaction type
    setInventoryItems(prev => prev.map(item => {
      if (item.id === formData.itemId) {
        let newQuantity = item.quantity.current;
        
        switch (formData.type) {
          case 'purchase':
            newQuantity += transaction.quantity;
            break;
          case 'usage':
          case 'disposal':
            newQuantity -= transaction.quantity;
            break;
          case 'adjustment':
            newQuantity = transaction.quantity;
            break;
        }

        return {
          ...item,
          quantity: {
            ...item.quantity,
            current: Math.max(0, newQuantity),
            available: Math.max(0, newQuantity - item.quantity.reserved)
          },
          transactions: [...item.transactions, transaction],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    setTransactions(prev => [...prev, transaction]);
    setShowTransactionForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevelIndicator = (item: InventoryItem) => {
    const { current, minimumStock } = item.quantity;
    if (current <= minimumStock) {
      return { color: 'text-red-600', icon: TrendingDown, label: 'Low Stock' };
    } else if (current <= minimumStock * 1.5) {
      return { color: 'text-yellow-600', icon: TrendingDown, label: 'Medium Stock' };
    } else {
      return { color: 'text-green-600', icon: TrendingUp, label: 'Good Stock' };
    }
  };

  const calculateAnalytics = () => {
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.cost.totalValue, 0);
    const lowStockItems = inventoryItems.filter(item => 
      item.quantity.current <= item.quantity.minimumStock
    ).length;
    const expiringItems = inventoryItems.filter(item => {
      if (!item.dates.expiryDate) return false;
      const daysUntilExpiry = Math.floor((new Date(item.dates.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30;
    }).length;
    const activeAlerts = alerts.filter(alert => alert.status === 'active').length;

    return { totalValue, lowStockItems, expiringItems, activeAlerts };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage farm inputs, equipment, and supplies
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {activeTab === 'inventory' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          )}
          {activeTab === 'transactions' && (
            <button
              onClick={() => setShowTransactionForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Transaction
            </button>
          )}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                  <dd className="text-lg font-medium text-gray-900">{inventoryItems.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                  <dd className="text-lg font-medium text-gray-900">ZMW {analytics.totalValue.toFixed(0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.lowStockItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Expiring Soon</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.expiringItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'inventory', label: 'Inventory', icon: Package },
            { key: 'transactions', label: 'Transactions', icon: TrendingUp },
            { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
            { key: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 inline mr-2" />
              {label}
              {key === 'alerts' && analytics.activeAlerts > 0 && (
                <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  {analytics.activeAlerts}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'inventory' && (
          <div>
            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="inputs">Inputs</option>
                <option value="equipment">Equipment</option>
                <option value="tools">Tools</option>
                <option value="consumables">Consumables</option>
                <option value="produce">Produce</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="damaged">Damaged</option>
                <option value="expired">Expired</option>
              </select>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{filteredItems.length} items</span>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const stockIndicator = getStockLevelIndicator(item);
                const StockIcon = stockIndicator.icon;
                
                return (
                  <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                      )}
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Stock Level:</span>
                          <div className="flex items-center">
                            <StockIcon className={`h-4 w-4 mr-1 ${stockIndicator.color}`} />
                            <span className={`text-sm ${stockIndicator.color}`}>
                              {item.quantity.current} {item.quantity.unit}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Category:</span>
                          <span className="text-sm font-medium text-gray-900 capitalize">{item.category}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Value:</span>
                          <span className="text-sm font-medium text-gray-900">ZMW {item.cost.totalValue.toFixed(0)}</span>
                        </div>
                        
                        {item.location.warehouse && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Location:</span>
                            <span className="text-sm text-gray-900">{item.location.warehouse}</span>
                          </div>
                        )}
                      </div>

                      {item.alerts.length > 0 && (
                        <div className="mt-4 p-2 bg-yellow-50 rounded-md">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800">{item.alerts.length} alert(s)</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-sm text-green-600 hover:text-green-500"
                        >
                          <Eye className="h-4 w-4 inline mr-1" />
                          View Details
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          <Edit className="h-4 w-4 inline mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first inventory item.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.filter(alert => alert.status === 'active').map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-400' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-400' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{alert.message}</h4>
                      <p className="text-sm text-gray-600">Item: {(alert as any).itemName}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Actions: {alert.actions.join(', ')}</p>
                  <p className="text-sm text-gray-500">Triggered: {formatDate(alert.triggeredDate)}</p>
                </div>
              </div>
            ))}

            {alerts.filter(alert => alert.status === 'active').length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active alerts</h3>
                <p className="mt-1 text-sm text-gray-500">All inventory items are within normal parameters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}