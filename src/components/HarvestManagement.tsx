import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Package, TrendingUp, Star, AlertCircle } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';
import { HarvestPlan, HarvestRecord, QualityAssessment } from '../types';

export default function HarvestManagement() {
  const [activeTab, setActiveTab] = useState<'plans' | 'records' | 'quality' | 'analytics'>('plans');
  const [harvestPlans, setHarvestPlans] = useState<HarvestPlan[]>([]);
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>([]);
  const [qualityAssessments, setQualityAssessments] = useState<QualityAssessment[]>([]);
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);

  useEffect(() => {
    initializeSampleData();
  }, []);

  const initializeSampleData = () => {
    // Sample harvest plans
    const samplePlans: HarvestPlan[] = [
      {
        id: 'plan1',
        farmId: 'farm1',
        cropId: 'crop1',
        plannedStartDate: '2024-04-10',
        plannedEndDate: '2024-04-20',
        estimatedYield: 4500,
        harvestMethod: 'manual',
        equipmentNeeded: ['Hand tools', 'Sacks'],
        laborRequired: 8,
        storageArranged: true,
        marketingPlan: 'Local market sales',
        qualityTargets: [{
          parameter: 'moisture',
          target_max: 14,
          unit: '%',
          importance: 'critical'
        }],
        logisticsArrangements: ['Transport truck booked'],
        status: 'planned',
        createdAt: new Date().toISOString()
      },
      {
        id: 'plan2',
        farmId: 'farm1',
        cropId: 'crop2',
        plannedStartDate: '2024-05-15',
        plannedEndDate: '2024-05-25',
        estimatedYield: 2200,
        harvestMethod: 'mechanical',
        equipmentNeeded: ['Combine harvester'],
        laborRequired: 4,
        storageArranged: true,
        marketingPlan: 'Cooperative sales',
        qualityTargets: [{
          parameter: 'protein',
          target_min: 35,
          unit: '%',
          importance: 'important'
        }],
        logisticsArrangements: ['Equipment rental confirmed'],
        status: 'planned',
        createdAt: new Date().toISOString()
      }
    ];

    // Sample harvest records
    const sampleRecords: HarvestRecord[] = [
      {
        id: 'record1',
        harvestPlanId: 'plan1',
        farmId: 'farm1',
        cropId: 'crop1',
        date: '2024-04-12',
        area_harvested: 3.5,
        quantity_harvested: 4200,
        quality_grade: 'Grade A',
        moisture_content: 13.2,
        foreign_matter: 1.1,
        broken_grains: 2.3,
        market_price: 4.50,
        storage_location: 'Main Storage Facility',
        harvested_by: ['Mirriam Banda', 'Peter Phiri'],
        equipment_used: ['Hand tools'],
        weather_conditions: 'Clear and dry',
        yield_per_hectare: 1200,
        total_revenue: 18900,
        harvest_costs: 2300,
        profit_margin: 87.8,
        quality_assessment: {
          overall_grade: 'Grade A',
          parameters: [
            { parameter: 'moisture', value: 13.2, unit: '%', meets_target: true },
            { parameter: 'protein', value: 9.8, unit: '%', meets_target: true }
          ],
          market_acceptability: 'excellent',
          price_impact: 5,
          storage_recommendation: 'Store in dry conditions',
          processing_suitability: ['milling', 'export']
        },
        photos: [],
        notes: 'Good quality harvest, slightly lower yield due to dry spell',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setHarvestPlans(samplePlans);
    setHarvestRecords(sampleRecords);
    // Quality assessments are now part of harvest records
    setQualityAssessments([]);
  };

  const handleAddPlan = (formData: any) => {
    const newPlan: HarvestPlan = {
      id: Date.now().toString(),
      farmId: formData.farmId || 'farm1',
      cropId: formData.cropId || 'crop1',
      plannedStartDate: formData.plannedStartDate,
      plannedEndDate: formData.plannedEndDate,
      estimatedYield: parseFloat(formData.estimatedYield),
      harvestMethod: formData.harvestMethod,
      equipmentNeeded: formData.equipmentNeeded ? formData.equipmentNeeded.split(',') : [],
      laborRequired: parseFloat(formData.laborRequired) || 0,
      storageArranged: formData.storageArranged === 'true',
      marketingPlan: formData.marketingPlan || '',
      qualityTargets: [],
      logisticsArrangements: formData.logisticsArrangements ? formData.logisticsArrangements.split(',') : [],
      status: 'planned',
      createdAt: new Date().toISOString()
    };

    setHarvestPlans(prev => [...prev, newPlan]);
    setShowAddPlanForm(false);
  };

  const handleAddRecord = (formData: any) => {
    const newRecord: HarvestRecord = {
      id: Date.now().toString(),
      harvestPlanId: formData.harvestPlanId || 'plan1',
      farmId: formData.farmId || 'farm1',
      cropId: formData.cropId || 'crop1',
      date: formData.harvestDate,
      area_harvested: parseFloat(formData.areaHarvested) || 0,
      quantity_harvested: parseFloat(formData.actualYield),
      quality_grade: formData.qualityGrade,
      moisture_content: parseFloat(formData.moistureContent),
      foreign_matter: parseFloat(formData.foreignMatter) || 0,
      broken_grains: parseFloat(formData.brokenGrains) || 0,
      market_price: parseFloat(formData.marketPrice) || 0,
      storage_location: formData.storageLocation,
      harvested_by: formData.harvestedBy ? formData.harvestedBy.split(',') : [storage.getUser()?.name || 'User'],
      equipment_used: formData.equipmentUsed ? formData.equipmentUsed.split(',') : [],
      weather_conditions: formData.weatherConditions || '',
      yield_per_hectare: parseFloat(formData.yieldPerHectare) || 0,
      total_revenue: parseFloat(formData.totalRevenue) || 0,
      harvest_costs: parseFloat(formData.harvestCosts) || 0,
      profit_margin: parseFloat(formData.profitMargin) || 0,
      quality_assessment: {
        overall_grade: formData.qualityGrade,
        parameters: [
          { parameter: 'moisture', value: parseFloat(formData.moistureContent), unit: '%', meets_target: true }
        ],
        market_acceptability: 'good',
        price_impact: 0,
        storage_recommendation: '',
        processing_suitability: []
      },
      photos: [],
      notes: formData.notes || '',
      createdAt: new Date().toISOString()
    };

    setHarvestRecords(prev => [...prev, newRecord]);
    setShowAddRecordForm(false);
  };

  const calculateAnalytics = () => {
    const totalYield = harvestRecords.reduce((sum, record) => sum + record.quantity_harvested, 0);
    const totalCost = harvestRecords.reduce((sum, record) => sum + record.harvest_costs, 0);
    const averageYield = harvestRecords.length > 0 ? totalYield / harvestRecords.length : 0;
    const averageMoisture = harvestRecords.length > 0 ? 
      harvestRecords.reduce((sum, record) => sum + (record.moisture_content || 0), 0) / harvestRecords.length : 0;

    return {
      totalYield,
      totalCost,
      averageYield,
      averageMoisture,
      totalRecords: harvestRecords.length,
      gradeACount: harvestRecords.filter(r => r.quality_grade === 'Grade A').length
    };
  };

  const getCropInfo = (cropId: string) => {
    const farms = storage.getFarms();
    for (const farm of farms) {
      const crop = farm.crops?.find((c: any) => c.id === cropId);
      if (crop) {
        return { name: crop.name, variety: crop.variety };
      }
    }
    return { name: 'Unknown Crop', variety: 'Unknown' };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Harvest Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Plan harvests, track yields, and assess crop quality
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {activeTab === 'plans' && (
            <button
              onClick={() => setShowAddPlanForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Harvest Plan
            </button>
          )}
          {activeTab === 'records' && (
            <button
              onClick={() => setShowAddRecordForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Harvest
            </button>
          )}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Yield</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalYield.toFixed(0)} kg</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Yield</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.averageYield.toFixed(0)} kg</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Grade A</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.gradeACount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Moisture</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.averageMoisture.toFixed(1)}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Harvests</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalRecords}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Cost</dt>
                  <dd className="text-lg font-medium text-gray-900">ZMW {analytics.totalCost.toFixed(0)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'plans', label: 'Harvest Plans', icon: Calendar },
            { key: 'records', label: 'Harvest Records', icon: Package },
            { key: 'quality', label: 'Quality Assessment', icon: Star },
            { key: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 inline mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {harvestPlans.map((plan) => {
              const cropInfo = getCropInfo(plan.cropId);
              return (
              <div key={plan.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{cropInfo.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                      plan.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                      plan.status === 'delayed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Variety:</span> {cropInfo.variety}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Planned:</span> {formatDate(plan.plannedStartDate)} - {formatDate(plan.plannedEndDate)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Est. Yield:</span> {plan.estimatedYield} kg
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Method:</span> {plan.harvestMethod}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Labor Required:</span> {plan.laborRequired} people
                    </div>
                  </div>

                  {plan.marketingPlan && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">{plan.marketingPlan}</p>
                    </div>
                  )}
                </div>
              </div>
            )})}

            {harvestPlans.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No harvest plans</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first harvest plan.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {harvestRecords.map((record) => {
                const cropInfo = getCropInfo(record.cropId);
                return (
                <li key={record.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{cropInfo.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.quality_grade === 'Grade A' ? 'bg-green-100 text-green-800' :
                          record.quality_grade === 'Grade B' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.quality_grade}
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div><span className="font-medium">Date:</span> {formatDate(record.date)}</div>
                        <div><span className="font-medium">Yield:</span> {record.quantity_harvested} kg</div>
                        <div><span className="font-medium">Moisture:</span> {record.moisture_content || 0}%</div>
                        <div><span className="font-medium">Area:</span> {record.area_harvested} ha</div>
                        <div><span className="font-medium">Revenue:</span> ZMW {record.total_revenue.toFixed(0)}</div>
                        <div><span className="font-medium">Harvested by:</span> {record.harvested_by.join(', ')}</div>
                      </div>

                      {record.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              )})}
            </ul>

            {harvestRecords.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No harvest records</h3>
                <p className="mt-1 text-sm text-gray-500">Start recording your harvests to track performance.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {harvestRecords.filter(record => record.quality_assessment).map((record) => {
              const cropInfo = getCropInfo(record.cropId);
              const assessment = record.quality_assessment;
              return (
              <div key={record.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{cropInfo.name} Quality Report</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assessment.overall_grade === 'Grade A' ? 'bg-green-100 text-green-800' :
                      assessment.overall_grade === 'Grade B' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {assessment.overall_grade}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div><span className="font-medium text-gray-700">Moisture:</span> {record.moisture_content || 0}%</div>
                      <div><span className="font-medium text-gray-700">Foreign Matter:</span> {record.foreign_matter || 0}%</div>
                      <div><span className="font-medium text-gray-700">Broken Grains:</span> {record.broken_grains || 0}%</div>
                      <div><span className="font-medium text-gray-700">Market Price:</span> ZMW {record.market_price}/kg</div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="font-medium text-gray-700">Yield/Ha:</span> {record.yield_per_hectare} kg</div>
                      <div><span className="font-medium text-gray-700">Revenue:</span> ZMW {record.total_revenue}</div>
                      <div><span className="font-medium text-gray-700">Costs:</span> ZMW {record.harvest_costs}</div>
                      <div><span className="font-medium text-gray-700">Profit:</span> {record.profit_margin}%</div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-1">Market Assessment:</div>
                      <div className="text-gray-600">Acceptability: {assessment.market_acceptability}</div>
                      <div className="text-gray-600">Storage: {record.storage_location}</div>
                    </div>
                  </div>

                  {assessment.storage_recommendation && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Storage Recommendation:</div>
                      <p className="text-sm text-gray-600">{assessment.storage_recommendation}</p>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Recorded on {formatDate(record.date)} by {record.harvested_by.join(', ')}
                  </div>
                </div>
              </div>
            )})
            }

            {harvestRecords.filter(record => record.quality_assessment).length === 0 && (
              <div className="col-span-full text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No quality assessments</h3>
                <p className="mt-1 text-sm text-gray-500">Quality assessments will appear here after harvest records are created.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yield Performance</h3>
                <div className="space-y-3">
                  {harvestRecords.map((record) => {
                    const cropInfo = getCropInfo(record.cropId);
                    return (
                    <div key={record.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{cropInfo.name} ({formatDate(record.date)})</span>
                      <span className="text-sm font-medium">{record.quantity_harvested} kg</span>
                    </div>
                  )})
                  }
                  {harvestRecords.length === 0 && (
                    <p className="text-sm text-gray-500">No harvest data available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Analysis</h3>
                <div className="space-y-3">
                  {harvestRecords.map((record) => {
                    const cropInfo = getCropInfo(record.cropId);
                    return (
                    <div key={record.id} className="border-b border-gray-200 pb-3">
                      <div className="text-sm font-medium text-gray-900">{cropInfo.name}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Revenue: ZMW {record.total_revenue}</div>
                        <div>Costs: ZMW {record.harvest_costs}</div>
                        <div>Profit: ZMW {(record.total_revenue - record.harvest_costs).toFixed(0)}</div>
                        <div className="font-medium">Margin: {record.profit_margin.toFixed(1)}%</div>
                      </div>
                    </div>
                  )})
                  }
                  {harvestRecords.length === 0 && (
                    <p className="text-sm text-gray-500">No financial data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Plan Modal */}
      {showAddPlanForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddPlanForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddPlan(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Harvest Plan</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                        <input
                          type="text"
                          name="cropName"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="e.g., Maize"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Variety</label>
                        <input
                          type="text"
                          name="variety"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="e.g., SC627"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          name="plannedStartDate"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                          type="date"
                          name="plannedEndDate"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estimated Yield</label>
                        <input
                          type="number"
                          name="estimatedYield"
                          required
                          step="0.1"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Enter yield"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                          name="estimatedYieldUnit"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="kg">Kilograms</option>
                          <option value="tons">Tons</option>
                          <option value="bags">Bags</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Harvest Method</label>
                        <select
                          name="harvestMethod"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="manual">Manual</option>
                          <option value="mechanical">Mechanical</option>
                          <option value="combined">Combined</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Storage Location</label>
                        <input
                          type="text"
                          name="storageLocation"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Storage facility"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPlanForm(false)}
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

      {/* Add Record Modal */}
      {showAddRecordForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddRecordForm(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddRecord(Object.fromEntries(formData));
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Record Harvest</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                        <input
                          type="text"
                          name="cropName"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="e.g., Maize"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
                        <input
                          type="date"
                          name="harvestDate"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Actual Yield</label>
                        <input
                          type="number"
                          name="actualYield"
                          required
                          step="0.1"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                          name="yieldUnit"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="kg">Kilograms</option>
                          <option value="tons">Tons</option>
                          <option value="bags">Bags</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quality Grade</label>
                        <select
                          name="qualityGrade"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="Grade A">Grade A</option>
                          <option value="Grade B">Grade B</option>
                          <option value="Grade C">Grade C</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Moisture %</label>
                        <input
                          type="number"
                          name="moistureContent"
                          required
                          step="0.1"
                          min="0"
                          max="100"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Labor Hours</label>
                        <input
                          type="number"
                          name="laborHours"
                          required
                          step="0.5"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Labor Cost (ZMW)</label>
                        <input
                          type="number"
                          name="laborCost"
                          required
                          step="0.01"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Equipment Cost (ZMW)</label>
                        <input
                          type="number"
                          name="equipmentCost"
                          step="0.01"
                          defaultValue="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transport Cost (ZMW)</label>
                        <input
                          type="number"
                          name="transportationCost"
                          step="0.01"
                          defaultValue="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Storage Location</label>
                      <input
                        type="text"
                        name="storageLocation"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Storage facility"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Record Harvest
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRecordForm(false)}
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