import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LogOut, Home, Cloud, ShoppingCart, Phone, User, RefreshCw,
  Thermometer, Droplets, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { storage } from '../utils/storage';

const USSDDashboard: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  const { authState, logout } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const user = authState.user;

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  // Quick actions for USSD users
  const quickActions = [
    {
      name: t('weather'),
      icon: Cloud,
      color: 'bg-blue-500',
      action: () => onPageChange?.('weather')
    },
    {
      name: t('marketplace'),
      icon: ShoppingCart,
      color: 'bg-green-500',
      action: () => onPageChange?.('marketplace')
    },
    {
      name: t('profile'),
      icon: User,
      color: 'bg-purple-500',
      action: () => onPageChange?.('profile')
    }
  ];

  // Get basic stats
  const weather = storage.getWeatherData();
  const farms = storage.getFarms();
  const tasks = storage.getTasks();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ULIMI 2.0 USSD</h1>
              <p className="text-sm text-gray-600">Mobile Access Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
        
        {/* User Info */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">{user?.name}</p>
              <p className="text-sm text-green-600">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cloud className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weather</p>
              <p className="text-lg font-semibold text-gray-900">
                {weather?.current?.temperature ? `${Math.round(weather.current.temperature)}°C` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Farms</p>
              <p className="text-lg font-semibold text-gray-900">{farms?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Tasks</p>
              <p className="text-lg font-semibold text-gray-900">
                {tasks?.filter(task => task.status !== 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} hover:opacity-90 text-white p-4 rounded-lg transition-all transform hover:scale-105`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="h-6 w-6" />
                <span className="font-medium">{action.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Weather */}
      {weather?.current && (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
            Weather Today
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{Math.round(weather.current.temperature)}°C</p>
              <p className="text-sm text-gray-600">{weather.current.conditions}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                <span>Humidity: {weather.current.humidity}%</span>
              </div>
              <div className="flex items-center text-sm">
                <Cloud className="h-4 w-4 text-gray-500 mr-2" />
                <span>Wind: {weather.current.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">USSD Connection</span>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Data Sync</span>
            </div>
            <span className="text-green-600 font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">Account Status</span>
            </div>
            <span className="text-blue-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900">USSD Access Help</h3>
            <p className="text-sm text-blue-700 mt-1">
              For quick access via mobile phone, dial *123# from your registered number.
              You can check weather, prices, and farming tips without internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USSDDashboard;