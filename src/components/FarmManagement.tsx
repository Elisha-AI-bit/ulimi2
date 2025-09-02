import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Sprout, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseDataService } from '../services/supabaseDataService';
import { zambiaProvinces, zambiaDistricts, commonCrops, formatDate } from '../utils/zambia-data';
import { Farm } from '../types';

export default function FarmManagement() {
  const { authState } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showCropForm, setShowCropForm] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  useEffect(() => {
    if (authState.user) {
      loadFarms();
    }
  }, [authState.user]);

  const loadFarms = async () => {
    if (!authState.user) return;
    
    setLoading(true);
    try {
      const userFarms = await SupabaseDataService.getFarms(authState.user.id);
      setFarms(userFarms);
    } catch (error) {
      console.error('Error loading farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarm = async (formData: any) => {
    try {
      const newFarm: Omit<Farm, 'id' | 'createdAt' | 'crops'> = {
        farmerId: authState.user!.id,
        name: formData.name,
        size: parseFloat(formData.size) || 0,
        location: {
          province: formData.province,
          district: formData.district,
          coordinates: [parseFloat(formData.longitude) || 0, parseFloat(formData.latitude) || 0]
        },
        soilType: formData.soilType
        // Note: crops are stored separately in the crops table, not as part of the farm object
      };

      const createdFarm = await SupabaseDataService.createFarm(newFarm);
      
      if (createdFarm) {
        setFarms([...farms, createdFarm]);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding farm:', error);
    }
  };

  const handleAddCrop = async (formData: any) => {
    // Implementation would depend on how crops are stored in Supabase
    console.log('Adding crop:', formData);
    setShowCropForm(false);
  };

  const deleteFarm = async (farmId: string) => {
    if (!confirm('Are you sure you want to delete this farm?')) return;
    
    try {
      const success = await SupabaseDataService.deleteFarm(farmId);
      
      if (success) {
        setFarms(farms.filter(farm => farm.id !== farmId));
      }
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Farm Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your farms, crops, and agricultural operations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </button>
        </div>
      </div>

      {/* Farms Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm) => (
          <div key={farm.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{farm.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFarm(farm)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteFarm(farm.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {farm.location.district}, {farm.location.province}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Sprout className="h-4 w-4 mr-2" />
                  {farm.size} hectares
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {/* Farm crops would be loaded separately */}
                  Crop information loading...
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500">Soil Type: {farm.soilType}</div>
                <div className="text-sm text-gray-500">Created: {formatDate(farm.createdAt)}</div>
              </div>
            </div>
          </div>
        ))}

        {farms.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Sprout className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No farms</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first farm.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Farm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Farm Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddFarm(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Farm</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Farm Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter farm name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Size (hectares)</label>
                      <input
                        type="number"
                        name="size"
                        step="0.1"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter farm size"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Province</label>
                        <select
                          name="province"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          onChange={(e) => setSelectedProvince(e.target.value)}
                        >
                          <option value="">Select Province</option>
                          {zambiaProvinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <select
                          name="district"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          disabled={!selectedProvince}
                        >
                          <option value="">Select District</option>
                          {selectedProvince && zambiaDistricts[selectedProvince]?.map(district => (
                            <option key={`${selectedProvince}-${district}`} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input
                          type="number"
                          name="latitude"
                          step="0.0001"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Enter latitude"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input
                          type="number"
                          name="longitude"
                          step="0.0001"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Enter longitude"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Soil Type</label>
                      <input
                        type="text"
                        name="soilType"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter soil type"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Farm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}