import React, { useState, useEffect } from 'react';
import { Plus, Package, Search, Filter, Edit, Trash2, AlertTriangle, TrendingDown, Calendar } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/zambia-data';

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const savedInventory = storage.get('inventory') || [];
    if (savedInventory.length === 0) {
      // Generate sample inventory
      const sampleInventory = [
        {
          id: '1',
          name: 'SC627 Maize Seed',
          type: 'seed',
          quantity: 150,
          unit: 'kg',
          cost: 45,
          totalValue: 6750,
          supplier: 'Zambia Seed Company',
          purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Main Store',
          minStockLevel: 50,
          status: 'in_stock',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Compound D Fertilizer',
          type: 'fertilizer',
          quantity: 20,
          unit: '50kg bags',
          cost: 280,
          totalValue: 5600,
          supplier: 'Agro Inputs Ltd',
          purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Fertilizer Store',
          minStockLevel: 10,
          status: 'in_stock',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Roundup Herbicide',
          type: 'pesticide',
          quantity: 5,
          unit: 'liters',
          cost: 120,
          totalValue: 600,
          supplier: 'Crop Protection Co.',
          purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Chemical Store',
          minStockLevel: 2,
          status: 'low_stock',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Irrigation Pipes',
          type: 'equipment',
          quantity: 100,
          unit: 'meters',
          cost: 25,
          totalValue: 2500,
          supplier: 'Farm Equipment Store',
          purchaseDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Equipment Shed',
          minStockLevel: 20,
          status: 'in_stock',
          createdAt: new Date().toISOString()
        }
      ];
      storage.set('inventory', sampleInventory);
      setInventory(sampleInventory);
    } else {
      setInventory(savedInventory);
    }
  }, []);

  useEffect(() => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, filterType, filterStatus]);

  const saveInventory = (updatedInventory: any[]) => {
    setInventory(updatedInventory);
    storage.set('inventory', updatedInventory);
  };

  const handleAddItem = (formData: any) => {
    const quantity = parseFloat(formData.quantity);
    const cost = parseFloat(formData.cost);
    
    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      quantity: quantity,
      unit: formData.unit,
      cost: cost,
      totalValue: quantity * cost,
      supplier: formData.supplier,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate || null,
      location: formData.location,
      minStockLevel: parseInt(formData.minStockLevel) || 0,
      status: quantity <= (parseInt(formData.minStockLevel) || 0) ? 'low_stock' : 'in_stock',
      createdAt: new Date().toISOString()
    };

    const updatedInventory = [...inventory, newItem];
    saveInventory(updatedInventory);
    setShowAddForm(false);
  };

  const handleEditItem = (formData: any) => {
    const quantity = parseFloat(formData.quantity);
    const cost = parseFloat(formData.cost);
    
    const updatedInventory = inventory.map(item =>
      item.id === editingItem.id
        ? {
            ...item,
            ...formData,
            quantity: quantity,
            cost: cost,
            totalValue: quantity * cost,
            status: quantity <= (parseInt(formData.minStockLevel) || 0) ? 'low_stock' : 'in_stock',
            updatedAt: new Date().toISOString()
          }
        : item
    );
    saveInventory(updatedInventory);
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      const updatedInventory = inventory.filter(item => item.id !== itemId);
      saveInventory(updatedInventory);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seed': return '🌱';
      case 'fertilizer': return '🧪';
      case 'pesticide': return '🐛';
      case 'equipment': return '🔧';
      default: return '📦';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.totalValue || 0), 0);
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  const expiredItems = inventory.filter(item => item.expiryDate && isExpired(item.expiryDate)).length;
  const expiringSoonItems = inventory.filter(item => item.expiryDate && isExpiringSoon(item.expiryDate)).length;

  const itemTypes = [
    { value: 'seed', label: 'Seeds' },
    { value: 'fertilizer', label: 'Fertilizers' },
    { value: 'pesticide', label: 'Pesticides' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage your farming inputs and equipment
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                  <dd className="text-lg font-medium text-gray-900">{inventory.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(totalValue)}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">{lowStockItems}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">{expiringSoonItems}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockItems > 0 || expiredItems > 0 || expiringSoonItems > 0) && (
        <div className="mt-6 space-y-3">
          {lowStockItems > 0 && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{lowStockItems} item(s) are running low on stock. Consider reordering soon.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {expiringSoonItems > 0 && (
            <div className="rounded-md bg-orange-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">Expiry Warning</h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>{expiringSoonItems} item(s) will expire within 30 days. Use them soon.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {expiredItems > 0 && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Expired Items</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{expiredItems} item(s) have expired and should be disposed of safely.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Search */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="all">All Types</option>
          {itemTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{filteredInventory.length} items</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getTypeIcon(item.type)}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.supplier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                    {item.quantity <= item.minStockLevel && (
                      <div className="text-xs text-yellow-600">Below minimum ({item.minStockLevel})</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(item.totalValue)}</div>
                    <div className="text-xs text-gray-500">{formatCurrency(item.cost)}/{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.expiryDate ? (
                      <div>
                        <div className={`text-sm ${
                          isExpired(item.expiryDate) ? 'text-red-600' :
                          isExpiringSoon(item.expiryDate) ? 'text-orange-600' :
                          'text-gray-900'
                        }`}>
                          {formatDate(item.expiryDate)}
                        </div>
                        {isExpired(item.expiryDate) && (
                          <div className="text-xs text-red-600">Expired</div>
                        )}
                        {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                          <div className="text-xs text-orange-600">Expiring soon</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No expiry</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first inventory item.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = Object.fromEntries(formData);
                if (editingItem) {
                  handleEditItem(data);
                } else {
                  handleAddItem(data);
                }
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Item Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={editingItem?.name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter item name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          name="type"
                          required
                          defaultValue={editingItem?.type || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Type</option>
                          {itemTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <input
                          type="text"
                          name="unit"
                          required
                          defaultValue={editingItem?.unit || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="kg, liters, bags, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          step="0.01"
                          required
                          defaultValue={editingItem?.quantity || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cost per Unit (ZMW)</label>
                        <input
                          type="number"
                          name="cost"
                          step="0.01"
                          required
                          defaultValue={editingItem?.cost || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Supplier</label>
                      <input
                        type="text"
                        name="supplier"
                        defaultValue={editingItem?.supplier || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter supplier name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Storage Location</label>
                      <input
                        type="text"
                        name="location"
                        defaultValue={editingItem?.location || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter storage location"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                        <input
                          type="date"
                          name="purchaseDate"
                          required
                          defaultValue={editingItem?.purchaseDate ? editingItem.purchaseDate.split('T')[0] : ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                        <input
                          type="date"
                          name="expiryDate"
                          defaultValue={editingItem?.expiryDate ? editingItem.expiryDate.split('T')[0] : ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Stock Level</label>
                      <input
                        type="number"
                        name="minStockLevel"
                        min="0"
                        defaultValue={editingItem?.minStockLevel || 0}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Alert when stock falls below this level"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}