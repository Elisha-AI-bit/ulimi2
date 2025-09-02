import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';

export default function Weather() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Lusaka');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [selectedLocation]);

  const loadWeatherData = async () => {
    console.log('Loading weather data for:', selectedLocation);
    setLoading(true);
    try {
      const savedWeather = storage.getWeatherData();
      console.log('Saved weather data:', savedWeather);
      
      if (savedWeather && savedWeather.current) {
        console.log('Using saved weather data');
        setWeather(savedWeather.current);
        setForecast(savedWeather.forecast || []);
      } else {
        console.log('Generating new mock weather data');
        await generateMockWeatherData();
      }

      generateWeatherAlerts();
      console.log('Weather data loaded successfully');
    } catch (error) {
      console.error('Error loading weather data:', error);
      console.log('Generating fallback weather data');
      await generateMockWeatherData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockWeatherData = async () => {
    console.log('Generating mock weather data for:', selectedLocation);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentWeather = {
      location: selectedLocation,
      temperature: Math.round(Math.random() * 15 + 20),
      humidity: Math.round(Math.random() * 40 + 40),
      windSpeed: Math.round(Math.random() * 20 + 5),
      rainfall: Math.round(Math.random() * 10),
      pressure: Math.round(Math.random() * 50 + 1000),
      uvIndex: Math.round(Math.random() * 10 + 1),
      visibility: Math.round(Math.random() * 5 + 10),
      conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'][Math.floor(Math.random() * 5)],
      timestamp: new Date().toISOString()
    };

    const forecastData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      tempMin: Math.round(Math.random() * 10 + 15),
      tempMax: Math.round(Math.random() * 15 + 25),
      humidity: Math.round(Math.random() * 40 + 40),
      rainfall: Math.round(Math.random() * 15),
      windSpeed: Math.round(Math.random() * 20 + 5),
      conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'][Math.floor(Math.random() * 5)]
    }));

    console.log('Generated weather data:', currentWeather);
    console.log('Generated forecast data:', forecastData);

    setWeather(currentWeather);
    setForecast(forecastData);

    try {
      storage.saveWeatherData({
        current: currentWeather,
        forecast: forecastData
      });
      console.log('Weather data saved to storage');
    } catch (storageError) {
      console.error('Error saving weather data to storage:', storageError);
    }
  };

  const generateWeatherAlerts = () => {
    const mockAlerts = [
      {
        id: '1',
        type: 'warning',
        title: 'Heavy Rain Expected',
        message: 'Heavy rainfall expected in the next 48 hours. Ensure proper drainage in your fields.',
        severity: 'high',
        validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'advisory',
        title: 'Optimal Planting Conditions',
        message: 'Current weather conditions are favorable for maize planting.',
        severity: 'medium',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setAlerts(mockAlerts);
  };

  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-600" />;
      case 'light rain':
      case 'heavy rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-600 bg-green-100';
    if (uvIndex <= 5) return 'text-yellow-600 bg-yellow-100';
    if (uvIndex <= 7) return 'text-orange-600 bg-orange-100';
    if (uvIndex <= 10) return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const locations = [
    'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Livingstone', 
    'Chipata', 'Kasama', 'Mazabuka', 'Choma', 'Mongu', 'Solwezi'
  ];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading weather data...</span>
        </div>
      </div>
    );
  }

  const fallbackWeather = {
    location: selectedLocation,
    temperature: 25,
    humidity: 60,
    windSpeed: 10,
    rainfall: 2,
    pressure: 1013,
    uvIndex: 6,
    visibility: 12,
    conditions: 'Partly Cloudy',
    timestamp: new Date().toISOString()
  };

  const displayWeather = weather || fallbackWeather;

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-safe">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex-auto min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Weather Information</h1>
          <p className="mt-1 text-sm text-gray-700">
            Real-time weather data and forecasts for farming decisions
          </p>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4 sm:flex-none">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="block w-full h-12 md:h-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-base md:text-sm transition-colors"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* No Weather Data Message */}
      {!weather && !loading && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-blue-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Using Demo Weather Data</h3>
              <p className="text-sm text-blue-700 mt-1">
                Displaying sample weather data for {selectedLocation}. In production, this would show real-time weather information.
              </p>
              <button
                onClick={loadWeatherData}
                className="mt-2 inline-flex items-center px-3 py-1 border border-blue-300 rounded text-xs text-blue-800 bg-blue-100 hover:bg-blue-200"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="mt-4 md:mt-6 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg p-3 md:p-4 ${
                alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                alert.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'high' ? 'text-red-400' :
                    alert.severity === 'medium' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`} />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <h3 className={`text-sm font-medium ${
                    alert.severity === 'high' ? 'text-red-800' :
                    alert.severity === 'medium' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.title}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    alert.severity === 'high' ? 'text-red-700' :
                    alert.severity === 'medium' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    <p>{alert.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current Weather */}
      <div className="mt-6 md:mt-8 bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-medium text-gray-900">Current Weather - {displayWeather.location}</h3>
          <p className="text-sm text-gray-500">Last updated: {formatDate(displayWeather.timestamp)}</p>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Main Weather Display */}
            <div className="lg:col-span-1">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                {getWeatherIcon(displayWeather.conditions)}
                <div className="mt-4">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">{displayWeather.temperature}°C</div>
                  <div className="text-base md:text-lg text-gray-600 mt-1">{displayWeather.conditions}</div>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 truncate">Humidity</div>
                      <div className="text-base md:text-lg font-semibold text-gray-900">{displayWeather.humidity}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center">
                    <Wind className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 truncate">Wind Speed</div>
                      <div className="text-base md:text-lg font-semibold text-gray-900">{displayWeather.windSpeed} km/h</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center">
                    <CloudRain className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 truncate">Rainfall</div>
                      <div className="text-base md:text-lg font-semibold text-gray-900">{displayWeather.rainfall} mm</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 truncate">Pressure</div>
                      <div className="text-base md:text-lg font-semibold text-gray-900">{displayWeather.pressure} hPa</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 truncate">UV Index</div>
                      <div className={`text-base md:text-lg font-semibold inline-flex px-2 py-1 rounded-full text-xs ${getUVIndexColor(displayWeather.uvIndex)}`}>
                        {displayWeather.uvIndex}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs md:text-sm text-gray-500 truncate">Visibility</div>
                      <div className="text-base md:text-lg font-semibold text-gray-900">{displayWeather.visibility} km</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {forecast.length > 0 ? (
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">7-Day Forecast</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {index === 0 ? 'Today' : 
                     index === 1 ? 'Tomorrow' : 
                     new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.conditions)}
                  </div>
                  
                  <div className="text-xs text-gray-600 mb-2">{day.conditions}</div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {day.tempMax}° / {day.tempMin}°
                    </div>
                    <div className="text-xs text-blue-600">
                      {day.rainfall}mm rain
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.windSpeed} km/h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">7-Day Forecast</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Forecast data not available</p>
                <button
                  onClick={loadWeatherData}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Farming Recommendations */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Weather-Based Farming Recommendations</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Current Conditions Advice</h4>
              <div className="space-y-3">
                {displayWeather.rainfall > 5 && (
                  <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                    <CloudRain className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">Heavy Rainfall</div>
                      <div className="text-sm text-blue-700">Ensure proper drainage and avoid field operations</div>
                    </div>
                  </div>
                )}
                
                {displayWeather.temperature > 30 && (
                  <div className="flex items-start p-3 bg-orange-50 rounded-lg">
                    <Sun className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-orange-900">High Temperature</div>
                      <div className="text-sm text-orange-700">Increase irrigation frequency and provide shade for livestock</div>
                    </div>
                  </div>
                )}
                
                {displayWeather.humidity > 70 && (
                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <Droplets className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-yellow-900">High Humidity</div>
                      <div className="text-sm text-yellow-700">Monitor for fungal diseases and improve ventilation</div>
                    </div>
                  </div>
                )}
                
                {/* Always show at least one general recommendation */}
                {displayWeather.rainfall <= 5 && displayWeather.temperature <= 30 && displayWeather.humidity <= 70 && (
                  <div className="flex items-start p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-green-900">Favorable Conditions</div>
                      <div className="text-sm text-green-700">Current weather conditions are suitable for most farming activities</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Weekly Planning</h4>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-green-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-green-900">Optimal Planting Window</div>
                    <div className="text-sm text-green-700">Next 3 days show favorable conditions for planting</div>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-purple-900">Irrigation Schedule</div>
                    <div className="text-sm text-purple-700">Reduce watering due to expected rainfall</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}