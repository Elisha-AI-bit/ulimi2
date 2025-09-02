import React, { useState, useEffect } from 'react';
import { 
  Sprout, ShoppingCart, Brain, TrendingUp, AlertTriangle, Calendar, 
  Thermometer, Droplets, Zap, Cpu, Eye, Target, Lightbulb, 
  Cloud, Wifi, Satellite, BarChart3, Users, Package, CheckCircle,
  ArrowRight, RefreshCw, Bell, MapPin, Clock
} from 'lucide-react';
import { storage } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';
import { useOfflineSync } from '../services/OfflineSyncService';
import { dataIntegrationService } from '../services/DataIntegrationService';
import { aiCapabilitiesService } from '../services/AICapabilitiesService';
import OfflineStatusIndicator from './OfflineStatusIndicator';

export default function Dashboard({ onPageChange }: { onPageChange?: (page: string) => void }) {
  const [farms, setFarms] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [iotData, setIoTData] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [aiModels, setAiModels] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { t, formatCurrency, formatDate } = useLanguage();
  const { syncStatus: offlineStatus, isOfflineMode } = useOfflineSync();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load basic data from storage
      const farmsData = storage.getFarms();
      const tasksData = storage.getTasks();
      const ordersData = storage.getOrders() || [];
      const weatherData = storage.getWeatherData();
      const recommendationsData = storage.getAIRecommendations();
      
      setFarms(farmsData);
      setTasks(tasksData);
      setOrders(ordersData);
      
      // Validate weather data structure
      if (weatherData && weatherData.current) {
        setWeather(weatherData);
      } else {
        setWeather(null); // This will trigger the mock weather creation below
      }
      
      setRecommendations(recommendationsData);
      
      // Load AI model performance data
      const models = aiCapabilitiesService.getModelPerformance();
      setAiModels(models);
      
      // Load data integration status
      const dataStatus = dataIntegrationService.getDataSyncStatus();
      setSyncStatus(dataStatus);
      
      // Load IoT data if available
      const cachedIoT = storage.get('iot_data_farm1') || [];
      if (Array.isArray(cachedIoT)) {
        setIoTData(cachedIoT);
      }
      
      // Load market data if available
      const cachedMarket = storage.get('market_data_maize') || [];
      if (Array.isArray(cachedMarket)) {
        setMarketData(cachedMarket);
      }
      
      // Simulate weather data if not available or invalid
      if (!weather || !weather.current) {
        const mockWeather = {
          current: {
            temperature: 28,
            humidity: 65,
            rainfall: 0,
            conditions: 'Partly Cloudy',
            windSpeed: 8,
            uvIndex: 7
          },
          forecast: [
            { date: new Date().toISOString(), temp: 28, rainfall: 0, conditions: 'Sunny' },
            { date: new Date(Date.now() + 86400000).toISOString(), temp: 30, rainfall: 5, conditions: 'Light Rain' },
            { date: new Date(Date.now() + 172800000).toISOString(), temp: 26, rainfall: 15, conditions: 'Rainy' }
          ]
        };
        storage.saveWeatherData(mockWeather);
        setWeather(mockWeather);
      }
      
      // Generate sample recommendations if none exist
      if (recommendationsData.length === 0) {
        const mockRecommendations = [
          {
            id: '1',
            type: 'crop_optimization',
            title: t('crop_optimizer'),
            description: 'AI-optimized crop recommendations are available for your maize field.',
            confidence: 89,
            priority: 'high',
            action: 'ai-capabilities',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            type: 'input_recommendation',
            title: t('get_advice'),
            description: 'Smart fertilizer recommendations based on soil analysis and weather patterns.',
            confidence: 92,
            priority: 'medium',
            action: 'ai-decision-support',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            type: 'vision_diagnosis',
            title: 'Crop Health Alert',
            description: 'Upload crop images for AI-powered disease and pest detection.',
            confidence: 85,
            priority: 'medium',
            action: 'ai-capabilities',
            createdAt: new Date().toISOString()
          }
        ];
        storage.saveAIRecommendations(mockRecommendations);
        setRecommendations(mockRecommendations);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: t('farms'),
      value: farms.length,
      icon: Sprout,
      color: 'text-green-600 bg-green-100',
      change: '+2 this month'
    },
    {
      name: 'Active Tasks',
      value: tasks.filter(task => task.status !== 'completed').length,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100',
      change: `${tasks.filter(t => t.status === 'overdue').length} overdue`
    },
    {
      name: 'AI Models',
      value: aiModels.length,
      icon: Cpu,
      color: 'text-purple-600 bg-purple-100',
      change: `${aiModels.filter(m => m.accuracy > 90).length} high performance`
    },
    {
      name: 'Data Sources',
      value: 5, // Weather, Satellite, IoT, Regulatory, Market
      icon: Cloud,
      color: 'text-indigo-600 bg-indigo-100',
      change: syncStatus?.status === 'synced' ? 'All synced' : 'Sync pending'
    },
    {
      name: 'Total Area',
      value: `${farms.reduce((sum, farm) => sum + (farm.size || 0), 0)} ha`,
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
      change: 'Across all farms'
    },
    {
      name: 'Marketplace Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-pink-600 bg-pink-100',
      change: `${orders.filter(o => o.status === 'pending').length} pending`
    },
    {
      name: 'IoT Sensors',
      value: iotData.filter(sensor => sensor.status === 'active').length,
      icon: Wifi,
      color: 'text-cyan-600 bg-cyan-100',
      change: `${iotData.length} total sensors`
    },
    {
      name: 'Sync Status',
      value: isOfflineMode() ? 'Offline' : 'Online',
      icon: RefreshCw,
      color: isOfflineMode() ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100',
      change: `${offlineStatus.pendingOperations} pending`
    }
  ];

  const quickActions = [
    {
      name: t('farms'),
      description: 'Manage farms, crops, and field operations',
      icon: Sprout,
      color: 'bg-green-500 hover:bg-green-600',
      action: 'farms'
    },
    {
      name: t('marketplace'),
      description: 'Buy inputs and sell your produce',
      icon: ShoppingCart,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: 'marketplace'
    },
    {
      name: 'AI Capabilities',
      description: 'Crop optimization, vision diagnosis, and smart recommendations',
      icon: Cpu,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'ai-capabilities'
    },
    {
      name: 'AI Decision Support',
      description: 'Get AI-powered farming insights and forecasts',
      icon: Zap,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: 'ai-decision-support'
    },
    {
      name: 'IoT Smart Irrigation',
      description: 'Monitor sensors and control automated irrigation systems',
      icon: Droplets,
      color: 'bg-cyan-500 hover:bg-cyan-600',
      action: 'iot-irrigation'
    },
    {
      name: t('tasks'),
      description: 'Manage farming tasks and schedules',
      icon: Calendar,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: 'tasks'
    }
  ];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-safe">
      {/* Header with Offline Status */}
      <div className="mb-4 md:mb-6 lg:mb-8">
        <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:items-start md:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">{t('welcome')}</h1>
            <p className="mt-1 text-sm md:text-base text-gray-600 line-clamp-2">Your comprehensive smart farming management system</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <OfflineStatusIndicator />
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-3 py-2.5 md:px-4 md:py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 touch-manipulation min-h-[44px] md:min-h-[auto] transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-4 md:mb-6 lg:mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow touch-manipulation">
            <div className="p-3 sm:p-4 md:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 sm:p-2.5 md:p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 md:ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate leading-tight">{stat.name}</dt>
                    <dd className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">{stat.value}</dd>
                    <dd className="text-xs text-gray-500 mt-0.5 truncate leading-tight">{stat.change}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 sm:mb-0">Quick Actions</h3>
              <span className="text-sm text-gray-500">Access key features</span>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => onPageChange?.(action.action)}
                    className={`${action.color} text-white p-4 sm:p-5 md:p-6 rounded-lg text-left transition-all hover:scale-105 hover:shadow-lg touch-manipulation active:scale-95`}
                  >
                    <action.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mb-2 sm:mb-3" />
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 leading-tight">{action.name}</h4>
                    <p className="text-xs sm:text-sm opacity-90 line-clamp-2 leading-tight">{action.description}</p>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mt-2 sm:mt-3 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mt-4 md:mt-6 lg:mt-8 bg-white shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <Brain className="h-4 w-4 md:h-5 md:w-5 text-purple-600 mr-2" />
                <h3 className="text-base md:text-lg font-medium text-gray-900">AI Recommendations</h3>
              </div>
              <span className="text-sm text-gray-500">{recommendations.length} active</span>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              {recommendations.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {recommendations.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors touch-manipulation">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{rec.title}</h4>
                            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{rec.description}</p>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Target className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">Confidence: {rec.confidence}%</span>
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{formatDate(rec.createdAt)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex items-center flex-shrink-0">
                          {rec.type === 'crop_optimization' && <Target className="h-5 w-5 text-blue-500" />}
                          {rec.type === 'input_recommendation' && <Lightbulb className="h-5 w-5 text-green-500" />}
                          {rec.type === 'vision_diagnosis' && <Eye className="h-5 w-5 text-purple-500" />}
                        </div>
                      </div>
                      <button className="mt-3 inline-flex items-center text-sm text-green-600 hover:text-green-500 touch-manipulation min-h-[44px] -ml-2 pl-2 pr-4 py-2 rounded-lg transition-colors">
                        View Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8">
                  <Brain className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No AI recommendations available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start using AI features to get personalized insights</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6 lg:space-y-8 order-1 lg:order-2">
          {/* Weather Widget */}
          {weather && weather.current && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base md:text-lg font-medium text-gray-900 flex items-center">
                  <Thermometer className="h-4 w-4 md:h-5 md:w-5 text-orange-500 mr-2" />
                  {t('weather')}
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{Math.round(weather.current.temperature)}°C</div>
                  <div className="text-sm text-gray-500">{weather.current.conditions}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{weather.current.humidity}% humidity</span>
                  </div>
                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{weather.current.windSpeed} km/h</span>
                  </div>
                </div>
                {weather.forecast && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">3-Day Forecast</h4>
                    <div className="space-y-2">
                      {weather.forecast.slice(0, 3).map((day: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 flex-shrink-0">
                            {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-gray-900">{Math.round(day.temp)}°C</span>
                          <span className="text-blue-600">{day.rainfall}mm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-medium text-gray-900 flex items-center">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2" />
                System Status
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${
                      isOfflineMode() ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm text-gray-700 truncate">Connection</span>
                  </div>
                  <span className={`text-sm font-medium ml-2 flex-shrink-0 ${
                    isOfflineMode() ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {isOfflineMode() ? 'Offline' : 'Online'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <Satellite className="w-3 h-3 text-purple-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">Data Sync</span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2 flex-shrink-0">
                    {syncStatus?.status || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <Cpu className="w-3 h-3 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">AI Models</span>
                  </div>
                  <span className="text-sm text-green-600 ml-2 flex-shrink-0">
                    {aiModels.length} Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <Wifi className="w-3 h-3 text-cyan-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">IoT Sensors</span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2 flex-shrink-0">
                    {iotData.filter(s => s.status === 'active').length}/{iotData.length}
                  </span>
                </div>
                
                {offlineStatus.pendingOperations > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                      <span className="text-sm text-yellow-800 min-w-0">
                        {offlineStatus.pendingOperations} operations pending sync
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-500 mr-2" />
                Recent Activity
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 py-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in_progress' ? 'bg-blue-500' :
                      task.priority === 'high' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(task.createdAt)}</p>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}