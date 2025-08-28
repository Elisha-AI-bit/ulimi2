import React, { useState, useEffect } from 'react'
import { Droplets, Thermometer, CloudRain, Zap, Settings, Play, Pause, AlertTriangle, TrendingUp, Wifi, Battery } from 'lucide-react'

interface SensorReading {
  id: string
  type: 'moisture' | 'temperature' | 'humidity' | 'ph' | 'light'
  value: number
  unit: string
  timestamp: string
  zone: string
  status: 'normal' | 'warning' | 'critical'
}

interface IrrigationZone {
  id: string
  name: string
  status: 'active' | 'idle' | 'scheduled'
  isAutomated: boolean
  lastWatered: string
  nextScheduled?: string
  sensors: string[]
  thresholds: {
    moistureMin: number
    moistureMax: number
    temperatureMax: number
  }
}

interface IrrigationSchedule {
  id: string
  zoneId: string
  time: string
  duration: number
  frequency: 'daily' | 'weekly' | 'custom'
  isActive: boolean
}

const IoTSmartIrrigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'zones' | 'schedule' | 'sensors' | 'analytics'>('dashboard')
  const [sensorData, setSensorData] = useState<SensorReading[]>([])
  const [zones, setZones] = useState<IrrigationZone[]>([])
  const [schedules, setSchedules] = useState<IrrigationSchedule[]>([])
  const [isSystemActive, setIsSystemActive] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'weak'>('connected')

  // Simulate real-time sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const mockSensorData: SensorReading[] = [
        {
          id: '1',
          type: 'moisture',
          value: Math.random() * 100,
          unit: '%',
          timestamp: new Date().toISOString(),
          zone: 'Zone A',
          status: Math.random() > 0.8 ? 'warning' : 'normal'
        },
        {
          id: '2',
          type: 'temperature',
          value: 25 + Math.random() * 10,
          unit: '°C',
          timestamp: new Date().toISOString(),
          zone: 'Zone A',
          status: 'normal'
        },
        {
          id: '3',
          type: 'humidity',
          value: 40 + Math.random() * 40,
          unit: '%',
          timestamp: new Date().toISOString(),
          zone: 'Zone A',
          status: 'normal'
        },
        {
          id: '4',
          type: 'ph',
          value: 6.0 + Math.random() * 2,
          unit: 'pH',
          timestamp: new Date().toISOString(),
          zone: 'Zone A',
          status: 'normal'
        }
      ]
      setSensorData(mockSensorData)
    }, 5000)

    // Initialize zones
    setZones([
      {
        id: '1',
        name: 'Zone A - Maize Field',
        status: 'idle',
        isAutomated: true,
        lastWatered: '2024-01-15T08:00:00Z',
        nextScheduled: '2024-01-16T06:00:00Z',
        sensors: ['1', '2', '3', '4'],
        thresholds: {
          moistureMin: 40,
          moistureMax: 80,
          temperatureMax: 35
        }
      },
      {
        id: '2',
        name: 'Zone B - Vegetable Garden',
        status: 'active',
        isAutomated: false,
        lastWatered: '2024-01-15T10:30:00Z',
        sensors: ['5', '6'],
        thresholds: {
          moistureMin: 50,
          moistureMax: 85,
          temperatureMax: 32
        }
      }
    ])

    return () => clearInterval(interval)
  }, [])

  const handleZoneToggle = (zoneId: string) => {
    setZones(zones.map(zone =>
      zone.id === zoneId
        ? { ...zone, status: zone.status === 'active' ? 'idle' : 'active' }
        : zone
    ))
  }

  const handleAutomationToggle = (zoneId: string) => {
    setZones(zones.map(zone =>
      zone.id === zoneId
        ? { ...zone, isAutomated: !zone.isAutomated }
        : zone
    ))
  }

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'moisture': return <Droplets className="w-4 h-4" />
      case 'temperature': return <Thermometer className="w-4 h-4" />
      case 'humidity': return <CloudRain className="w-4 h-4" />
      case 'ph': return <Zap className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">System Status</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Wifi className={`w-4 h-4 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm">{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              onClick={() => setIsSystemActive(!isSystemActive)}
              className={`px-4 py-2 rounded-lg ${isSystemActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {isSystemActive ? 'Pause System' : 'Start System'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>System Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <Battery className="w-4 h-4 text-green-600" />
            <span>Power: 98%</span>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Efficiency: 94%</span>
          </div>
        </div>
      </div>

      {/* Real-time Sensor Readings */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Real-time Sensor Readings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensorData.map((sensor) => (
            <div key={sensor.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSensorIcon(sensor.type)}
                  <span className="font-medium capitalize">{sensor.type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sensor.status)}`}>
                  {sensor.status}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {sensor.value.toFixed(1)}{sensor.unit}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(sensor.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Zone Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{zone.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  zone.status === 'active' ? 'bg-green-100 text-green-700' :
                  zone.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {zone.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Last watered: {formatTime(zone.lastWatered)}</div>
                {zone.nextScheduled && (
                  <div>Next scheduled: {formatTime(zone.nextScheduled)}</div>
                )}
                <div className="flex items-center space-x-2">
                  <span>Automation:</span>
                  <span className={zone.isAutomated ? 'text-green-600' : 'text-gray-600'}>
                    {zone.isAutomated ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderZones = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Irrigation Zones</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Zone
          </button>
        </div>
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">{zone.name}</h4>
                  <p className="text-sm text-gray-600">{zone.sensors.length} sensors connected</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAutomationToggle(zone.id)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      zone.isAutomated 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Auto {zone.isAutomated ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => handleZoneToggle(zone.id)}
                    className={`p-2 rounded-lg ${
                      zone.status === 'active' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {zone.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Thresholds</h5>
                  <div className="space-y-1 text-sm">
                    <div>Moisture: {zone.thresholds.moistureMin}% - {zone.thresholds.moistureMax}%</div>
                    <div>Max Temp: {zone.thresholds.temperatureMax}°C</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Status</h5>
                  <div className="space-y-1 text-sm">
                    <div>Current: {zone.status}</div>
                    <div>Last watered: {formatTime(zone.lastWatered)}</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Actions</h5>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
                      Edit Settings
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">IoT Smart Irrigation</h1>
        <p className="text-gray-600">Monitor and control your irrigation system with real-time IoT sensors</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'zones', label: 'Zones', icon: <Droplets className="w-4 h-4" /> },
            { id: 'schedule', label: 'Schedule', icon: <Settings className="w-4 h-4" /> },
            { id: 'sensors', label: 'Sensors', icon: <Wifi className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'zones' && renderZones()}
      {activeTab === 'schedule' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Irrigation Schedule</h3>
          <p className="text-gray-600">Schedule management coming soon...</p>
        </div>
      )}
      {activeTab === 'sensors' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sensor Management</h3>
          <p className="text-gray-600">Sensor configuration coming soon...</p>
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Analytics & Reports</h3>
          <p className="text-gray-600">Analytics dashboard coming soon...</p>
        </div>
      )}
    </div>
  )
}

export default IoTSmartIrrigation