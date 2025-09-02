import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  MessageCircle, 
  DollarSign,
  Users,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Calendar,
  Star
} from 'lucide-react';

interface VendorDashboardProps {
  onPageChange: (page: string) => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  status: 'active' | 'inactive' | 'out-of-stock';
}

interface Sale {
  id: string;
  productName: string;
  customerName: string;
  quantity: number;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ onPageChange }) => {
  const { authState } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sales' | 'analytics'>('overview');

  // Mock data for vendor
  const stats = {
    totalProducts: 24,
    totalSales: 1250,
    revenue: 18750,
    customers: 89,
    avgRating: 4.7,
    ordersToday: 8
  };

  const recentSales: Sale[] = [
    {
      id: '1',
      productName: 'Premium Maize Seeds (SC627)',
      customerName: 'Mirriam Mubanga',
      quantity: 5,
      amount: 125,
      date: '2024-08-30T08:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      productName: 'NPK Fertilizer 50kg',
      customerName: 'Joseph Banda',
      quantity: 2,
      amount: 180,
      date: '2024-08-30T07:15:00Z',
      status: 'pending'
    },
    {
      id: '3',
      productName: 'Irrigation Sprinkler System',
      customerName: 'Natasha Phiri',
      quantity: 1,
      amount: 450,
      date: '2024-08-29T16:45:00Z',
      status: 'completed'
    }
  ];

  const topProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Maize Seeds (SC627)',
      category: 'Seeds',
      price: 25,
      stock: 150,
      sales: 89,
      rating: 4.8,
      status: 'active'
    },
    {
      id: '2',
      name: 'NPK Fertilizer 50kg',
      category: 'Fertilizers',
      price: 90,
      stock: 45,
      sales: 67,
      rating: 4.6,
      status: 'active'
    },
    {
      id: '3',
      name: 'Irrigation Sprinkler System',
      category: 'Equipment',
      price: 450,
      stock: 12,
      sales: 23,
      rating: 4.9,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'out-of-stock':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `K${amount.toLocaleString()}`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center">
                {stats.avgRating}
                <Star className="h-5 w-5 text-yellow-500 ml-1" />
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ordersToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
          <button
            onClick={() => setActiveTab('sales')}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.slice(0, 5).map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(sale.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">Category: {product.category}</p>
              <p className="text-sm text-gray-600">Price: {formatCurrency(product.price)}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock} units</p>
              <p className="text-sm text-gray-600">Sales: {product.sales} units</p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Eye className="mr-1 h-4 w-4" />
                View
              </button>
              <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center justify-center">
                <Edit className="mr-1 h-4 w-4" />
                Edit
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
                Welcome back, {authState.user?.name}! 🏪
              </h1>
              <p className="text-gray-600 mt-1">Manage your products and track your sales performance</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => onPageChange('marketplace')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Marketplace
              </button>
              <button
                onClick={() => onPageChange('forum')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Community
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'sales', label: 'Sales', icon: TrendingUp },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'sales' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales History</h3>
              <p className="text-gray-600">Detailed sales tracking coming soon...</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics</h3>
              <p className="text-gray-600">Advanced analytics dashboard coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;