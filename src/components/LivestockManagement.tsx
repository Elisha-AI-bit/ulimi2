import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Milk, 
  Egg, 
  Beef, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Stethoscope,
  Sprout
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseDataService } from '../services/supabaseDataService';
import { Livestock, LivestockHealthRecord, LivestockBreedingRecord } from '../types';
import { zambiaProvinces, zambiaDistricts, formatDate } from '../utils/zambia-data';

const LivestockManagement: React.FC = () => {
  const { authState } = useAuth();
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [healthRecords, setHealthRecords] = useState<LivestockHealthRecord[]>([]);
  const [breedingRecords, setBreedingRecords] = useState<LivestockBreedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [showBreedingForm, setShowBreedingForm] = useState(false);
  const [selectedLivestock, setSelectedLivestock] = useState<Livestock | null>(null);
  const [activeTab, setActiveTab] = useState<'livestock' | 'health' | 'breeding' | 'reports'>('livestock');

  useEffect(() => {
    if (authState.user) {
      loadLivestockData();
    }
  }, [authState.user]);

  const loadLivestockData = async () => {
    // In a real implementation, this would fetch data from Supabase
    // For now, we'll use mock data
    const mockLivestock: Livestock[] = [
      {
        id: '1',
        farmId: 'farm1',
        name: 'Dairy Cows',
        type: 'cattle',
        breed: 'Friesian',
        quantity: 12,
        age: 36,
        weight: 650,
        healthStatus: 'healthy',
        lastVaccinationDate: '2025-08-15',
        nextVaccinationDate: '2025-11-15',
        feedType: 'Silage and Concentrates',
        dailyFeedAmount: 15,
        waterSource: 'Borehole',
        housingType: 'Free Stall Barn',
        breedingStatus: 'lactating',
        milkProduction: 18,
        dailyActivityLevel: 'high',
        location: {
          penNumber: 'Barn A',
          coordinates: [-15.4067, 28.2871]
        },
        notes: 'High-producing herd',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        farmId: 'farm1',
        name: 'Goats',
        type: 'goat',
        breed: 'Boer',
        quantity: 25,
        age: 18,
        weight: 65,
        healthStatus: 'healthy',
        lastVaccinationDate: '2025-08-20',
        nextVaccinationDate: '2025-11-20',
        feedType: 'Pasture and Supplements',
        dailyFeedAmount: 2,
        waterSource: 'River',
        housingType: 'Open Pen',
        breedingStatus: 'breeding',
        dailyActivityLevel: 'high',
        location: {
          penNumber: 'Pen C',
          coordinates: [-15.4067, 28.2871]
        },
        notes: 'Breeding stock',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        farmId: 'farm1',
        name: 'Layers',
        type: 'chicken',
        breed: 'Rhode Island Red',
        quantity: 150,
        age: 8,
        weight: 2.5,
        healthStatus: 'healthy',
        lastVaccinationDate: '2025-08-10',
        nextVaccinationDate: '2025-11-10',
        feedType: 'Layer Mash',
        dailyFeedAmount: 0.12,
        waterSource: 'Tank',
        housingType: 'Battery Cage',
        breedingStatus: 'not_breeding',
        eggsProduced: 135,
        dailyActivityLevel: 'medium',
        location: {
          penNumber: 'Chicken House',
          coordinates: [-15.4067, 28.2871]
        },
        notes: 'Peak laying season',
        createdAt: new Date().toISOString()
      }
    ];

    const mockHealthRecords: LivestockHealthRecord[] = [
      {
        id: '1',
        livestockId: '1',
        date: '2025-08-15',
        veterinarian: 'Dr. Mwansa',
        diagnosis: 'Routine Checkup',
        treatment: 'Vaccination',
        medication: 'Foot and Mouth Vaccine',
        dosage: '2ml per animal',
        duration: 'Single dose',
        cost: 1200,
        followUpRequired: false,
        notes: 'All animals healthy',
        createdAt: new Date().toISOString()
      }
    ];

    const mockBreedingRecords: LivestockBreedingRecord[] = [
      {
        id: '1',
        livestockId: '2',
        breedingDate: '2025-07-20',
        breedingMethod: 'natural',
        sireName: 'Boer Buck #5',
        expectedDeliveryDate: '2026-01-15',
        offspringCount: 2,
        complications: '',
        assistanceRequired: false,
        cost: 0,
        notes: 'Successful breeding',
        createdAt: new Date().toISOString()
      }
    ];

    setLivestock(mockLivestock);
    setHealthRecords(mockHealthRecords);
    setBreedingRecords(mockBreedingRecords);
    setLoading(false);
  };

  const getLivestockIcon = (type: string) => {
    switch (type) {
      case 'cattle':
        return <Beef className="h-5 w-5" />;
      case 'goat':
        return <Sprout className="h-5 w-5" />;
      case 'sheep':
        return <Sprout className="h-5 w-5" />;
      case 'pig':
        return <Sprout className="h-5 w-5" />;
      case 'chicken':
        return <Egg className="h-5 w-5" />;
      default:
        return <Sprout className="h-5 w-5" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'ill':
        return 'text-red-600 bg-red-100';
      case 'recovering':
        return 'text-yellow-600 bg-yellow-100';
      case 'quarantined':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderLivestockTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Beef className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Animals</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {livestock.reduce((sum, l) => sum + l.quantity, 0)}
                </dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Healthy</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {livestock.filter(l => l.healthStatus === 'healthy').reduce((sum, l) => sum + l.quantity, 0)}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Milk className="h-6 w-6 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Daily Milk (L)</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {livestock.reduce((sum, l) => sum + (l.milkProduction || 0) * l.quantity, 0)}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Egg className="h-6 w-6 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Daily Eggs</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {livestock.reduce((sum, l) => sum + (l.eggsProduced || 0), 0)}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livestock List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {livestock.map((animal) => (
            <li key={animal.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    {getLivestockIcon(animal.type)}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">{animal.name}</h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthStatusColor(animal.healthStatus)}`}>
                        {animal.healthStatus}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span className="capitalize">{animal.type} • {animal.breed}</span>
                      <span className="mx-2">•</span>
                      <span>{animal.quantity} animals</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedLivestock(animal)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {livestock.length === 0 && (
        <div className="text-center py-12">
          <Beef className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No livestock</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first livestock.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Livestock
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHealthTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Health Records</h3>
            <button
              onClick={() => setShowHealthForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Record
            </button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {healthRecords.map((record) => (
            <li key={record.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {livestock.find(l => l.id === record.livestockId)?.name || 'Unknown Livestock'}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(record.date)}</span>
                      <span className="mx-2">•</span>
                      <span>Dr. {record.veterinarian}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderBreedingTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Breeding Records</h3>
            <button
              onClick={() => setShowBreedingForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Record
            </button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {breedingRecords.map((record) => (
            <li key={record.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {livestock.find(l => l.id === record.livestockId)?.name || 'Unknown Livestock'}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Breeding: {formatDate(record.breedingDate)}</span>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Expected Delivery: {formatDate(record.expectedDeliveryDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Livestock Reports</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Productivity and health analytics</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Livestock Value</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(
                  livestock.reduce((sum, l) => sum + (l.weight * l.quantity * 50), 0)
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Monthly Feed Cost</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(
                  livestock.reduce((sum, l) => sum + (l.dailyFeedAmount * l.quantity * 30 * 25), 0)
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Health Incidents</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {healthRecords.length} records in the last 30 days
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Breeding Success Rate</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {breedingRecords.length > 0 
                  ? `${Math.round((breedingRecords.filter(r => r.offspringCount && r.offspringCount > 0).length / breedingRecords.length) * 100)}%`
                  : 'No data'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Livestock Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your livestock, health records, and breeding programs
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Livestock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('livestock')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'livestock'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Beef className="h-4 w-4 inline mr-2" />
            Livestock
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'health'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Heart className="h-4 w-4 inline mr-2" />
            Health Records
          </button>
          <button
            onClick={() => setActiveTab('breeding')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'breeding'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Breeding
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Reports
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'livestock' && renderLivestockTab()}
        {activeTab === 'health' && renderHealthTab()}
        {activeTab === 'breeding' && renderBreedingTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </div>

      {/* Add Livestock Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Livestock</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Livestock Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="e.g., Dairy Cows, Goats, Chickens"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm">
                        <option value="cattle">Cattle</option>
                        <option value="goat">Goat</option>
                        <option value="sheep">Sheep</option>
                        <option value="pig">Pig</option>
                        <option value="chicken">Chicken</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Breed</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="e.g., Friesian, Boer"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Number of animals"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Average Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Weight per animal"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Health Status</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm">
                      <option value="healthy">Healthy</option>
                      <option value="ill">Ill</option>
                      <option value="recovering">Recovering</option>
                      <option value="quarantined">Quarantined</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Additional information about this livestock"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Livestock
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockManagement;