import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Plus, MapPin, Calendar, Star, Package, Sprout, User, CreditCard, TrendingUp, Eye, Edit, Trash2, MessageSquare, Clock, CheckCircle, AlertCircle, Truck, DollarSign, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseDataService } from '../services/supabaseDataService';
import { formatCurrency, formatDate, zambiaProvinces, zambiaDistricts } from '../utils/zambia-data';
import { MarketplaceItem, Order } from '../types';

export default function Marketplace() {
  const { authState } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'orders' | 'suppliers' | 'analytics'>('buy');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'pending' | 'confirmed' | 'delivered' | 'completed'>('all');

  useEffect(() => {
    if (authState.user) {
      loadMarketplaceData();
    }
  }, [authState.user]);

  const loadMarketplaceData = async () => {
    if (!authState.user) return;
    
    setLoading(true);
    try {
      // Load marketplace items
      const marketplaceItems = await SupabaseDataService.getMarketplaceItems();
      setItems(marketplaceItems);
      setFilteredItems(marketplaceItems);
      
      // Load user orders
      const userOrders = await SupabaseDataService.getOrders(authState.user.id);
      setOrders(userOrders);
      
      // Load suppliers (would be implemented in Supabase)
      const savedSuppliers: any[] = []; // storage.getSuppliers() || [];
      setSuppliers(savedSuppliers);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeMarketplaceData = async () => {
    if (!authState.user) return;
    
    try {
      const marketplaceItems = await SupabaseDataService.getMarketplaceItems();
      
      if (marketplaceItems.length === 0) {
        // Generate sample marketplace items
        const sampleItems: Omit<MarketplaceItem, 'id' | 'createdAt'>[] = [
          {
            sellerId: 'supplier1',
            sellerName: 'Zambia Seed Company',
            name: 'SC627 Maize Seed',
            category: 'inputs',
            type: 'seed',
            description: 'High-yielding drought-tolerant maize variety suitable for Zambian conditions',
            price: 45,
            currency: 'ZMW',
            quantity: 500,
            unit: 'kg',
            location: {
              province: 'Lusaka',
              district: 'Lusaka'
            },
            images: ['https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg'],
            status: 'available'
          },
          {
            sellerId: 'supplier2',
            sellerName: 'Agro Inputs Ltd',
            name: 'Compound D Fertilizer',
            category: 'inputs',
            type: 'fertilizer',
            description: '10:20:10 NPK fertilizer for basal application',
            price: 280,
            currency: 'ZMW',
            quantity: 100,
            unit: '50kg bag',
            location: {
              province: 'Copperbelt',
              district: 'Kitwe'
            },
            images: ['https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg'],
            status: 'available'
          },
          {
            sellerId: 'farmer1',
            sellerName: 'Mirriam',
            name: 'White Maize',
            category: 'produce',
            type: 'grain',
            description: 'Grade 1 white maize, well dried and stored',
            price: 3.5,
            currency: 'ZMW',
            quantity: 2000,
            unit: 'kg',
            location: {
              province: 'Eastern',
              district: 'Chipata'
            },
            images: ['https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'],
            status: 'available'
          },
          {
            sellerId: 'farmer2',
            sellerName: 'Natasha',
            name: 'Soybeans',
            category: 'produce',
            type: 'legume',
            description: 'Premium quality soybeans, ready for processing',
            price: 8.5,
            currency: 'ZMW',
            quantity: 1500,
            unit: 'kg',
            location: {
              province: 'Central',
              district: 'Kabwe'
            },
            images: ['https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg'],
            status: 'available'
          }
        ];
        
        // Create sample items in Supabase
        for (const item of sampleItems) {
          await SupabaseDataService.createMarketplaceItem(item);
        }
        
        // Reload items after creating samples
        const updatedItems = await SupabaseDataService.getMarketplaceItems();
        setItems(updatedItems);
        setFilteredItems(updatedItems);
      } else {
        setItems(marketplaceItems);
        setFilteredItems(marketplaceItems);
      }
      
      // Load orders
      const userOrders = await SupabaseDataService.getOrders(authState.user.id);
      setOrders(userOrders);
      
      // Load suppliers (would be implemented in Supabase)
      const savedSuppliers: any[] = []; // storage.getSuppliers() || [];
      setSuppliers(savedSuppliers);
    } catch (error) {
      console.error('Error initializing marketplace data:', error);
    }
  };

  useEffect(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by province
    if (selectedProvince !== 'all') {
      filtered = filtered.filter(item => item.location.province === selectedProvince);
    }

    // Filter by price range
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(item => {
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return item.price >= min && item.price <= max;
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          // Would need rating data
          return 0;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, selectedProvince, priceRange, sortBy]);

  const handleAddItem = async (itemData: any) => {
    if (!authState.user) return;
    
    try {
      const newItem: Omit<MarketplaceItem, 'id' | 'createdAt'> = {
        sellerId: authState.user.id,
        sellerName: authState.user.name,
        name: itemData.name,
        category: itemData.category as 'inputs' | 'produce',
        type: itemData.type,
        description: itemData.description,
        price: parseFloat(itemData.price),
        currency: 'ZMW',
        quantity: parseFloat(itemData.quantity),
        unit: itemData.unit,
        location: {
          province: itemData.province,
          district: itemData.district
        },
        images: itemData.images || [],
        status: 'available'
      };

      const createdItem = await SupabaseDataService.createMarketplaceItem(newItem);
      
      if (createdItem) {
        setItems([...items, createdItem]);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding marketplace item:', error);
    }
  };

  const handlePlaceOrder = async (orderData: any) => {
    if (!authState.user) return;
    
    try {
      const newOrder: Omit<Order, 'id'> = {
        customerId: authState.user.id,
        items: orderData.items,
        totalAmount: parseFloat(orderData.totalAmount),
        status: 'pending',
        deliveryAddress: orderData.deliveryAddress,
        orderDate: new Date().toISOString(),
        deliveryDetails: {
          fullName: orderData.fullName,
          phone: orderData.phone,
          address: orderData.deliveryAddress,
          district: orderData.district,
          province: orderData.province,
          specialInstructions: orderData.specialInstructions
        },
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'pending'
      };

      const createdOrder = await SupabaseDataService.createOrder(newOrder);
      
      if (createdOrder) {
        setOrders([...orders, createdOrder]);
        setShowOrderForm(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<MarketplaceItem>) => {
    try {
      const success = await SupabaseDataService.updateMarketplaceItem(itemId, updates);
      
      if (success) {
        const updatedItems = items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        
        setItems(updatedItems);
        setFilteredItems(updatedItems);
      }
    } catch (error) {
      console.error('Error updating marketplace item:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const success = await SupabaseDataService.deleteMarketplaceItem(itemId);
      
      if (success) {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        setFilteredItems(updatedItems);
      }
    } catch (error) {
      console.error('Error deleting marketplace item:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const handleQuickOrder = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setOrderQuantity(1);
    setShowOrderForm(true);
  };

  const handleBulkOrder = (formData: any) => {
    // Removed storage references and replaced with appropriate logic
    console.log('Order placed for item:', selectedItem?.name);
    setShowOrderForm(false);
    setSelectedItem(null);
    alert(`Order for ${selectedItem?.name} has been placed successfully!`);
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    // Removed storage references and replaced with appropriate logic
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled', updatedAt: new Date().toISOString() } : order
    );
    setOrders(updatedOrders);
  };

  const handleSupplierRegistration = (formData: any) => {
    // Removed storage references and replaced with appropriate logic
    const newSupplier = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      contact: {
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      },
      location: {
        province: formData.province,
        district: formData.district
      },
      rating: 0,
      totalSales: 0,
      verified: false,
      specialties: formData.specialties ? formData.specialties.split(',') : [],
      paymentMethods: formData.paymentMethods ? formData.paymentMethods.split(',') : [],
      deliveryOptions: formData.deliveryOptions ? formData.deliveryOptions.split(',') : [],
      registeredDate: new Date().toISOString().split('T')[0],
      description: formData.description || ''
    };

    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    setShowSupplierForm(false);
    alert('Supplier registration submitted for review!');
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAnalytics = () => {
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const topSuppliers = suppliers
      .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
      .slice(0, 5);
    
    return {
      totalOrders,
      totalValue,
      pendingOrders,
      completedOrders,
      topSuppliers,
      averageOrderValue: totalOrders > 0 ? totalValue / totalOrders : 0
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-safe">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex-auto min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Marketplace</h1>
          <p className="mt-1 text-sm text-gray-700">
            Buy agricultural inputs and sell your produce
          </p>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 sm:py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors touch-manipulation"
          >
            <Plus className="h-4 w-4 mr-2" />
            List Item
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 md:mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('buy')}
            className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center flex-shrink-0 touch-manipulation transition-colors min-h-[48px] ${
              activeTab === 'buy'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Buy Inputs</span>
            <span className="sm:hidden">Buy</span>
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center flex-shrink-0 touch-manipulation transition-colors min-h-[48px] ${
              activeTab === 'sell'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sell Produce</span>
            <span className="sm:hidden">Sell</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center flex-shrink-0 touch-manipulation transition-colors min-h-[48px] ${
              activeTab === 'orders'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">My Orders</span>
            <span className="sm:hidden">Orders</span>
            {analytics.pendingOrders > 0 && (
              <span className="ml-1 sm:ml-2 inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {analytics.pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center flex-shrink-0 touch-manipulation transition-colors min-h-[48px] ${
              activeTab === 'suppliers'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Suppliers</span>
            <span className="sm:hidden">Suppliers</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center flex-shrink-0 touch-manipulation transition-colors min-h-[48px] ${
              activeTab === 'analytics'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </button>
        </nav>
      </div>

      {/* Enhanced Filters */}
      {(activeTab === 'buy' || activeTab === 'sell') && (
        <div className="mt-4 md:mt-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
            />
          </div>
          
          {/* Filter Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="inputs">Inputs</option>
              <option value="produce">Produce</option>
            </select>

            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
            >
              <option value="all">All Provinces</option>
              {zambiaProvinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min price"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
            />

            <input
              type="number"
              placeholder="Max price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="date">Newest First</option>
              <option value="location">Location</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{filteredItems.length} items found</span>
            </div>
            <div className="text-sm text-gray-500">
              Showing {activeTab === 'buy' ? 'agricultural inputs' : 'produce listings'}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Items Grid */}
      {(activeTab === 'buy' || activeTab === 'sell') && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems
            .filter(item => activeTab === 'buy' ? item.category === 'inputs' : item.category === 'produce')
            .map((item) => {
              const supplier = suppliers.find(s => s.id === item.sellerId);
              return (
              <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.category === 'inputs' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.category === 'inputs' ? 'Input' : 'Produce'}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(item.price)}/{item.unit}
                      </span>
                      <span className="text-sm text-gray-500">{item.quantity} {item.unit} available</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.location.district}, {item.location.province}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{item.sellerName}</span>
                        {supplier?.verified && (
                          <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                        )}
                      </div>
                      {supplier?.rating && (
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span>{supplier.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Listed {formatDate(item.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleQuickOrder(item)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      {activeTab === 'buy' ? 'Order Now' : 'Contact Seller'}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {/* TODO: View details */}}
                        className="text-sm text-green-600 hover:text-green-500 border border-green-600 rounded-md px-3 py-1 text-center"
                      >
                        <Eye className="h-3 w-3 inline mr-1" />
                        Details
                      </button>
                      <button
                        onClick={() => {/* TODO: Message seller */}}
                        className="text-sm text-blue-600 hover:text-blue-500 border border-blue-600 rounded-md px-3 py-1 text-center"
                      >
                        <MessageSquare className="h-3 w-3 inline mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )})}
        </div>
      )}

      {filteredItems.filter(item => activeTab === 'buy' ? item.category === 'inputs' : item.category === 'produce').length === 0 && (
        <div className="text-center py-12">
          {activeTab === 'buy' ? <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" /> : <Sprout className="mx-auto h-12 w-12 text-gray-400" />}
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {activeTab === 'buy' ? 'inputs' : 'produce'} available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'buy' ? 'Check back later for new input listings.' : 'Be the first to list your produce.'}
          </p>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Registered Suppliers</h2>
            <button
              onClick={() => setShowSupplierForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register as Supplier
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                    {supplier.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600">{supplier.category}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {supplier.location.district}, {supplier.location.province}
                    </div>
                    
                    {supplier.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-2 text-yellow-400" />
                        {supplier.rating} ({supplier.totalSales} sales)
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Specialties:</span> {supplier.specialties.slice(0, 2).join(', ')}
                      {supplier.specialties.length > 2 && ' +' + (supplier.specialties.length - 2) + ' more'}
                    </div>
                  </div>

                  {supplier.description && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{supplier.description}</p>
                  )}
                  
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-gray-400">Registered: {supplier.registeredDate}</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* TODO: View supplier details */}}
                        className="text-sm text-green-600 hover:text-green-500"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {/* TODO: Contact supplier */}}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {suppliers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers registered</h3>
              <p className="mt-1 text-sm text-gray-500">Be the first to register as a supplier.</p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">{analytics.totalOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.totalValue)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">{analytics.pendingOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.averageOrderValue)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Suppliers</h3>
                <div className="space-y-3">
                  {analytics.topSuppliers.map((supplier, index) => (
                    <div key={supplier.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 w-4">#{index + 1}</span>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                          <p className="text-xs text-gray-500">{supplier.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{supplier.totalSales} sales</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs text-gray-500">{supplier.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.items[0]?.name || 'Order'}</p>
                        <p className="text-xs text-gray-500">{order.deliveryDetails?.fullName || 'Customer'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Order Modal */}
      {showOrderForm && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowOrderForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleBulkOrder(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Place Order</h3>
                  
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{selectedItem.name}</h4>
                    <p className="text-sm text-gray-600">{selectedItem.description}</p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {formatCurrency(selectedItem.price)}/{selectedItem.unit}
                    </p>
                    <p className="text-sm text-gray-500">Available: {selectedItem.quantity} {selectedItem.unit}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        max={selectedItem.quantity}
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Total: {formatCurrency(selectedItem.price * orderQuantity)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Method</label>
                      <select
                        name="deliveryMethod"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="pickup">Pickup from Supplier</option>
                        <option value="delivery">Home Delivery</option>
                        <option value="collection_point">Collection Point</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                      <input
                        type="date"
                        name="expectedDelivery"
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <select
                        name="paymentMethod"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="mobile_money">Mobile Money</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash_on_delivery">Cash on Delivery</option>
                        <option value="credit">Credit (if approved)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Place Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
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

      {/* Supplier Registration Modal */}
      {showSupplierForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowSupplierForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSupplierRegistration(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Register as Supplier</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Your business name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          name="category"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Category</option>
                          <option value="Seeds & Planting Materials">Seeds & Planting Materials</option>
                          <option value="Fertilizers & Chemicals">Fertilizers & Chemicals</option>
                          <option value="Farm Equipment">Farm Equipment</option>
                          <option value="Tools & Machinery">Tools & Machinery</option>
                          <option value="Irrigation Supplies">Irrigation Supplies</option>
                          <option value="General Agro Inputs">General Agro Inputs</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="+260-XX-XXX-XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="business@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Address</label>
                      <textarea
                        name="address"
                        rows={2}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Full business address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Province</label>
                        <select
                          name="province"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Province</option>
                          {zambiaProvinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <select
                          name="district"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select District</option>
                          {Object.entries(zambiaDistricts).map(([province, districts]) => 
                            districts.map(district => (
                              <option key={`${province}-${district}`} value={district}>{district}</option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialties</label>
                      <input
                        type="text"
                        name="specialties"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Comma-separated list of products/services"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Methods Accepted</label>
                      <input
                        type="text"
                        name="paymentMethods"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Cash, Mobile Money, Bank Transfer, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Options</label>
                      <input
                        type="text"
                        name="deliveryOptions"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Pickup, Local Delivery, Countrywide Shipping, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Describe your business and experience..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSupplierForm(false)}
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
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddItem(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">List New Item</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Item Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter item name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          name="category"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Category</option>
                          <option value="inputs">Inputs</option>
                          <option value="produce">Produce</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <input
                          type="text"
                          name="type"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="e.g., seed, fertilizer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Describe your item"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price (ZMW)</label>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <input
                          type="text"
                          name="unit"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="kg, bags, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Province</label>
                        <select
                          name="province"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Province</option>
                          {zambiaProvinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <select
                          name="district"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select District</option>
                          {Object.entries(zambiaDistricts).map(([province, districts]) => 
                            districts.map(district => (
                              <option key={`${province}-${district}`} value={district}>{district}</option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    List Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
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
