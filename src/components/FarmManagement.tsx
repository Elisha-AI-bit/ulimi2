import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Sprout, Edit, Trash2, Eye } from 'lucide-react';
import { storage } from '../utils/storage';
import { zambiaProvinces, zambiaDistricts, commonCrops, formatDate } from '../utils/zambia-data';

export default function FarmManagement() {
  const [farms, setFarms] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [showCropForm, setShowCropForm] = useState(false);

  useEffect(() => {
    setFarms(storage.getFarms());
  }, []);

  const saveFarms = (updatedFarms: any[]) => {
    setFarms(updatedFarms);
    storage.saveFarms(updatedFarms);
  };

  const handleAddFarm = (formData: any) => {
    const newFarm = {
      id: Date.now().toString(),
      farmerId: storage.getUser()?.id || 'user1',
      name: formData.name,
      size: parseFloat(formData.size),
      location: {
        province: formData.province,
        district: formData.district,
        coordinates: [parseFloat(formData.longitude) || 0, parseFloat(formData.latitude) || 0]
      },
      soilType: formData.soilType,
      crops: [],
      createdAt: new Date().toISOString()
    };

    const updatedFarms = [...farms, newFarm];
    saveFarms(updatedFarms);
    setShowAddForm(false);
  };

  const handleAddCrop = (formData: any) => {
    const newCrop = {
      id: Date.now().toString(),
      farmId: selectedFarm.id,
      name: formData.cropName,
      variety: formData.variety,
      plantingDate: formData.plantingDate,
      expectedHarvestDate: formData.expectedHarvestDate,
      area: parseFloat(formData.area),
      status: 'planned',
      tasks: [],
      inventory: []
    };

    const updatedFarms = farms.map(farm => 
      farm.id === selectedFarm.id 
        ? { ...farm, crops: [...farm.crops, newCrop] }
        : farm
    );

    saveFarms(updatedFarms);
    setShowCropForm(false);
    setSelectedFarm({ ...selectedFarm, crops: [...selectedFarm.crops, newCrop] });
  };

  const deleteFarm = (farmId: string) => {
    if (confirm('Are you sure you want to delete this farm?')) {
      const updatedFarms = farms.filter(farm => farm.id !== farmId);
      saveFarms(updatedFarms);
    }
  };

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
                  {farm.crops.length} crops planted
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
                        >
                          <option value="">Select District</option>
                          {zambiaProvinces.flatMap(province => 
                            zambiaDistricts[province]?.map(district => (
                              <option key={district} value={district}>{district}</option>
                            )) || []
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Soil Type</label>
                      <select
                        name="soilType"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select Soil Type</option>
                        <option value="Clay">Clay</option>
                        <option value="Sandy">Sandy</option>
                        <option value="Loam">Loam</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Clay Loam">Clay Loam</option>
                      </select>
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

      {/* Farm Details Modal */}
      {selectedFarm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedFarm(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{selectedFarm.name}</h3>
                  <button
                    onClick={() => setShowCropForm(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Crop
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Farm Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Size:</span> {selectedFarm.size} hectares</div>
                        <div><span className="font-medium">Location:</span> {selectedFarm.location.district}, {selectedFarm.location.province}</div>
                        <div><span className="font-medium">Soil Type:</span> {selectedFarm.soilType}</div>
                        <div><span className="font-medium">Created:</span> {formatDate(selectedFarm.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3">Crops ({selectedFarm.crops.length})</h4>
                    {selectedFarm.crops.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedFarm.crops.map((crop: any) => (
                          <div key={crop.id} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">{crop.name}</h5>
                            <p className="text-sm text-gray-600">{crop.variety}</p>
                            <div className="mt-2 space-y-1 text-sm text-gray-500">
                              <div>Area: {crop.area} ha</div>
                              <div>Planted: {formatDate(crop.plantingDate)}</div>
                              <div>Status: <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                crop.status === 'harvested' ? 'bg-green-100 text-green-800' :
                                crop.status === 'growing' ? 'bg-yellow-100 text-yellow-800' :
                                crop.status === 'planted' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>{crop.status}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Sprout className="mx-auto h-8 w-8 mb-2" />
                        <p>No crops planted yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setSelectedFarm(null)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
      {showCropForm && selectedFarm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCropForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddCrop(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Crop to {selectedFarm.name}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Crop</label>
                      <select
                        name="cropName"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select Crop</option>
                        {commonCrops.map(crop => (
                          <option key={crop.name} value={crop.name}>{crop.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Variety</label>
                      <input
                        type="text"
                        name="variety"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter variety"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Area (hectares)</label>
                      <input
                        type="number"
                        name="area"
                        step="0.1"
                        required
                        max={selectedFarm.size}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter area"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Planting Date</label>
                        <input
                          type="date"
                          name="plantingDate"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expected Harvest</label>
                        <input
                          type="date"
                          name="expectedHarvestDate"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Crop
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCropForm(false)}
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