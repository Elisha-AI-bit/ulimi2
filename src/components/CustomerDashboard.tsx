import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  MessageCircle, 
  Star,
  TrendingUp,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  User,
  Bell,
  CreditCard
} from 'lucide-react';

interface CustomerDashboardProps {
  onPageChange: (page: string) => void;
}

interface Product {
  id: string;
  name: string;
  vendor: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  location: string;
}

interface Order {
  id: string;
  productName: string;
  vendor: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onPageChange }) => {
  const { authState } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'favorites' | 'recommendations'>('overview');

  // Mock data for customer
  const stats = {
    totalOrders: 12,
    totalSpent: 3450,
    savedProducts: 8,
    loyaltyPoints: 245
  };

  const recentOrders: Order[] = [
    {
      id: '1',
      productName: 'Premium Maize Seeds (SC627)',
      vendor: 'David Seeds Co.',
      quantity: 5,
      amount: 125,
      status: 'delivered',
      orderDate: '2024-08-25T10:00:00Z',
      estimatedDelivery: '2024-08-28T16:00:00Z'
    },
    {
      id: '2',
      productName: 'NPK Fertilizer 50kg',
      vendor: 'Agro Solutions',
      quantity: 2,
      amount: 180,
      status: 'shipped',
      orderDate: '2024-08-28T14:30:00Z',
      estimatedDelivery: '2024-08-31T12:00:00Z'
    },
    {
      id: '3',
      productName: 'Irrigation Sprinkler System',
      vendor: 'Farm Tech Ltd',
      quantity: 1,
      amount: 450,
      status: 'pending',
      orderDate: '2024-08-30T09:15:00Z',
      estimatedDelivery: '2024-09-03T15:00:00Z'
    }
  ];

  const recommendedProducts: Product[] = [
    {
      id: '1',
      name: 'Hybrid Tomato Seeds',
      vendor: 'Green Valley Seeds',
      price: 35,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200',
      category: 'Seeds',
      location: 'Lusaka'
    },
    {
      id: '2',
      name: 'Organic Compost 25kg',
      vendor: 'EcoFarm Supplies',
      price: 45,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200',
      category: 'Fertilizers',
      location: 'Copperbelt'
    },
    {
      id: '3',
      name: 'Drip Irrigation Kit',
      vendor: 'WaterWise Tech',
      price: 280,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=200',
      category: 'Equipment',
      location: 'Lusaka'
    }
  ];

  const favoriteProducts: Product[] = [
    {
      id: '4',
      name: 'Premium Maize Seeds (SC627)',
      vendor: 'David Seeds Co.',
      price: 25,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200',
      category: 'Seeds',
      location: 'Lusaka'
    },
    {
      id: '5',
      name: 'Solar Water Pump',
      vendor: 'SolarTech Africa',
      price: 750,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1497436072909-f5e4be05b974?w=200',
      category: 'Equipment',
      location: 'Southern'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `K${amount.toLocaleString()}`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.savedProducts}</p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onPageChange('marketplace')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Shop Now</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Track Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Wishlist</span>
          </button>
          <button
            onClick={() => onPageChange('forum')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Community</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{order.productName}</h4>
                <p className="text-sm text-gray-600">From: {order.vendor}</p>
                <p className="text-sm text-gray-600">
                  Ordered: {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for You */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">By {product.vendor}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-600">{formatCurrency(product.price)}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{order.productName}</h4>
                <p className="text-sm text-gray-600">Order #{order.id} • From: {order.vendor}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Quantity: <span className="font-medium">{order.quantity}</span></p>
                <p className="text-gray-600">Amount: <span className="font-medium">{formatCurrency(order.amount)}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Order Date: <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span></p>
                <p className="text-gray-600">Est. Delivery: <span className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</span></p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                  Track Order
                </button>
                {order.status === 'delivered' && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Your Wishlist</h3>
        <p className="text-sm text-gray-600">{favoriteProducts.length} items saved</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
            <p className="text-sm text-gray-600 mb-2">By {product.vendor}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-green-600">{formatCurrency(product.price)}</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                Add to Cart
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {authState.user?.name}! 🛒
              </h1>
              <p className="text-gray-600 mt-1">Discover quality agricultural products and connect with the farming community</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => onPageChange('marketplace')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Shop Now
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'favorites', label: 'Wishlist', icon: Heart },
                { id: 'recommendations', label: 'For You', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'recommendations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">By {product.vendor}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-green-600">{formatCurrency(product.price)}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                      Add to Cart
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;