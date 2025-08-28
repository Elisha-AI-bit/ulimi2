import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';

export default function Weather() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Lusaka');
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Load weather data from storage or generate mock data
    const savedWeather = storage.getWeatherData();
    if (savedWeather) {
      setWeather(savedWeather.current);
      setForecast(savedWeather.forecast || []);
    } else {
      generateMockWeatherData();
    }

    // Generate weather alerts
    generateWeatherAlerts();
  }, [selectedLocation]);

  const generateMockWeatherData = () => {
    const currentWeather = {
      location: selectedLocation,
      temperature: Math.round(Math.random() * 15 + 20), // 20-35°C
      humidity: Math.round(Math.random() * 40 + 40), // 40-80%
      windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
      rainfall: Math.round(Math.random() * 10), // 0-10mm
      pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
      uvIndex: Math.round(Math.random() * 10 + 1), // 1-11
      visibility: Math.round(Math.random() * 5 + 10), // 10-15 km
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

    setWeather(currentWeather);
    setForecast(forecastData);

    // Save to storage
    storage.saveWeatherData({
      current: currentWeather,
      forecast: forecastData
    });
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Weather Information</h1>
          <p className="mt-2 text-sm text-gray-700">
            Real-time weather data and forecasts for farming decisions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="mt-6 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-md p-4 ${
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
                <div className="ml-3">
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
      {weather && (
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Weather - {weather.location}</h3>
            <p className="text-sm text-gray-500">Last updated: {formatDate(weather.timestamp)}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Weather Display */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  {getWeatherIcon(weather.conditions)}
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-gray-900">{weather.temperature}°C</div>
                    <div className="text-lg text-gray-600">{weather.conditions}</div>
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Humidity</div>
                        <div className="text-lg font-semibold">{weather.humidity}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Wind Speed</div>
                        <div className="text-lg font-semibold">{weather.windSpeed} km/h</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CloudRain className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Rainfall</div>
                        <div className="text-lg font-semibold">{weather.rainfall} mm</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Pressure</div>
                        <div className="text-lg font-semibold">{weather.pressure} hPa</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">UV Index</div>
                        <div className={`text-lg font-semibold inline-flex px-2 py-1 rounded-full text-xs ${getUVIndexColor(weather.uvIndex)}`}>
                          {weather.uvIndex}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">Visibility</div>
                        <div className="text-lg font-semibold">{weather.visibility} km</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
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

      {/* Farming Recommendations */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Weather-Based Farming Recommendations</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Current Conditions Advice</h4>
              {weather && (
                <div className="space-y-3">
                  {weather.rainfall > 5 && (
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                      <CloudRain className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-900">Heavy Rainfall</div>
                        <div className="text-sm text-blue-700">Ensure proper drainage and avoid field operations</div>
                      </div>
                    </div>
                  )}
                  
                  {weather.temperature > 30 && (
                    <div className="flex items-start p-3 bg-orange-50 rounded-lg">
                      <Sun className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-orange-900">High Temperature</div>
                        <div className="text-sm text-orange-700">Increase irrigation frequency and provide shade for livestock</div>
                      </div>
                    </div>
                  )}
                  
                  {weather.humidity > 70 && (
                    <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                      <Droplets className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-yellow-900">High Humidity</div>
                        <div className="text-sm text-yellow-700">Monitor for fungal diseases and improve ventilation</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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