import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, Eye, Cpu, Play, Upload } from 'lucide-react';
import { aiCapabilitiesService, CropOptimizationRecommendation, InputRecommendation, VisionDiagnosisResult, AIModelPerformance } from '../services/AICapabilitiesService';
import { storage } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/zambia-data';

export default function AICapabilities() {
  const [activeTab, setActiveTab] = useState<'overview' | 'crop_optimizer' | 'input_recommender' | 'vision_diagnosis' | 'models'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [cropOptimization, setCropOptimization] = useState<CropOptimizationRecommendation | null>(null);
  const [inputRecommendations, setInputRecommendations] = useState<InputRecommendation | null>(null);
  const [visionResults, setVisionResults] = useState<VisionDiagnosisResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modelPerformance, setModelPerformance] = useState<AIModelPerformance[]>([]);

  // Forms
  const [cropForm, setCropForm] = useState({ cropType: 'maize', soilType: 'clay_loam' });
  const [inputForm, setInputForm] = useState({ cropId: 'crop1', season: '2024/25' });
  const [visionForm, setVisionForm] = useState({ cropType: 'maize' });

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      const cachedOptimization = storage.get<CropOptimizationRecommendation>('crop_optimization_farm1_maize');
      if (cachedOptimization) setCropOptimization(cachedOptimization);

      const cachedInputRec = storage.get<InputRecommendation>('input_recommendations_farm1_crop1');
      if (cachedInputRec) setInputRecommendations(cachedInputRec);

      const models = aiCapabilitiesService.getModelPerformance();
      setModelPerformance(models);

      const savedVisionResults = storage.get<VisionDiagnosisResult[]>('vision_diagnosis_history') || [];
      setVisionResults(savedVisionResults);
    } catch (error) {
      console.error('Failed to load AI data:', error);
    }
  };

  const handleCropOptimization = async () => {
    setIsLoading(true);
    try {
      const fieldData = { soilType: cropForm.soilType, soilPH: 6.2, drainage: 'good' };
      const recommendation = await aiCapabilitiesService.optimizeCrop('farm1', cropForm.cropType, fieldData);
      setCropOptimization(recommendation);
    } catch (error) {
      console.error('Crop optimization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputRecommendations = async () => {
    setIsLoading(true);
    try {
      const recommendation = await aiCapabilitiesService.generateInputRecommendations('farm1', inputForm.cropId, inputForm.season);
      setInputRecommendations(recommendation);
    } catch (error) {
      console.error('Input recommendations failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisionDiagnosis = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    try {
      const result = await aiCapabilitiesService.diagnoseCropImage(selectedImage, visionForm.cropType);
      const updatedResults = [result, ...visionResults];
      setVisionResults(updatedResults);
      storage.set('vision_diagnosis_history', updatedResults);
      setSelectedImage(null);
    } catch (error) {
      console.error('Vision diagnosis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">AI Capabilities</h1>
          <p className="mt-2 text-sm text-gray-700">
            Leverage artificial intelligence for smart farming decisions
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        {[
          { icon: Target, label: 'Crop Optimizer', value: cropOptimization ? 'Active' : 'Ready', color: 'text-blue-600' },
          { icon: Lightbulb, label: 'Input Recommender', value: inputRecommendations ? 'Available' : 'Generate', color: 'text-green-600' },
          { icon: Eye, label: 'Vision Diagnosis', value: `${visionResults.length} analyses`, color: 'text-purple-600' },
          { icon: Cpu, label: 'AI Models', value: `${modelPerformance.length} active`, color: 'text-orange-600' }
        ].map(({ icon: Icon, label, value, color }, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
                    <dd className="text-lg font-medium text-gray-900">{value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-8">
        <nav className="-mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: Brain },
            { key: 'crop_optimizer', label: 'Crop Optimizer', icon: Target },
            { key: 'input_recommender', label: 'Input Recommender', icon: Lightbulb },
            { key: 'vision_diagnosis', label: 'Vision Diagnosis', icon: Eye },
            { key: 'models', label: 'AI Models', icon: Cpu }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap flex items-center flex-shrink-0 ${
                activeTab === key
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">
                {key === 'overview' && 'Overview'}
                {key === 'crop_optimizer' && 'Crop'}
                {key === 'input_recommender' && 'Input'}
                {key === 'vision_diagnosis' && 'Vision'}
                {key === 'models' && 'Models'}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent AI Activities</h3>
            <div className="space-y-4">
              {cropOptimization && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Crop optimization for {cropOptimization.cropType}</p>
                  <p className="text-xs text-gray-500">Expected yield: {cropOptimization.recommendations.expectedYield.toFixed(1)} tons/ha</p>
                </div>
              )}
              {inputRecommendations && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium">Input recommendations generated</p>
                  <p className="text-xs text-gray-500">Budget: {formatCurrency(inputRecommendations.totalBudget)}</p>
                </div>
              )}
              {visionResults.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium">Latest diagnosis: {visionResults[0].results.diagnosis}</p>
                  <p className="text-xs text-gray-500">Confidence: {visionResults[0].results.confidence}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'crop_optimizer' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Optimization</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                    <select
                      value={cropForm.cropType}
                      onChange={(e) => setCropForm({...cropForm, cropType: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="maize">Maize</option>
                      <option value="soybeans">Soybeans</option>
                      <option value="groundnuts">Groundnuts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                    <select
                      value={cropForm.soilType}
                      onChange={(e) => setCropForm({...cropForm, soilType: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="clay_loam">Clay Loam</option>
                      <option value="sandy_loam">Sandy Loam</option>
                      <option value="clay">Clay</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCropOptimization}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? 'Optimizing...' : 'Generate Optimization'}
                </button>
              </div>
            </div>

            {cropOptimization && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Variety: </span>
                    <span className="font-medium">{cropOptimization.variety}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Expected Yield: </span>
                    <span className="font-medium text-green-600">{cropOptimization.recommendations.expectedYield.toFixed(1)} tons/ha</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'input_recommender' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Input Recommendations</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Field</label>
                    <select
                      value={inputForm.cropId}
                      onChange={(e) => setInputForm({...inputForm, cropId: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="crop1">Maize - North Field</option>
                      <option value="crop2">Soybeans - South Field</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                    <select
                      value={inputForm.season}
                      onChange={(e) => setInputForm({...inputForm, season: e.target.value})}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="2024/25">2024/25</option>
                      <option value="2025/26">2025/26</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleInputRecommendations}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {isLoading ? 'Generating...' : 'Generate Recommendations'}
                </button>
              </div>
            </div>

            {inputRecommendations && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Inputs</h3>
                <div className="space-y-3">
                  {inputRecommendations.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{rec.product}</span>
                        <span className="text-sm text-green-600">{formatCurrency(rec.cost)}</span>
                      </div>
                      <p className="text-xs text-gray-500">{rec.quantity} {rec.unit}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-sm font-medium">Total Budget:</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(inputRecommendations.totalBudget)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vision_diagnosis' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Image Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
                  <select
                    value={visionForm.cropType}
                    onChange={(e) => setVisionForm({...visionForm, cropType: e.target.value})}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="maize">Maize</option>
                    <option value="soybeans">Soybeans</option>
                    <option value="groundnuts">Groundnuts</option>
                  </select>
                </div>
                <button
                  onClick={handleVisionDiagnosis}
                  disabled={isLoading || !selectedImage}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            </div>

            {visionResults.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Results</h3>
                <div className="space-y-3">
                  {visionResults.slice(0, 2).map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium">{result.results.diagnosis}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(result.results.severity)}`}>
                          {result.results.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Confidence: {result.results.confidence}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'models' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Model Performance</h3>
            <div className="space-y-3">
              {modelPerformance.map((model, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{model.modelName}</span>
                    <span className="text-sm text-green-600">{model.accuracy.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-gray-500">v{model.version} • Updated {formatDate(model.lastUpdated)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}