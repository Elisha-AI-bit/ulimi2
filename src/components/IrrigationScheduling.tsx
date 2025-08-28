import React, { useState, useEffect } from 'react';
import { 
  Plus, Droplets, Calendar, Settings, Play, Pause, 
  Cloud, Eye, Edit, AlertTriangle, Clock, Target, Activity
} from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';
import type { IrrigationSystem, IrrigationZone, IrrigationSchedule, IoTSensor, WeatherData } from '../types';

const IrrigationScheduling: React.FC = () => {
  const [systems, setSystems] = useState<IrrigationSystem[]>([]);
  const [activeTab, setActiveTab] = useState<'systems' | 'zones' | 'schedule' | 'sensors'>('systems');
  const [showAddForm, setShowAddForm] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [zones, setZones] = useState<IrrigationZone[]>([]);
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([]);
  const [sensors, setSensors] = useState<IoTSensor[]>([]);

  useEffect(() => {
    const savedSystems = storage.get<IrrigationSystem[]>('irrigation_systems') || [];
    const savedZones = storage.get<IrrigationZone[]>('irrigation_zones') || [];
    const savedSchedules = storage.get<IrrigationSchedule[]>('irrigation_schedules') || [];
    const savedSensors = storage.get<IoTSensor[]>('iot_sensors') || [];
    const savedWeather = storage.getWeatherData();
    
    setSystems(savedSystems);
    setZones(savedZones);
    setSchedules(savedSchedules);
    setSensors(savedSensors);
    setWeatherData(savedWeather);

    if (savedSystems.length === 0) {
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const sampleSystems: IrrigationSystem[] = [
      {
        id: '1',
        farmId: 'farm1',
        name: 'Main Field Drip System',
        type: 'drip',
        coverage: 5.0,
        zones: [],
        efficiency: 92,
        waterSource: 'Borehole Water',
        pumpCapacity: 5000,
        status: 'active',
        installationDate: '2023-03-15',
        lastMaintenance: '2024-08-10',
        nextMaintenance: '2024-11-10',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        farmId: 'farm1',
        name: 'Vegetable Garden Sprinklers',
        type: 'sprinkler',
        coverage: 2.0,
        zones: [],
        efficiency: 85,
        waterSource: 'Municipal Water',
        pumpCapacity: 2500,
        status: 'active',
        installationDate: '2023-07-20',
        nextMaintenance: '2024-10-15',
        createdAt: new Date().toISOString()
      }
    ];

    const sampleZones: IrrigationZone[] = [
      {
        id: '1',
        systemId: '1',
        name: 'Zone A - Maize Field',
        area: 3.0,
        cropType: 'Maize',
        soilType: 'Clay loam',
        waterRequirement: 25,
        sensors: [],
        schedule: [],
        status: 'active'
      },
      {
        id: '2',
        systemId: '2',
        name: 'Vegetable Beds',
        area: 2.0,
        cropType: 'Mixed Vegetables',
        soilType: 'Loam',
        waterRequirement: 35,
        sensors: [],
        schedule: [],
        status: 'active'
      }
    ];

    const sampleSchedules: IrrigationSchedule[] = [
      {
        id: '1',
        zoneId: '1',
        startTime: '06:00',
        duration: 45,
        frequency: 'daily',
        waterAmount: 1125,
        status: 'scheduled',
        triggeredBy: 'schedule',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        zoneId: '2',
        startTime: '07:30',
        duration: 60,
        waterAmount: 2100,
        frequency: 'daily',
        status: 'scheduled',
        triggeredBy: 'schedule',
        createdAt: new Date().toISOString()
      }
    ];

    const sampleSensors: IoTSensor[] = [
      {
        id: '1',
        farmId: 'farm1',
        name: 'Soil Moisture Sensor - Zone A',
        type: 'soil_moisture',
        location: {
          coordinates: [-15.3875, 28.3228],
          depth: 30
        },
        status: 'active',
        battery_level: 87,
        last_reading: new Date().toISOString(),
        reading_frequency: 30,
        calibration_date: '2024-08-01',
        next_calibration: '2025-02-01',
        readings: [
          {
            timestamp: new Date().toISOString(),
            value: 68,
            unit: '%',
            quality: 'good'
          }
        ],
        thresholds: [
          {
            parameter: 'soil_moisture',
            min_value: 40,
            alert_type: 'low',
            action_required: 'Start irrigation',
            notification_method: 'app'
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    storage.set('irrigation_systems', sampleSystems);
    storage.set('irrigation_zones', sampleZones);
    storage.set('irrigation_schedules', sampleSchedules);
    storage.set('iot_sensors', sampleSensors);
    
    setSystems(sampleSystems);
    setZones(sampleZones);
    setSchedules(sampleSchedules);
    setSensors(sampleSensors);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drip': return '💧';
      case 'sprinkler': return '🌧️';
      case 'flood': return '🌊';
      default: return '💧';
    }
  };

  const getWeatherRecommendation = () => {
    if (!weatherData) return 'No weather data available';
    
    if (weatherData.rainfall > 10) {
      return 'Heavy rain expected - Consider reducing irrigation';
    } else if (weatherData.temperature.max > 35) {
      return 'High temperature expected - Increase irrigation frequency';
    }
    return 'Normal irrigation schedule recommended';
  };

  const renderSystemsTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Droplets className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Systems</dt>
                <dd className="text-lg font-medium text-gray-900">{systems.length}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Coverage Area</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {systems.reduce((sum, sys) => sum + sys.coverage, 0).toFixed(1)} ha
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Avg. Efficiency</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {(systems.reduce((sum, sys) => sum + sys.efficiency, 0) / systems.length || 0).toFixed(1)}%
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Droplets className="h-6 w-6 text-cyan-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Active Sensors</dt>
                <dd className="text-lg font-medium text-gray-900">{sensors.length}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Integration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Cloud className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-blue-800">Weather-Based Irrigation Recommendation</h4>
            <p className="text-sm text-blue-700 mt-1">{getWeatherRecommendation()}</p>
            {weatherData && (
              <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                <div><span className="font-medium">Temp:</span> {weatherData.temperature.max}°C</div>
                <div><span className="font-medium">Humidity:</span> {weatherData.humidity}%</div>
                <div><span className="font-medium">Rainfall:</span> {weatherData.rainfall}mm</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Systems List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {systems.map((system) => (
            <li key={system.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl">{getTypeIcon(system.type)}</span>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">{system.name}</h3>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(system.status)}`}>
                        {system.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {system.type} • {system.coverage} ha • {system.efficiency}% efficiency
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {system.waterSource} • {system.pumpCapacity} L/h
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Irrigation Schedule</h3>
          <div className="mt-5 space-y-4">
            {schedules.map((schedule) => {
              const zone = zones.find(z => z.id === schedule.zoneId);
              return (
                <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{zone?.name}</h4>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          schedule.status === 'active' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>Start: {schedule.startTime}</div>
                        <div>Duration: {schedule.duration} min</div>
                        <div>Frequency: {schedule.frequency}</div>
                        <div>Water: {schedule.waterAmount} L</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 hover:text-green-800">
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-800">
                        <Pause className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSensorsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sensors.map((sensor) => {
          const latestReading = sensor.readings[sensor.readings.length - 1];
          return (
            <div key={sensor.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🌱</span>
                    <h4 className="text-sm font-medium text-gray-900">{sensor.name}</h4>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sensor.status)}`}>
                      {sensor.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>Type: {sensor.type.replace('_', ' ')}</div>
                    <div>Battery: {sensor.battery_level}%</div>
                    <div>Frequency: {sensor.reading_frequency} min</div>
                    {latestReading && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <div className="text-sm font-medium text-gray-900">Latest Reading</div>
                        <div className="text-lg font-bold text-green-600">
                          {latestReading.value} {latestReading.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(latestReading.timestamp)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-3 h-3 rounded-full ${
                    sensor.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <div className={`text-xs ${
                    (sensor.battery_level || 0) > 20 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sensor.battery_level}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Irrigation Scheduling</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage irrigation systems, schedule watering, and monitor with IoT sensors
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add System
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('systems')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'systems'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Droplets className="h-4 w-4 inline mr-2" />
            Systems
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'zones'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="h-4 w-4 inline mr-2" />
            Zones
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sensors'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Sensors
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'systems' && renderSystemsTab()}
        {activeTab === 'zones' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => {
              const system = systems.find(s => s.id === zone.systemId);
              return (
                <div key={zone.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{zone.name}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(zone.status)}`}>
                      {zone.status}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div>System: {system?.name}</div>
                    <div>Crop: {zone.cropType}</div>
                    <div>Area: {zone.area} ha</div>
                    <div>Water Need: {zone.waterRequirement} mm/day</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Start</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'sensors' && renderSensorsTab()}
      </div>
    </div>
  );
};

export default IrrigationScheduling;