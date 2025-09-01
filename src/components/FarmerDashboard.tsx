import React, { useState, useEffect } from 'react';
import { 
  Sprout, Calendar, Package, TrendingUp, AlertTriangle, 
  Cloud, Droplets, Sun, CheckCircle, MapPin, Clock,
  Plus, ArrowRight, Target, Brain, Thermometer,
  Eye, Edit, Trash2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';
import { Task } from '../types';

interface FarmerDashboardProps {
  onPageChange: (page: string) => void;
}

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onPageChange }) => {
  const { authState } = useAuth();
  const [farms, setFarms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFarmerData();
  }, []);

  const loadFarmerData = async () => {
    try {
      if (!authState.user) {
        console.warn('No authenticated user found');
        return;
      }

      // Load farmer-specific data from storage
      const farmsData = await storage.getFarms(authState.user.id) || [];
      
      // Fetch tasks for all farms
      let allTasks: Task[] = [];
      for (const farm of farmsData) {
        const farmTasks = await storage.getTasks(farm.id) || [];
        allTasks = [...allTasks, ...farmTasks];
      }
      
      const weatherData = authState.user.location ? 
        await storage.getWeatherData(authState.user.location) : null;
      const recommendationsData = await storage.getAIRecommendations(authState.user.id) || [];
      
      setFarms(farmsData);
      setTasks(allTasks);
      setRecommendations(recommendationsData);
      
      // Extract crops from farms
      const allCrops = farmsData.flatMap(farm => farm.crops || []);
      setCrops(allCrops);
      
      // Set weather data or generate mock data
      if (weatherData) {
        // Convert the WeatherData structure to what the component expects
        const formattedWeather = {
          current: {
            temperature: Math.round((weatherData.temperature.min + weatherData.temperature.max) / 2),
            humidity: weatherData.humidity,
            rainfall: weatherData.rainfall,
            conditions: weatherData.conditions,
            windSpeed: weatherData.windSpeed,
            // These are mock values since they're not in the WeatherData interface
            uvIndex: 6,
            pressure: 1015,
            visibility: 15
          },
          forecast: [
            { date: new Date().toISOString(), temp: Math.round((weatherData.temperature.min + weatherData.temperature.max) / 2), rainfall: weatherData.rainfall, conditions: weatherData.conditions },
            { date: new Date(Date.now() + 86400000).toISOString(), temp: weatherData.temperature.max, rainfall: weatherData.rainfall * 0.8, conditions: weatherData.conditions },
            { date: new Date(Date.now() + 172800000).toISOString(), temp: weatherData.temperature.min, rainfall: weatherData.rainfall * 1.2, conditions: 'Light Rain' }
          ]
        };
        setWeather(formattedWeather);
      } else {
        const mockWeather = {
          current: {
            temperature: 26,
            humidity: 62,
            rainfall: 3,
            conditions: 'Partly Cloudy',
            windSpeed: 12,
            uvIndex: 6,
            pressure: 1015,
            visibility: 15
          },
          forecast: [
            { date: new Date().toISOString(), temp: 26, rainfall: 3, conditions: 'Partly Cloudy' },
            { date: new Date(Date.now() + 86400000).toISOString(), temp: 28, rainfall: 0, conditions: 'Sunny' },
            { date: new Date(Date.now() + 172800000).toISOString(), temp: 24, rainfall: 8, conditions: 'Light Rain' }
          ]
        };
        setWeather(mockWeather);
      }
      
      // Generate sample recommendations if none exist
      if (recommendationsData.length === 0) {
        const mockRecommendations = [
          {
            id: '1',
            type: 'crop_optimization',
            title: 'Maize Planting Recommendation',
            description: 'Current soil and weather conditions are optimal for maize planting in your main field.',
            confidence: 92,
            priority: 'high',
            action: 'farms',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            type: 'input_recommendation',
            title: 'Fertilizer Application',
            description: 'Apply NPK fertilizer to boost crop growth based on soil analysis.',
            confidence: 88,
            priority: 'medium',
            action: 'ai-advisor',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            type: 'weather_alert',
            title: 'Rain Expected',
            description: 'Light rainfall expected in 2 days. Good time for land preparation.',
            confidence: 95,
            priority: 'medium',
            action: 'weather',
            createdAt: new Date().toISOString()
          }
        ];
        setRecommendations(mockRecommendations);
      }
      
    } catch (error) {
      console.error('Error loading farmer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const farmerStats = [
    {
      name: 'My Farms',
      value: farms.length,
      icon: Sprout,
      color: 'text-green-600 bg-green-100',
      change: `${Array.isArray(farms) ? farms.reduce((sum, farm) => sum + (farm.size || 0), 0) : 0} hectares total`
    },
    {
      name: 'Active Crops',
      value: crops.length,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
      change: `${Array.isArray(crops) ? crops.filter(c => c.status === 'growing').length : 0} growing`
    },
    {
      name: 'Pending Tasks',
      value: Array.isArray(tasks) ? tasks.filter(task => task.status === 'pending').length : 0,
      icon: Calendar,
      color: 'text-orange-600 bg-orange-100',
      change: `${Array.isArray(tasks) ? tasks.filter(t => t.status === 'overdue').length : 0} overdue`
    },
    {
      name: 'Temperature',
      value: weather?.current?.temperature ? `${weather.current.temperature}°C` : 'N/A',
      icon: Thermometer,
      color: 'text-red-600 bg-red-100',
      change: weather?.current?.conditions || 'Loading...'
    }
  ];

  const quickActions = [
    {
      name: 'Manage Farms',
      description: 'Add new farms, update crop information, and track field activities',
      icon: Sprout,
      color: 'bg-green-500 hover:bg-green-600',
      action: 'farms'
    },
    {
      name: 'View Tasks',
      description: 'Check pending tasks, create new ones, and track progress',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: 'tasks'
    },
    {
      name: 'AI Advisor',
      description: 'Get smart farming recommendations and expert advice',
      icon: Brain,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'ai-advisor'
    },
    {
      name: 'Weather Info',
      description: 'Check current weather and 7-day forecast for your area',
      icon: Cloud,
      color: 'bg-cyan-500 hover:bg-cyan-600',
      action: 'weather'
    },
    {
      name: 'Marketplace',
      description: 'Browse, buy, sell, place orders, make payments, and track deliveries',
      icon: Package,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: 'marketplace'
    },
    {
      name: 'Inventory',
      description: 'Track seeds, fertilizers, and equipment inventory',
      icon: Package,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: 'inventory'
    }
  ];

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCropStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'bg-green-100 text-green-800';
      case 'planted': return 'bg-blue-100 text-blue-800';
      case 'harvested': return 'bg-orange-100 text-orange-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading your farm dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {authState.user?.name}! 👨‍🌾
              </h1>
              <p className="text-gray-600 mt-1">Manage your farms, crops, farming activities, and access the full marketplace</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onPageChange('farms')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Farm
              </button>
              <button
                onClick={loadFarmerData}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {farmerStats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                      <dd className="text-sm text-gray-500">{stat.change}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Farmer Quick Actions</h3>
                <p className="text-sm text-gray-500">Manage your farming operations</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.name}
                      onClick={() => onPageChange(action.action)}
                      className={`${action.color} text-white p-4 rounded-lg text-left transition-all hover:scale-105 hover:shadow-lg`}
                    >
                      <action.icon className="h-8 w-8 mb-3" />
                      <h4 className="text-lg font-semibold mb-2">{action.name}</h4>
                      <p className="text-sm opacity-90 line-clamp-2">{action.description}</p>
                      <ArrowRight className="h-4 w-4 mt-3 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="mt-6 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
                <button
                  onClick={() => onPageChange('tasks')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="p-6">
                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Due: {formatDate(task.dueDate)}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTaskPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No tasks yet</p>
                    <button
                      onClick={() => onPageChange('tasks')}
                      className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Create your first task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Weather Widget */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Cloud className="h-5 w-5 text-blue-500 mr-2" />
                  Weather
                </h3>
              </div>
              <div className="p-6">
                {weather?.current ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {weather.current.temperature}°C
                    </div>
                    <div className="text-gray-600 mb-4">{weather.current.conditions}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{weather.current.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 text-orange-500 mr-1" />
                        <span>UV {weather.current.uvIndex}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onPageChange('weather')}
                      className="mt-4 w-full bg-blue-50 text-blue-700 py-2 px-4 rounded text-sm hover:bg-blue-100 transition-colors"
                    >
                      View Full Forecast
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Weather data unavailable</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Brain className="h-5 w-5 text-purple-500 mr-2" />
                  AI Recommendations
                </h3>
              </div>
              <div className="p-6">
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec) => (
                      <div key={rec.id} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Confidence: {rec.confidence}%
                          </span>
                          <button
                            onClick={() => onPageChange(rec.action)}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recommendations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* My Crops */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Sprout className="h-5 w-5 text-green-500 mr-2" />
                  My Crops
                </h3>
              </div>
              <div className="p-6">
                {crops.length > 0 ? (
                  <div className="space-y-3">
                    {crops.slice(0, 4).map((crop) => (
                      <div key={crop.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                          <div className="text-xs text-gray-500">{crop.variety}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCropStatusColor(crop.status)}`}>
                          {crop.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Sprout className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No crops planted yet</p>
                    <button
                      onClick={() => onPageChange('farms')}
                      className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Add crops
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;