import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react';
import { storage } from '../utils/storage';
import { zambiaProvinces, zambiaDistricts, languages, formatDate } from '../utils/zambia-data';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { authState, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (authState.user) {
      // Merge auth user with additional profile data from storage
      const profileData = storage.get('user_profile_data') || {};
      const completeUser = {
        ...authState.user,
        farmingExperience: profileData.farmingExperience || 5,
        totalFarmSize: profileData.totalFarmSize || 10,
        primaryCrops: profileData.primaryCrops || ['Maize', 'Soybean'],
        joinedDate: authState.user.createdAt,
        preferences: {
          notifications: true,
          weatherAlerts: true,
          marketUpdates: true,
          aiRecommendations: true,
          ...profileData.preferences
        },
        stats: {
          totalFarms: 2,
          totalTasks: 15,
          completedTasks: 8,
          marketplaceListings: 3,
          ...profileData.stats
        }
      };
      setFormData(completeUser);
    }
  }, [authState.user]);

  const handleSave = () => {
    if (!authState.user) return;
    
    // Update auth user basic info
    const authUpdates = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      location: formData.location,
      language: formData.language
    };
    
    // Save additional profile data separately
    const profileData = {
      farmingExperience: formData.farmingExperience,
      totalFarmSize: formData.totalFarmSize,
      primaryCrops: formData.primaryCrops,
      preferences: formData.preferences,
      stats: formData.stats,
      updatedAt: new Date().toISOString()
    };
    
    storage.set('user_profile_data', profileData);
    updateProfile(authUpdates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (authState.user) {
      const profileData = storage.get('user_profile_data') || {};
      const completeUser = {
        ...authState.user,
        farmingExperience: profileData.farmingExperience || 5,
        totalFarmSize: profileData.totalFarmSize || 10,
        primaryCrops: profileData.primaryCrops || ['Maize', 'Soybean'],
        joinedDate: authState.user.createdAt,
        preferences: {
          notifications: true,
          weatherAlerts: true,
          marketUpdates: true,
          aiRecommendations: true,
          ...profileData.preferences
        },
        stats: {
          totalFarms: 2,
          totalTasks: 15,
          completedTasks: 8,
          marketplaceListings: 3,
          ...profileData.stats
        }
      };
      setFormData(completeUser);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  if (!authState.user || !formData.name) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = formData;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8 text-center">
                <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-green-600" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since {formatDate(user.joinedDate || user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3" />
                    {user.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    {user.location.district}, {user.location.province}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-3" />
                    {languages[user.language as keyof typeof languages]}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="mt-6 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{user.stats?.totalFarms || 0}</div>
                    <div className="text-sm text-gray-500">Farms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{user.stats?.totalTasks || 0}</div>
                    <div className="text-sm text-gray-500">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{user.stats?.completedTasks || 0}</div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{user.stats?.marketplaceListings || 0}</div>
                    <div className="text-sm text-gray-500">Listings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      {isEditing ? (
                        <select
                          value={formData.role || ''}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="farmer">Farmer</option>
                          <option value="supplier">Supplier</option>
                          <option value="buyer">Buyer</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Location</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Province</label>
                      {isEditing ? (
                        <select
                          value={formData.location?.province || ''}
                          onChange={(e) => handleInputChange('location.province', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Province</option>
                          {zambiaProvinces.map(province => (
                            <option key={province} value={province}>{province}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.location.province}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">District</label>
                      {isEditing ? (
                        <select
                          value={formData.location?.district || ''}
                          onChange={(e) => handleInputChange('location.district', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select District</option>
                          {formData.location?.province && zambiaDistricts[formData.location.province]?.map(district => (
                            <option key={`${formData.location?.province}-${district}`} value={district}>{district}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.location.district}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Farming Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Farming Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.farmingExperience || ''}
                          onChange={(e) => handleInputChange('farmingExperience', parseInt(e.target.value))}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.farmingExperience} years</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Farm Size (hectares)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={formData.totalFarmSize || ''}
                          onChange={(e) => handleInputChange('totalFarmSize', parseFloat(e.target.value))}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.totalFarmSize} hectares</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Primary Crops</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.primaryCrops?.join(', ') || ''}
                        onChange={(e) => handleInputChange('primaryCrops', e.target.value.split(', ').filter(Boolean))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter crops separated by commas"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user.primaryCrops?.join(', ')}</p>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Preferences</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Language</label>
                      {isEditing ? (
                        <select
                          value={formData.language || ''}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          {Object.entries(languages).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{languages[user.language as keyof typeof languages]}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifications"
                          checked={formData.preferences?.notifications || false}
                          onChange={(e) => handleInputChange('preferences.notifications', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                          Enable notifications
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="weatherAlerts"
                          checked={formData.preferences?.weatherAlerts || false}
                          onChange={(e) => handleInputChange('preferences.weatherAlerts', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="weatherAlerts" className="ml-2 block text-sm text-gray-900">
                          Weather alerts
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="marketUpdates"
                          checked={formData.preferences?.marketUpdates || false}
                          onChange={(e) => handleInputChange('preferences.marketUpdates', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="marketUpdates" className="ml-2 block text-sm text-gray-900">
                          Market updates
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="aiRecommendations"
                          checked={formData.preferences?.aiRecommendations || false}
                          onChange={(e) => handleInputChange('preferences.aiRecommendations', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="aiRecommendations" className="ml-2 block text-sm text-gray-900">
                          AI recommendations
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}