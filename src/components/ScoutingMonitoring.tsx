import React, { useState, useEffect } from 'react';
import { 
  Plus, Eye, Camera, MapPin, AlertTriangle, CheckCircle, 
  Search, Filter, Calendar, Clock, Target, TrendingUp,
  Bug, Leaf, Droplets, Edit, Trash2, Upload
} from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';
import type { ScoutingReport, ScoutingObservation, FieldMap, Farm } from '../types';

const ScoutingMonitoring: React.FC = () => {
  const [reports, setReports] = useState<ScoutingReport[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'observations' | 'maps' | 'analytics'>('reports');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScoutingReport | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fieldMaps, setFieldMaps] = useState<FieldMap[]>([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedReports = storage.get<ScoutingReport[]>('scouting_reports') || [];
    const savedFarms = storage.getFarms();
    const savedMaps = storage.get<FieldMap[]>('field_maps') || [];
    
    setReports(savedReports);
    setFarms(savedFarms);
    setFieldMaps(savedMaps);

    if (savedReports.length === 0) {
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const sampleReports: ScoutingReport[] = [
      {
        id: '1',
        farmId: 'farm1',
        cropId: 'crop1',
        scoutedBy: 'Mirriam',
        date: new Date().toISOString(),
        location: {
          fieldName: 'Main Maize Field',
          coordinates: [-15.3875, 28.3228],
          area: 'North Section'
        },
        observations: [
          {
            id: 'obs1',
            category: 'pest',
            severity: 'medium',
            description: 'Fall armyworm larvae found on young maize plants',
            affected_area: 15,
            pest_species: 'Fall Armyworm (Spodoptera frugiperda)',
            immediate_action: true,
            estimated_loss: 5,
            photos: [],
            gps_coordinates: [-15.3875, 28.3228]
          },
          {
            id: 'obs2',
            category: 'nutrition',
            severity: 'low',
            description: 'Slight yellowing of lower leaves indicating nitrogen deficiency',
            affected_area: 25,
            deficiency_type: 'Nitrogen',
            immediate_action: false,
            estimated_loss: 2,
            photos: []
          }
        ],
        overallHealth: 'good',
        recommendations: [
          'Apply insecticide for fall armyworm control',
          'Consider nitrogen fertilizer application',
          'Continue regular monitoring'
        ],
        urgentActions: [
          'Spray affected areas with approved insecticide within 48 hours'
        ],
        photos: [],
        weatherConditions: {
          temperature: 26,
          humidity: 68,
          windSpeed: 8,
          conditions: 'Partly cloudy'
        },
        nextScoutingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'submitted',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        farmId: 'farm1',
        cropId: 'crop2',
        scoutedBy: 'Natasha',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: {
          fieldName: 'Soybean Field',
          coordinates: [-15.3885, 28.3238],
          area: 'East Section'
        },
        observations: [
          {
            id: 'obs3',
            category: 'disease',
            severity: 'high',
            description: 'Rust disease spots on soybean leaves',
            affected_area: 40,
            disease_type: 'Soybean Rust',
            immediate_action: true,
            estimated_loss: 15,
            photos: []
          }
        ],
        overallHealth: 'fair',
        recommendations: [
          'Apply fungicide treatment immediately',
          'Improve field drainage',
          'Monitor closely for disease spread'
        ],
        urgentActions: [
          'Emergency fungicide application required'
        ],
        photos: [],
        weatherConditions: {
          temperature: 24,
          humidity: 75,
          windSpeed: 5,
          conditions: 'Overcast'
        },
        nextScoutingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'actioned',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const sampleMaps: FieldMap[] = [
      {
        id: '1',
        farmId: 'farm1',
        name: 'Main Farm Layout',
        boundaries: [
          [-15.3870, 28.3220],
          [-15.3880, 28.3220],
          [-15.3880, 28.3240],
          [-15.3870, 28.3240]
        ],
        area: 5.0,
        soilType: 'Clay loam',
        zones: [
          {
            id: 'zone1',
            fieldId: '1',
            name: 'North Section',
            boundaries: [
              [-15.3870, 28.3220],
              [-15.3875, 28.3220],
              [-15.3875, 28.3230],
              [-15.3870, 28.3230]
            ],
            area: 2.5,
            soilCharacteristics: {
              ph: 6.5,
              organic_matter: 3.2,
              nitrogen: 45,
              phosphorus: 25,
              potassium: 180,
              texture: 'Clay loam'
            },
            crop_history: ['Maize', 'Soybeans', 'Groundnuts'],
            productivity_index: 85,
            special_notes: 'Good drainage, suitable for cereals'
          },
          {
            id: 'zone2',
            fieldId: '1',
            name: 'South Section',
            boundaries: [
              [-15.3875, 28.3220],
              [-15.3880, 28.3220],
              [-15.3880, 28.3240],
              [-15.3875, 28.3240]
            ],
            area: 2.5,
            soilCharacteristics: {
              ph: 6.8,
              organic_matter: 2.8,
              nitrogen: 40,
              phosphorus: 30,
              potassium: 160,
              texture: 'Sandy loam'
            },
            crop_history: ['Vegetables', 'Legumes'],
            productivity_index: 78,
            special_notes: 'Requires more irrigation'
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    storage.set('scouting_reports', sampleReports);
    storage.set('field_maps', sampleMaps);
    
    setReports(sampleReports);
    setFieldMaps(sampleMaps);
  };

  const handleAddReport = (formData: any) => {
    const newReport: ScoutingReport = {
      id: Date.now().toString(),
      farmId: formData.farmId || 'farm1',
      cropId: formData.cropId || 'crop1',
      scoutedBy: formData.scoutedBy || storage.getUser()?.name || 'User',
      date: formData.date,
      location: {
        fieldName: formData.fieldName,
        area: formData.area
      },
      observations: [],
      overallHealth: formData.overallHealth,
      recommendations: formData.recommendations ? [formData.recommendations] : [],
      urgentActions: formData.urgentActions ? [formData.urgentActions] : [],
      photos: [],
      weatherConditions: {
        temperature: parseFloat(formData.temperature) || 25,
        humidity: parseFloat(formData.humidity) || 60,
        windSpeed: parseFloat(formData.windSpeed) || 5,
        conditions: formData.conditions || 'Clear'
      },
      nextScoutingDate: formData.nextScoutingDate,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    storage.set('scouting_reports', updatedReports);
    setShowAddForm(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pest': return <Bug className="h-4 w-4" />;
      case 'disease': return <AlertTriangle className="h-4 w-4" />;
      case 'weed': return <Leaf className="h-4 w-4" />;
      case 'nutrition': return <Target className="h-4 w-4" />;
      case 'irrigation': return <Droplets className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.location.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.scoutedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || 
      report.observations.some(obs => obs.severity === filterSeverity);
    
    return matchesSearch && matchesSeverity;
  });

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Reports</dt>
                <dd className="text-lg font-medium text-gray-900">{reports.length}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Critical Issues</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {reports.reduce((count, report) => 
                    count + report.observations.filter(obs => obs.severity === 'critical').length, 0
                  )}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Pending Actions</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {reports.filter(r => r.status === 'submitted').length}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Avg Health Score</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {reports.length > 0 ? 
                    Math.round(reports.filter(r => r.overallHealth === 'excellent' || r.overallHealth === 'good').length / reports.length * 100) 
                    : 0}%
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <li key={report.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthColor(report.overallHealth)}`}>
                        {report.overallHealth}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{report.location.fieldName}</h3>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-sm text-gray-500">by {report.scoutedBy}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{report.location.area}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(report.date)}</span>
                        <span className="mx-2">•</span>
                        <span>{report.observations.length} observations</span>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        {report.observations.slice(0, 3).map((obs, index) => (
                          <div key={index} className="flex items-center">
                            {getCategoryIcon(obs.category)}
                            <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(obs.severity)}`}>
                              {obs.severity}
                            </span>
                          </div>
                        ))}
                        {report.observations.length > 3 && (
                          <span className="text-xs text-gray-500">+{report.observations.length - 3} more</span>
                        )}
                      </div>
                      {report.urgentActions.length > 0 && (
                        <div className="mt-2 text-sm text-red-600">
                          <AlertTriangle className="h-4 w-4 inline mr-1" />
                          Urgent action required
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scouting reports</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first scouting report.</p>
          </div>
        )}
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
            handleAddReport(Object.fromEntries(formData));
          }}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">New Scouting Report</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field Name</label>
                  <input
                    type="text"
                    name="fieldName"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area/Section</label>
                    <input
                      type="text"
                      name="area"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Overall Health</label>
                  <select
                    name="overallHealth"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select health status</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Recommendations</label>
                  <textarea
                    name="recommendations"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter recommendations..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Scouting Date</label>
                  <input
                    type="date"
                    name="nextScoutingDate"
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
                Create Report
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
          <h1 className="text-2xl font-semibold text-gray-900">Scouting & Monitoring</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track field conditions, identify issues, and monitor crop health
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Reports
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'observations'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bug className="h-4 w-4 inline mr-2" />
            Observations
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'maps'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MapPin className="h-4 w-4 inline mr-2" />
            Field Maps
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'observations' && (
          <div className="text-center py-12">
            <Bug className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Observation Details</h3>
            <p className="mt-1 text-sm text-gray-500">View detailed observations from scouting reports</p>
          </div>
        )}
        {activeTab === 'maps' && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Field Mapping</h3>
            <p className="mt-1 text-sm text-gray-500">Interactive field maps and zone management</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Scouting Analytics</h3>
            <p className="mt-1 text-sm text-gray-500">Trends and insights from field monitoring data</p>
          </div>
        )}
      </div>

      {showAddForm && renderAddForm()}
    </div>
  );
};

export default ScoutingMonitoring;