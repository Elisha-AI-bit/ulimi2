import React, { useState, useEffect } from 'react';
import { 
  Plus, Wrench, Calendar, AlertTriangle, CheckCircle, 
  Clock, DollarSign, Settings, Eye, Edit, Trash2,
  TrendingUp, Tool, Battery, MapPin
} from 'lucide-react';
import { storage } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/zambia-data';
import type { Equipment, MaintenanceSchedule, RepairRecord } from '../types';

const EquipmentManagement: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [activeTab, setActiveTab] = useState<'equipment' | 'maintenance' | 'repairs'>('equipment');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [repairRecords, setRepairRecords] = useState<RepairRecord[]>([]);

  useEffect(() => {
    const savedEquipment = storage.get<Equipment[]>('equipment') || [];
    const savedMaintenance = storage.get<MaintenanceSchedule[]>('maintenance_schedules') || [];
    const savedRepairs = storage.get<RepairRecord[]>('repair_records') || [];
    
    setEquipment(savedEquipment);
    setMaintenanceSchedules(savedMaintenance);
    setRepairRecords(savedRepairs);

    if (savedEquipment.length === 0) {
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const sampleEquipment: Equipment[] = [
      {
        id: '1',
        farmId: 'farm1',
        name: 'John Deere 5075E',
        type: 'tractor',
        model: '5075E',
        manufacturer: 'John Deere',
        purchaseDate: '2022-03-15',
        purchasePrice: 85000,
        currentValue: 75000,
        status: 'active',
        location: 'Main Equipment Shed',
        operatingHours: 1250,
        fuelType: 'Diesel',
        specifications: {
          horsePower: 75,
          fuelCapacity: 150,
          weight: 3500,
          engineType: 'PowerTech 4045'
        },
        maintenanceSchedule: [],
        repairHistory: [],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        farmId: 'farm1',
        name: 'Disc Plow - 3 Furrow',
        type: 'plow',
        model: 'DP-3F',
        manufacturer: 'Massey Ferguson',
        purchaseDate: '2021-11-20',
        purchasePrice: 12000,
        currentValue: 8500,
        status: 'active',
        location: 'Implement Shed',
        operatingHours: 680,
        specifications: {
          workingWidth: 90,
          numberOfDiscs: 6,
          weight: 520
        },
        maintenanceSchedule: [],
        repairHistory: [],
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        farmId: 'farm1',
        name: 'Irrigation Pump',
        type: 'irrigation',
        model: 'IP-250',
        manufacturer: 'Grundfos',
        purchaseDate: '2023-01-10',
        purchasePrice: 15000,
        currentValue: 13500,
        status: 'maintenance',
        location: 'Pump House',
        operatingHours: 320,
        fuelType: 'Electric',
        specifications: {
          capacity: 250,
          headHeight: 80,
          power: 15
        },
        maintenanceSchedule: [],
        repairHistory: [],
        createdAt: new Date().toISOString()
      }
    ];

    const sampleMaintenance: MaintenanceSchedule[] = [
      {
        id: '1',
        equipmentId: '1',
        type: 'routine',
        description: 'Engine oil change and filter replacement',
        frequency: 100,
        frequencyType: 'hours',
        lastPerformed: '2024-07-15',
        nextDue: '2024-12-01',
        estimatedCost: 350,
        priority: 'high',
        status: 'scheduled'
      },
      {
        id: '2',
        equipmentId: '1',
        type: 'preventive',
        description: 'Hydraulic system inspection and fluid check',
        frequency: 200,
        frequencyType: 'hours',
        lastPerformed: '2024-06-10',
        nextDue: '2024-11-15',
        estimatedCost: 200,
        priority: 'medium',
        status: 'scheduled'
      },
      {
        id: '3',
        equipmentId: '3',
        type: 'routine',
        description: 'Pump impeller cleaning and inspection',
        frequency: 50,
        frequencyType: 'hours',
        nextDue: '2024-10-20',
        estimatedCost: 150,
        priority: 'critical',
        status: 'overdue'
      }
    ];

    const sampleRepairs: RepairRecord[] = [
      {
        id: '1',
        equipmentId: '1',
        date: '2024-08-10',
        description: 'Replaced hydraulic hose and fittings',
        cost: 450,
        partsReplaced: ['Hydraulic hose - 2m', 'Hydraulic fittings x4'],
        laborHours: 3,
        performedBy: 'Peter Mwansa - Certified Technician',
        status: 'completed'
      },
      {
        id: '2',
        equipmentId: '2',
        date: '2024-07-22',
        description: 'Sharpened disc blades and replaced worn bearings',
        cost: 280,
        partsReplaced: ['Disc blade sharpening', 'Ball bearings x2'],
        laborHours: 4,
        performedBy: 'Farm Workshop',
        status: 'completed'
      }
    ];

    storage.set('equipment', sampleEquipment);
    storage.set('maintenance_schedules', sampleMaintenance);
    storage.set('repair_records', sampleRepairs);
    
    setEquipment(sampleEquipment);
    setMaintenanceSchedules(sampleMaintenance);
    setRepairRecords(sampleRepairs);
  };

  const handleAddEquipment = (formData: any) => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      farmId: formData.farmId || 'farm1',
      name: formData.name,
      type: formData.type,
      model: formData.model,
      manufacturer: formData.manufacturer,
      purchaseDate: formData.purchaseDate,
      purchasePrice: parseFloat(formData.purchasePrice),
      currentValue: parseFloat(formData.currentValue || formData.purchasePrice),
      status: 'active',
      location: formData.location,
      operatingHours: parseInt(formData.operatingHours) || 0,
      fuelType: formData.fuelType,
      specifications: {},
      maintenanceSchedule: [],
      repairHistory: [],
      createdAt: new Date().toISOString()
    };

    const updatedEquipment = [...equipment, newEquipment];
    setEquipment(updatedEquipment);
    storage.set('equipment', updatedEquipment);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tractor': return '🚜';
      case 'plow': return '🔨';
      case 'harvester': return '🌾';
      case 'sprayer': return '💨';
      case 'irrigation': return '💧';
      default: return '🔧';
    }
  };

  const totalValue = equipment.reduce((sum, eq) => sum + eq.currentValue, 0);
  const activeEquipment = equipment.filter(eq => eq.status === 'active').length;
  const overdueMaintenances = maintenanceSchedules.filter(m => m.status === 'overdue').length;
  const totalMaintenanceCost = repairRecords.reduce((sum, repair) => sum + repair.cost, 0);

  const renderEquipmentTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Tool className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Equipment</dt>
                <dd className="text-lg font-medium text-gray-900">{equipment.length}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Active Equipment</dt>
                <dd className="text-lg font-medium text-gray-900">{activeEquipment}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Value</dt>
                <dd className="text-lg font-medium text-gray-900">{formatCurrency(totalValue)}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Overdue Maintenance</dt>
                <dd className="text-lg font-medium text-gray-900">{overdueMaintenances}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {equipment.map((item) => (
            <li key={item.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{item.manufacturer} {item.model}</span>
                      <span className="mx-2">•</span>
                      <span>{item.operatingHours}h</span>
                      {item.fuelType && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{item.fuelType}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{item.location}</span>
                      <span className="mx-2">•</span>
                      <span>Value: {formatCurrency(item.currentValue)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedEquipment(item)}
                    className="text-gray-400 hover:text-gray-600"
                  >
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

  const renderMaintenanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Maintenance Schedule</h3>
          <div className="mt-5">
            <div className="space-y-4">
              {maintenanceSchedules.map((schedule) => {
                const equipmentItem = equipment.find(eq => eq.id === schedule.equipmentId);
                return (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">{schedule.description}</h4>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(schedule.priority)}`}>
                            {schedule.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Equipment: {equipmentItem?.name} • {schedule.type} maintenance
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due: {formatDate(schedule.nextDue)}</span>
                          <span className="mx-2">•</span>
                          <span>Every {schedule.frequency} {schedule.frequencyType}</span>
                          <span className="mx-2">•</span>
                          <span>Est. Cost: {formatCurrency(schedule.estimatedCost)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600">
                          <CheckCircle className="h-4 w-4" />
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
    </div>
  );

  const renderRepairsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Repair History</h3>
          <div className="mt-5">
            <div className="space-y-4">
              {repairRecords.map((repair) => {
                const equipmentItem = equipment.find(eq => eq.id === repair.equipmentId);
                return (
                  <div key={repair.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{repair.description}</h4>
                        <p className="text-sm text-gray-600 mt-1">Equipment: {equipmentItem?.name}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Date: {formatDate(repair.date)}</span>
                          <span className="mx-2">•</span>
                          <span>Cost: {formatCurrency(repair.cost)}</span>
                          <span className="mx-2">•</span>
                          <span>Labor: {repair.laborHours}h</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Performed by: {repair.performedBy}</p>
                          {repair.partsReplaced.length > 0 && (
                            <p className="text-xs text-gray-500">Parts: {repair.partsReplaced.join(', ')}</p>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        repair.status === 'completed' ? 'bg-green-100 text-green-800' :
                        repair.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {repair.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddForm = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleAddEquipment(Object.fromEntries(formData));
          }}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Equipment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      name="type"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select Type</option>
                      <option value="tractor">Tractor</option>
                      <option value="plow">Plow</option>
                      <option value="harvester">Harvester</option>
                      <option value="sprayer">Sprayer</option>
                      <option value="irrigation">Irrigation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input
                      type="text"
                      name="model"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purchase Price (ZMW)</label>
                    <input
                      type="number"
                      name="purchasePrice"
                      step="0.01"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
                    <input
                      type="number"
                      name="operatingHours"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Equipment
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Equipment Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your farm equipment, schedule maintenance, and track repairs
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'equipment'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tool className="h-4 w-4 inline mr-2" />
            Equipment
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'maintenance'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Maintenance
          </button>
          <button
            onClick={() => setActiveTab('repairs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'repairs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wrench className="h-4 w-4 inline mr-2" />
            Repairs
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'equipment' && renderEquipmentTab()}
        {activeTab === 'maintenance' && renderMaintenanceTab()}
        {activeTab === 'repairs' && renderRepairsTab()}
      </div>

      {showAddForm && renderAddForm()}
    </div>
  );
};

export default EquipmentManagement;