import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Bug, Droplets, Thermometer, Cloud, AlertTriangle, CheckCircle, Camera, Zap, Target, BookOpen, Calendar, BarChart3, Activity, Lightbulb, Sprout, Leaf } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate, formatCurrency } from '../utils/zambia-data';

interface AIInsight {
  id: string;
  type: 'yield_forecast' | 'pest_detection' | 'disease_diagnosis' | 'weather_alert' | 'fertilizer_recommendation' | 'irrigation_advice' | 'market_trend';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  data: any;
  timestamp: string;
  cropId?: string;
  farmId?: string;
}

interface YieldForecast {
  cropId: string;
  cropName: string;
  currentYield: number;
  predictedYield: number;
  variance: number;
  confidence: number;
  factors: {
    weather: number;
    soil: number;
    practices: number;
    disease: number;
  };
  recommendations: string[];
}

interface PestAlert {
  id: string;
  pestName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'severe';
  cropAffected: string;
  detectionMethod: 'visual' | 'ai_analysis' | 'weather_pattern' | 'historical_data';
  symptoms: string[];
  treatment: string[];
  preventionTips: string[];
  economicImpact: number;
}

export default function AIDecisionSupport() {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecasts' | 'pest_detection' | 'recommendations' | 'alerts' | 'insights'>('overview');
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [yieldForecasts, setYieldForecasts] = useState<YieldForecast[]>([]);
  const [pestAlerts, setPestAlerts] = useState<PestAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    initializeAIData();
  }, []);

  const initializeAIData = () => {
    // Generate sample AI insights
    const sampleInsights: AIInsight[] = [
      {
        id: 'insight1',
        type: 'yield_forecast',
        title: 'Maize Yield Forecast Updated',
        description: 'Based on current weather patterns and crop health, maize yield is predicted to be 15% above average this season.',
        confidence: 87,
        severity: 'medium',
        recommendations: [
          'Continue current fertilization schedule',
          'Monitor for potential pest outbreaks',
          'Prepare for early harvest window'
        ],
        data: { predictedYield: 4.2, baselineYield: 3.6 },
        timestamp: new Date().toISOString(),
        cropId: 'crop1',
        farmId: 'farm1'
      },
      {
        id: 'insight2',
        type: 'pest_detection',
        title: 'Fall Armyworm Risk Alert',
        description: 'Weather conditions and regional reports indicate increased risk of fall armyworm infestation in the next 7-10 days.',
        confidence: 73,
        severity: 'high',
        recommendations: [
          'Increase scouting frequency to 2x daily',
          'Prepare biocontrol agents',
          'Consider preventive treatments if needed'
        ],
        data: { pestType: 'fall_armyworm', riskWindow: 7 },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        cropId: 'crop1'
      },
      {
        id: 'insight3',
        type: 'weather_alert',
        title: 'Drought Stress Warning',
        description: 'Extended dry period forecasted. Crops may experience water stress in 3-5 days without irrigation.',
        confidence: 91,
        severity: 'critical',
        recommendations: [
          'Activate irrigation systems immediately',
          'Apply mulching to conserve soil moisture',
          'Consider drought-tolerant varieties for next season'
        ],
        data: { daysWithoutRain: 14, soilMoisture: 25 },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    const sampleForecasts: YieldForecast[] = [
      {
        cropId: 'crop1',
        cropName: 'Maize (SC627)',
        currentYield: 3.8,
        predictedYield: 4.2,
        variance: 0.4,
        confidence: 87,
        factors: {
          weather: 85,
          soil: 90,
          practices: 80,
          disease: 95
        },
        recommendations: [
          'Maintain current fertilization schedule',
          'Monitor moisture levels closely',
          'Prepare for harvest 5-7 days earlier than planned'
        ]
      },
      {
        cropId: 'crop2',
        cropName: 'Soybeans (Maksoy 2N)',
        currentYield: 2.1,
        predictedYield: 2.3,
        variance: 0.2,
        confidence: 78,
        factors: {
          weather: 75,
          soil: 88,
          practices: 85,
          disease: 70
        },
        recommendations: [
          'Monitor for bacterial blight symptoms',
          'Consider supplemental irrigation',
          'Adjust nitrogen application based on nodulation'
        ]
      }
    ];

    const samplePestAlerts: PestAlert[] = [
      {
        id: 'pest1',
        pestName: 'Fall Armyworm (Spodoptera frugiperda)',
        riskLevel: 'high',
        cropAffected: 'Maize',
        detectionMethod: 'weather_pattern',
        symptoms: [
          'Small holes in leaves',
          'Frass (insect droppings) visible',
          'Damage to growing points',
          'Ragged feeding patterns'
        ],
        treatment: [
          'Apply Bt (Bacillus thuringiensis) spray',
          'Use pheromone traps for monitoring',
          'Release natural enemies like Telenomus remus',
          'Spot treatment with approved insecticides'
        ],
        preventionTips: [
          'Plant push-pull cropping system',
          'Maintain field hygiene',
          'Early planting to avoid peak infestation',
          'Regular scouting and monitoring'
        ],
        economicImpact: 2500
      },
      {
        id: 'pest2',
        pestName: 'Bean Aphid (Aphis fabae)',
        riskLevel: 'medium',
        cropAffected: 'Soybeans',
        detectionMethod: 'historical_data',
        symptoms: [
          'Yellowing of leaves',
          'Sticky honeydew on plants',
          'Black sooty mold development',
          'Stunted plant growth'
        ],
        treatment: [
          'Spray with insecticidal soap',
          'Introduce ladybird beetles',
          'Use reflective mulches',
          'Apply neem oil treatment'
        ],
        preventionTips: [
          'Avoid excessive nitrogen fertilization',
          'Encourage beneficial insects',
          'Regular monitoring especially during dry periods',
          'Remove alternate host plants'
        ],
        economicImpact: 800
      }
    ];

    setInsights(sampleInsights);
    setYieldForecasts(sampleForecasts);
    setPestAlerts(samplePestAlerts);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate AI image analysis
    setTimeout(() => {
      const mockResults = [
        {
          diagnosis: 'Healthy Crop',
          confidence: 94,
          issues: [],
          recommendations: ['Continue current management practices', 'Monitor growth regularly']
        },
        {
          diagnosis: 'Nitrogen Deficiency',
          confidence: 82,
          issues: ['Yellowing of lower leaves', 'Stunted growth'],
          recommendations: ['Apply nitrogen-rich fertilizer', 'Test soil nutrients', 'Consider foliar feeding']
        },
        {
          diagnosis: 'Pest Damage Detected',
          confidence: 76,
          issues: ['Leaf holes visible', 'Feeding damage patterns'],
          recommendations: ['Identify pest species', 'Apply appropriate control measures', 'Increase monitoring frequency']
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateNewForecast = () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        type: 'yield_forecast',
        title: 'Updated Yield Forecast Available',
        description: 'Latest AI analysis incorporating recent weather data and crop monitoring images.',
        confidence: Math.floor(Math.random() * 20) + 80,
        severity: 'medium',
        recommendations: [
          'Review updated fertilization schedule',
          'Adjust irrigation timing',
          'Monitor crop development closely'
        ],
        data: { newData: true },
        timestamp: new Date().toISOString()
      };

      setInsights(prev => [newInsight, ...prev]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">AI Decision Support</h1>
          <p className="mt-2 text-sm text-gray-700">
            Intelligent farming insights powered by artificial intelligence
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={generateNewForecast}
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Forecasts</dt>
                  <dd className="text-lg font-medium text-gray-900">{yieldForecasts.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bug className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pest Alerts</dt>
                  <dd className="text-lg font-medium text-gray-900">{pestAlerts.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Critical Alerts</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {insights.filter(i => i.severity === 'critical').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">AI Confidence</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                  </dd>
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
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'forecasts', label: 'Yield Forecasts', icon: TrendingUp },
            { key: 'pest_detection', label: 'Pest Detection', icon: Bug },
            { key: 'recommendations', label: 'AI Recommendations', icon: Lightbulb },
            { key: 'alerts', label: 'Smart Alerts', icon: AlertTriangle },
            { key: 'insights', label: 'Visual Analysis', icon: Camera }
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent AI Insights</h3>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {insight.type === 'yield_forecast' && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {insight.type === 'pest_detection' && <Bug className="h-5 w-5 text-orange-600" />}
                      {insight.type === 'weather_alert' && <Cloud className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(insight.severity)}`}>
                          {insight.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Confidence: {insight.confidence}%</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(insight.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yield Performance</h3>
                <div className="space-y-4">
                  {yieldForecasts.map((forecast) => (
                    <div key={forecast.cropId} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-900">{forecast.cropName}</h4>
                        <span className="text-sm text-green-600 font-medium">
                          +{((forecast.predictedYield - forecast.currentYield) / forecast.currentYield * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-gray-600">
                        <span>Current: {forecast.currentYield} t/ha</span>
                        <span>Predicted: {forecast.predictedYield} t/ha</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${forecast.confidence}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {forecast.confidence}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
                <div className="space-y-4">
                  {pestAlerts.map((alert) => (
                    <div key={alert.id} className="border-b border-gray-200 pb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-900">{alert.pestName}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(alert.riskLevel)}`}>
                          {alert.riskLevel} risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Affecting: {alert.cropAffected}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Economic impact: {formatCurrency(alert.economicImpact)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecasts' && (
          <div className="space-y-6">
            {yieldForecasts.map((forecast) => (
              <div key={forecast.cropId} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{forecast.cropName}</h3>
                  <span className="text-sm text-gray-500">
                    Confidence: {forecast.confidence}%
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Yield Projection</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Yield:</span>
                        <span className="text-sm font-medium">{forecast.currentYield} t/ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Predicted Yield:</span>
                        <span className="text-sm font-medium text-green-600">{forecast.predictedYield} t/ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Expected Variance:</span>
                        <span className={`text-sm font-medium ${
                          forecast.variance > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {forecast.variance > 0 ? '+' : ''}{forecast.variance} t/ha
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Contributing Factors</h4>
                    <div className="space-y-2">
                      {Object.entries(forecast.factors).map(([factor, score]) => (
                        <div key={factor} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{factor}:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  score >= 80 ? 'bg-green-500' : 
                                  score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">AI Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {forecast.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pest_detection' && (
          <div className="space-y-6">
            {pestAlerts.map((alert) => (
              <div key={alert.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{alert.pestName}</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRiskLevelColor(alert.riskLevel)}`}>
                    {alert.riskLevel} risk
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Detection Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Crop Affected:</span>
                        <span className="text-sm font-medium">{alert.cropAffected}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Detection Method:</span>
                        <span className="text-sm font-medium capitalize">{alert.detectionMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Economic Impact:</span>
                        <span className="text-sm font-medium text-red-600">{formatCurrency(alert.economicImpact)}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium text-gray-700 mb-3 mt-6">Symptoms to Watch</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {alert.symptoms.map((symptom, index) => (
                        <li key={index} className="text-sm text-gray-600">{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Treatment Options</h4>
                    <ul className="list-disc list-inside space-y-1 mb-6">
                      {alert.treatment.map((treatment, index) => (
                        <li key={index} className="text-sm text-gray-600">{treatment}</li>
                      ))}
                    </ul>

                    <h4 className="text-sm font-medium text-gray-700 mb-3">Prevention Tips</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {alert.preventionTips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {insights.filter(i => i.recommendations.length > 0).map((insight) => (
              <div key={insight.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(insight.severity)}`}>
                      {insight.severity}
                    </span>
                    <span className="text-sm text-gray-500">{insight.confidence}% confident</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{insight.description}</p>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">AI Recommendations</h4>
                  <div className="space-y-2">
                    {insight.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Generated: {formatDate(insight.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {insights.filter(i => i.severity === 'high' || i.severity === 'critical').map((insight) => (
              <div key={insight.id} className={`border-l-4 p-6 rounded-lg ${
                insight.severity === 'critical' ? 'bg-red-50 border-red-400' :
                insight.severity === 'high' ? 'bg-orange-50 border-orange-400' :
                'bg-yellow-50 border-yellow-400'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`h-5 w-5 ${
                      insight.severity === 'critical' ? 'text-red-600' :
                      insight.severity === 'high' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`} />
                    <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(insight.severity)}`}>
                    {insight.severity}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{insight.description}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Immediate Actions Required:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Confidence: {insight.confidence}%</span>
                  <span>{formatDate(insight.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Crop Analysis</h3>
              <p className="text-gray-600 mb-6">
                Upload images of your crops for AI-powered disease detection and health assessment.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Drag and drop your crop images here, or</p>
                  <label className="cursor-pointer">
                    <span className="text-green-600 hover:text-green-500 font-medium">browse files</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, JPEG (max 10MB)</p>
              </div>

              {selectedImage && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Selected Image:</h4>
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Activity className="animate-spin h-4 w-4 mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Analyze Image
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600">{selectedImage.name}</p>
                    <p className="text-xs text-gray-500">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-green-900">Analysis Results</h4>
                    <span className="text-sm text-green-700">Confidence: {analysisResult.confidence}%</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-green-800">Diagnosis:</h5>
                      <p className="text-green-700">{analysisResult.diagnosis}</p>
                    </div>
                    
                    {analysisResult.issues.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-green-800">Issues Detected:</h5>
                        <ul className="list-disc list-inside text-green-700">
                          {analysisResult.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="text-sm font-medium text-green-800">Recommendations:</h5>
                      <ul className="list-disc list-inside text-green-700">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}