import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, TrendingUp, BarChart3, Target, Lightbulb, 
  ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, 
  Sprout, DollarSign, MapPin, Eye, Edit
} from 'lucide-react';
import { storage } from '../utils/storage';
import { formatCurrency, formatDate, commonCrops } from '../utils/zambia-data';
import type { CropPlan, PlannedCrop, CropRotation, Farm } from '../types';

const CropPlanning: React.FC = () => {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'wizard' | 'rotations' | 'optimizer'>('plans');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<CropPlan | null>(null);
  const [rotations, setRotations] = useState<CropRotation[]>([]);

  // Wizard state
  const [wizardData, setWizardData] = useState({
    farmId: '',
    season: '',
    year: new Date().getFullYear(),
    totalArea: 0,
    crops: [] as PlannedCrop[],
    objectives: [] as string[]
  });

  useEffect(() => {
    const savedPlans = storage.get<CropPlan[]>('crop_plans') || [];
    const savedFarms = storage.getFarms();
    const savedRotations = storage.get<CropRotation[]>('crop_rotations') || [];
    
    setCropPlans(savedPlans);
    setFarms(savedFarms);
    setRotations(savedRotations);

    if (savedPlans.length === 0) {
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const samplePlans: CropPlan[] = [
      {
        id: '1',
        farmId: 'farm1',
        season: '2024/2025 Rainy Season',
        year: 2024,
        crops: [
          {
            id: 'pc1',
            cropId: 'maize1',
            name: 'Maize',
            variety: 'SC627',
            area: 3.0,
            plantingDate: '2024-12-01',
            harvestDate: '2025-04-15',
            expectedYield: 4500,
            marketPrice: 3.50,
            inputCosts: 2800,
            profitability: 8950,
            riskLevel: 'low',
            soilRequirements: ['Well-drained', 'pH 6.0-7.0'],
            climateRequirements: ['600-1000mm rainfall', 'Temperature 20-30°C']
          }
        ],
        totalArea: 3.0,
        rotationStrategy: 'Cereal-Legume Rotation',
        expectedRevenue: 15750,
        expectedCosts: 2800,
        profitMargin: 82.2,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    const sampleRotations: CropRotation[] = [
      {
        id: '1',
        farmId: 'farm1',
        name: 'Sustainable Maize-Legume Rotation',
        duration: 3,
        sequence: [
          {
            year: 1,
            season: 'Rainy',
            cropName: 'Maize',
            purpose: 'cash_crop',
            benefits: ['Primary income', 'Food security']
          },
          {
            year: 2,
            season: 'Rainy',
            cropName: 'Soybeans',
            purpose: 'nitrogen_fixing',
            benefits: ['Soil fertility', 'Protein source']
          }
        ],
        benefits: [
          'Improved soil fertility',
          'Reduced pest pressure',
          'Diversified income'
        ],
        requirements: [
          'Adequate rainfall (600-1000mm)',
          'Well-drained soils'
        ],
        suitableSoilTypes: ['Loam', 'Sandy loam'],
        createdAt: new Date().toISOString()
      }
    ];

    storage.set('crop_plans', samplePlans);
    storage.set('crop_rotations', sampleRotations);
    setCropPlans(samplePlans);
    setRotations(sampleRotations);
  };

  const handleStartWizard = () => {
    setShowWizard(true);
    setWizardStep(1);
  };

  const generateAIRecommendations = () => [
    {
      type: 'variety',
      title: 'Optimal Variety Selection',
      description: 'Consider SC627 maize variety for higher drought tolerance',
      confidence: 87
    },
    {
      type: 'timing',
      title: 'Planting Schedule',
      description: 'Plant between November 25 - December 10 for optimal rainfall',
      confidence: 92
    }
  ];

  const renderPlansTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Plans</dt>
                <dd className="text-lg font-medium text-gray-900">{cropPlans.length}</dd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Expected Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(cropPlans.reduce((sum, plan) => sum + plan.expectedRevenue, 0))}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Avg. Profit Margin</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {(cropPlans.reduce((sum, plan) => sum + plan.profitMargin, 0) / cropPlans.length || 0).toFixed(1)}%
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {cropPlans.map((plan) => (
            <li key={plan.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Sprout className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900">{plan.season}</h3>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.status === 'active' ? 'bg-green-100 text-green-800' :
                        plan.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {farms.find(f => f.id === plan.farmId)?.name} • {plan.totalArea} ha • {plan.crops.length} crops
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Revenue: {formatCurrency(plan.expectedRevenue)} • Profit: {plan.profitMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setSelectedPlan(plan)} className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {cropPlans.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No crop plans</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first crop plan.</p>
            <div className="mt-6">
              <button
                onClick={handleStartWizard}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderRotationsTab = () => (
    <div className="space-y-6">
      {rotations.map((rotation) => (
        <div key={rotation.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{rotation.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{rotation.duration}-year rotation cycle</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Rotation Sequence</h4>
                <div className="flex items-center space-x-4">
                  {rotation.sequence.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2">
                        <span className="text-xs font-medium text-green-800">Year {step.year}</span>
                      </div>
                      <div className="ml-2 text-sm">
                        <div className="font-medium text-gray-900">{step.cropName}</div>
                        <div className="text-gray-500">{step.purpose.replace('_', ' ')}</div>
                      </div>
                      {index < rotation.sequence.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-gray-400 ml-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {rotation.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {rotation.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWizard = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Crop Planning Wizard - Step {wizardStep} of 3</h3>
              <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {wizardStep === 1 && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Basic Information</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Farm</label>
                    <select
                      value={wizardData.farmId}
                      onChange={(e) => setWizardData({...wizardData, farmId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Choose a farm</option>
                      {farms.map(farm => (
                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Season</label>
                    <select
                      value={wizardData.season}
                      onChange={(e) => setWizardData({...wizardData, season: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select season</option>
                      <option value="2024/2025 Rainy Season">2024/2025 Rainy Season</option>
                      <option value="2025 Dry Season">2025 Dry Season</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium">AI Recommendations</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <Lightbulb className="h-5 w-5 text-blue-400" />
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-blue-800">Recommended for your farm:</h5>
                      <div className="mt-2 text-sm text-blue-700 space-y-1">
                        {generateAIRecommendations().map((rec, index) => (
                          <div key={index}>• {rec.description}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium">Review & Finalize</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900">Plan Summary</h5>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Farm: {farms.find(f => f.id === wizardData.farmId)?.name}</p>
                    <p>Season: {wizardData.season}</p>
                    <p>Total Area: {wizardData.totalArea} hectares</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                disabled={wizardStep === 1}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              {wizardStep < 3 ? (
                <button
                  onClick={() => setWizardStep(Math.min(3, wizardStep + 1))}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Create plan logic here
                    setShowWizard(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Create Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Crop Planning</h1>
          <p className="mt-2 text-sm text-gray-700">
            Plan your crops, optimize rotations, and maximize profitability with AI-powered insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleStartWizard}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            My Plans
          </button>
          <button
            onClick={() => setActiveTab('rotations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rotations'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Rotations
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'optimizer'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="h-4 w-4 inline mr-2" />
            AI Optimizer
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'plans' && renderPlansTab()}
        {activeTab === 'rotations' && renderRotationsTab()}
        {activeTab === 'optimizer' && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">AI Crop Optimizer</h3>
            <p className="mt-1 text-sm text-gray-500">Coming soon - Advanced optimization algorithms</p>
          </div>
        )}
      </div>

      {showWizard && renderWizard()}
    </div>
  );
};

export default CropPlanning;