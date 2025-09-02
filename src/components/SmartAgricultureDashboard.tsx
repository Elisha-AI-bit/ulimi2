import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Droplets, Sun, Leaf, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WeatherData {
  location: string;
  date: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  sunlight_hours: number;
}

interface SoilData {
  location: string;
  soil_type: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
}

interface Recommendation {
  farmer_id: string;
  crop_name: string;
  recommendation_text: string;
  expected_yield: number;
  profit_estimate: number;
  risk_warnings: string[];
}

interface SimulationData {
  farmer_id: string;
  location: string;
  crop_name: string;
  current_weather: WeatherData;
  soil_data: SoilData;
  recommendations: Recommendation;
}

const SmartAgricultureDashboard: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [crop, setCrop] = useState<string>('Maize');
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [yieldData, setYieldData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);

  // Available crops
  const crops = ['Maize', 'Soybeans', 'Groundnuts', 'Cassava', 'Rice'];

  // Initialize with sample data
  useEffect(() => {
    // Generate sample yield and profit data for charts
    const sampleYieldData = [
      { month: 'Jan', yield: 1.2 },
      { month: 'Feb', yield: 2.5 },
      { month: 'Mar', yield: 3.8 },
      { month: 'Apr', yield: 4.2 },
      { month: 'May', yield: 4.8 },
      { month: 'Jun', yield: 5.0 },
    ];
    
    const sampleProfitData = [
      { month: 'Jan', profit: 4.2 },
      { month: 'Feb', 'Profit (ZMW)': 8.75 },
      { month: 'Mar', 'Profit (ZMW)': 13.3 },
      { month: 'Apr', 'Profit (ZMW)': 14.7 },
      { month: 'May', 'Profit (ZMW)': 16.8 },
      { month: 'Jun', 'Profit (ZMW)': 17.5 },
    ];
    
    setYieldData(sampleYieldData);
    setProfitData(sampleProfitData);
  }, []);

  const handleSimulate = async () => {
    if (!location.trim()) {
      setError('Please enter your location');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the backend API
      // const response = await fetch(`/api/simulate/farmer_123`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: SimulationData = {
        farmer_id: 'farmer_123',
        location: location,
        crop_name: crop,
        current_weather: {
          location: location,
          date: new Date().toISOString().split('T')[0],
          temperature: 28.5,
          rainfall: 15.2,
          humidity: 65.0,
          sunlight_hours: 8.5
        },
        soil_data: {
          location: location,
          soil_type: 'Loam',
          ph: 6.5,
          nitrogen: 120.0,
          phosphorus: 45.0,
          potassium: 90.0,
          moisture: 35.0
        },
        recommendations: {
          farmer_id: 'farmer_123',
          crop_name: crop,
          recommendation_text: `Based on current conditions in ${location}:\n\nTemperature: 28.5°C (Optimal)\nRainfall: 15.2mm (Adequate)\nSoil pH: 6.5 (Optimal)\n\nFertilizer schedule: Apply basal fertilizer (Compound D) at planting. Top-dress with Urea 4-6 weeks after planting.\nIrrigation: Maintain soil moisture at 30-40% for optimal growth.\nPlanting time: Based on current conditions, planting now is appropriate.\nExpected yield: 4.50 tons/ha\nProfit estimate: ZMW 14.18/ha`,
          expected_yield: 4.50,
          profit_estimate: 14.18,
          risk_warnings: [
            "Monitor for fall armyworm as crop matures",
            "Apply phosphorus fertilizer if leaves show purple discoloration"
          ]
        }
      };
      
      setSimulationData(mockData);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real implementation, you would reverse geocode the coordinates
          setLocation(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
        },
        (error) => {
          setError('Unable to detect location. Please enter manually.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Smart Agriculture Dashboard</h1>
        <p className="mt-2 text-gray-600">Get AI-powered farming recommendations based on real-time data</p>
      </div>

      {/* Input Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Farm Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <button
                onClick={detectLocation}
                className="inline-flex items-center px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-1">
              Select Crop
            </label>
            <select
              id="crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Recommendations'
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {simulationData && (
        <>
          {/* Weather and Soil Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weather Data */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                Current Weather
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Temperature</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {simulationData.current_weather.temperature}°C
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Rainfall</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {simulationData.current_weather.rainfall}mm
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Humidity</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {simulationData.current_weather.humidity}%
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Sunlight</span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {simulationData.current_weather.sunlight_hours} hours
                  </p>
                </div>
              </div>
            </div>
            
            {/* Soil Data */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                Soil Conditions
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Soil Type</span>
                  <span className="text-sm text-gray-900">{simulationData.soil_data.soil_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">pH Level</span>
                  <span className="text-sm text-gray-900">{simulationData.soil_data.ph}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Nitrogen</span>
                  <span className="text-sm text-gray-900">{simulationData.soil_data.nitrogen} ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Phosphorus</span>
                  <span className="text-sm text-gray-900">{simulationData.soil_data.phosphorus} ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Potassium</span>
                  <span className="text-sm text-gray-900">{simulationData.soil_data.potassium} ppm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Moisture</span>
                  <span className="text-sm text-gray-900">{simulationData.soil_data.moisture}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Recommendations */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {simulationData.recommendations.recommendation_text}
              </pre>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Expected Yield</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {simulationData.recommendations.expected_yield.toFixed(2)} tons/ha
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Profit Estimate</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  ZMW {simulationData.recommendations.profit_estimate.toFixed(2)}/ha
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Planting Date</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-yellow-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Risk Warnings */}
            {simulationData.recommendations.risk_warnings.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  Risk Warnings
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {simulationData.recommendations.risk_warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Yield Projection Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Yield Projection</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={yieldData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Yield (tons/ha)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="yield" stroke="#10B981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Profit Projection Chart */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profit Projection</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profitData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Profit (ZMW/ha)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Profit (ZMW)" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartAgricultureDashboard;