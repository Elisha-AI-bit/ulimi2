import React, { useState, useEffect } from 'react';
import { Cloud, Satellite, Wifi, FileText, RefreshCw, Activity, AlertTriangle, CheckCircle, Calendar, MapPin, Thermometer, Droplets, Wind, Sun, Eye, Settings, Download, Upload } from 'lucide-react';
import { dataIntegrationService, WeatherData, SatelliteData, IoTSensorData, RegulatoryData, MarketPriceData } from '../services/DataIntegrationService';
import { storage } from '../utils/storage';
import { formatDate, formatCurrency } from '../utils/zambia-data';

export default function DataIntegration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'weather' | 'satellite' | 'iot' | 'regulatory' | 'market' | 'sync'>('overview');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
  const [iotData, setIoTData] = useState<IoTSensorData[]>([]);
  const [regulatoryData, setRegulatoryData] = useState<RegulatoryData[]>([]);
  const [marketData, setMarketData] = useState<MarketPriceData[]>([]);
  const [syncStatus, setSyncStatus] = useState(dataIntegrationService.getDataSyncStatus());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState('farm1');

  useEffect(() => {
    loadAllData();
    // Set up periodic sync status check
    const interval = setInterval(() => {
      setSyncStatus(dataIntegrationService.getDataSyncStatus());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [selectedFarmId]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load cached data first for instant display
      const cachedWeather = storage.get<WeatherData>('weather_data');
      if (cachedWeather) setWeatherData(cachedWeather);

      const cachedSatellite = storage.get<SatelliteData[]>(`satellite_data_${selectedFarmId}`);
      if (cachedSatellite) setSatelliteData(cachedSatellite);

      const cachedIoT = storage.get<IoTSensorData[]>(`iot_data_${selectedFarmId}`);
      if (cachedIoT) setIoTData(cachedIoT);

      const cachedRegulatory = storage.get<RegulatoryData[]>('regulatory_data_zambia');
      if (cachedRegulatory) setRegulatoryData(cachedRegulatory);

      const cachedMarket = storage.get<MarketPriceData[]>('market_data_maize');
      if (cachedMarket) setMarketData(cachedMarket);

      // Load fresh data in background
      const [weather, satellite, iot, regulatory, market] = await Promise.all([
        dataIntegrationService.getWeatherData(-15.3875, 28.3228),
        dataIntegrationService.getSatelliteData(selectedFarmId, 
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ),
        dataIntegrationService.getIoTSensorData(selectedFarmId),
        dataIntegrationService.getRegulatoryData('zambia'),
        dataIntegrationService.getMarketPriceData('maize')
      ]);

      setWeatherData(weather);
      setSatelliteData(satellite);
      setIoTData(iot);
      setRegulatoryData(regulatory);
      setMarketData(market);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const results = await dataIntegrationService.syncAllData(selectedFarmId);
      console.log('Sync results:', results);
      
      // Reload data after sync
      await loadAllData();
      setSyncStatus(dataIntegrationService.getDataSyncStatus());
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return CheckCircle;
      case 'pending': return RefreshCw;
      case 'error': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Data Integration</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor and manage external data sources for enhanced farm insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            onClick={handleManualSync}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Data Status Summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Cloud className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Weather Data</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {weatherData ? 'Active' : 'Offline'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Satellite className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Satellite Data</dt>
                  <dd className="text-lg font-medium text-gray-900">{satelliteData.length} images</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wifi className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">IoT Sensors</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {iotData.filter(s => s.status === 'active').length}/{iotData.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Regulations</dt>
                  <dd className="text-lg font-medium text-gray-900">{regulatoryData.length} active</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {React.createElement(getSyncStatusIcon(syncStatus.status), { 
                  className: `h-6 w-6 ${getSyncStatusColor(syncStatus.status)}` 
                })}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sync Status</dt>
                  <dd className={`text-lg font-medium capitalize ${getSyncStatusColor(syncStatus.status)}`}>
                    {syncStatus.status}
                  </dd>
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
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'weather', label: 'Weather', icon: Cloud },
            { key: 'satellite', label: 'Satellite', icon: Satellite },
            { key: 'iot', label: 'IoT Sensors', icon: Wifi },
            { key: 'regulatory', label: 'Regulatory', icon: FileText },
            { key: 'market', label: 'Market Data', icon: Activity },
            { key: 'sync', label: 'Sync Management', icon: RefreshCw }
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Weather Summary */}
            {weatherData && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Weather Conditions</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-lg font-medium">{weatherData.current.temperature.toFixed(1)}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Humidity</p>
                      <p className="text-lg font-medium">{weatherData.current.humidity.toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Wind Speed</p>
                      <p className="text-lg font-medium">{weatherData.current.windSpeed.toFixed(1)} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">UV Index</p>
                      <p className="text-lg font-medium">{weatherData.current.uvIndex}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active IoT Sensors */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">IoT Sensor Status</h3>
              <div className="space-y-3">
                {iotData.slice(0, 3).map((sensor) => (
                  <div key={sensor.sensorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        sensor.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sensor.sensorId}</p>
                        <p className="text-xs text-gray-500 capitalize">{sensor.sensorType} sensor</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Battery: {sensor.readings.batteryLevel?.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(sensor.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Regulatory Updates */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Regulatory Updates</h3>
              <div className="space-y-3">
                {regulatoryData.slice(0, 2).map((regulation) => (
                  <div key={regulation.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{regulation.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{regulation.authority}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Effective: {formatDate(regulation.effectiveDate)}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        regulation.type === 'subsidy_program' ? 'bg-green-100 text-green-800' :
                        regulation.type === 'pesticide_regulation' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {regulation.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weather' && weatherData && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Weather Forecast</h3>
                <span className="text-sm text-gray-500">
                  Last updated: {formatDate(weatherData.timestamp)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-7">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div className="mb-2">
                      <Sun className="h-6 w-6 text-yellow-500 mx-auto" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {day.maxTemp.toFixed(0)}°/{day.minTemp.toFixed(0)}°
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {day.precipitationChance.toFixed(0)}% rain
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'satellite' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Satellite Imagery Analysis</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {satelliteData.slice(0, 6).map((data, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(data.timestamp)}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{data.source}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">NDVI:</span>
                        <span className={`text-sm font-medium ${
                          data.ndvi > 0.7 ? 'text-green-600' : 
                          data.ndvi > 0.4 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {data.ndvi.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Soil Moisture:</span>
                        <span className="text-sm font-medium">{data.soilMoisture.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Temperature:</span>
                        <span className="text-sm font-medium">{data.landSurfaceTemperature.toFixed(1)}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'iot' && (
          <div className="space-y-6">
            {iotData.map((sensor) => (
              <div key={sensor.sensorId} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{sensor.sensorId}</h3>
                    <p className="text-sm text-gray-600 capitalize">{sensor.sensorType} Sensor</p>
                    {sensor.location.fieldName && (
                      <p className="text-xs text-gray-500">{sensor.location.fieldName}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      sensor.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600 capitalize">{sensor.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(sensor.readings).map(([key, value]) => (
                    value !== undefined && (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {typeof value === 'number' ? value.toFixed(1) : value}
                          {key.includes('Temperature') && '°C'}
                          {key.includes('Moisture') && '%'}
                          {key.includes('PH') && ' pH'}
                          {key.includes('batteryLevel') && '%'}
                        </p>
                      </div>
                    )
                  ))}
                </div>

                {sensor.alerts && sensor.alerts.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">Active Alerts</span>
                    </div>
                    {sensor.alerts.map((alert, index) => (
                      <p key={index} className="text-sm text-yellow-700 mt-1">{alert.message}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="space-y-6">
            {regulatoryData.map((regulation) => (
              <div key={regulation.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{regulation.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{regulation.authority}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    regulation.type === 'subsidy_program' ? 'bg-green-100 text-green-800' :
                    regulation.type === 'pesticide_regulation' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {regulation.type.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{regulation.description}</p>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {regulation.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600">{req}</li>
                      ))}
                    </ul>
                  </div>

                  {regulation.benefits && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {regulation.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span>Effective: {formatDate(regulation.effectiveDate)}</span>
                      {regulation.expiryDate && (
                        <span className="ml-4">Expires: {formatDate(regulation.expiryDate)}</span>
                      )}
                    </div>
                    <div className="space-x-2">
                      {regulation.documents.map((doc, index) => (
                        <button
                          key={index}
                          className="text-sm text-green-600 hover:text-green-500"
                        >
                          <Download className="h-4 w-4 inline mr-1" />
                          {doc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Synchronization</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Last Sync</p>
                  <p className="text-lg font-medium text-gray-900">
                    {syncStatus.lastSync ? formatDate(syncStatus.lastSync) : 'Never'}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`text-lg font-medium capitalize ${getSyncStatusColor(syncStatus.status)}`}>
                    {syncStatus.status}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Next Sync</p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDate(syncStatus.nextSync)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700">Automatic Sync Settings</h4>
                  <button className="text-sm text-green-600 hover:text-green-500">
                    <Settings className="h-4 w-4 inline mr-1" />
                    Configure
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Weather Data', interval: 'Every 1 hour', enabled: true },
                    { name: 'Satellite Imagery', interval: 'Daily', enabled: true },
                    { name: 'IoT Sensor Data', interval: 'Every 15 minutes', enabled: true },
                    { name: 'Regulatory Updates', interval: 'Weekly', enabled: true },
                    { name: 'Market Prices', interval: 'Every 6 hours', enabled: true }
                  ].map((setting, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{setting.name}</p>
                        <p className="text-xs text-gray-500">{setting.interval}</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={setting.enabled}
                          readOnly
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}