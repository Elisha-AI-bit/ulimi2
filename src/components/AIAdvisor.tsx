import React, { useState, useEffect } from 'react';
import { Brain, Send, Camera, TrendingUp, AlertTriangle, Lightbulb, MessageCircle, Image } from 'lucide-react';
import { storage } from '../utils/storage';
import { formatDate, translations } from '../utils/zambia-data';

export default function AIAdvisor() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'vision'>('chat');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [language, setLanguage] = useState<keyof typeof translations>('en');

  useEffect(() => {
    setRecommendations(storage.getAIRecommendations());
    
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your AI farming advisor. I can help you with crop planning, pest identification, weather advice, and market insights. How can I assist you today?',
          timestamp: new Date().toISOString(),
          language: 'en'
        }
      ]);
    }
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      language
    };

    // Simulate AI response
    const aiResponse = generateAIResponse(inputMessage);
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      language
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputMessage('');
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('maize') || input.includes('corn')) {
      return 'For maize cultivation in Zambia, I recommend:\n\n• Plant during the rainy season (November-December)\n• Use varieties like SC627 or PAN67 for better yields\n• Apply Compound D fertilizer at planting (200kg/ha)\n• Top-dress with Urea after 4-6 weeks\n• Watch for fall armyworm and treat with appropriate pesticides\n• Harvest when moisture content is below 13.5%';
    }
    
    if (input.includes('weather') || input.includes('rain')) {
      return 'Based on current weather patterns:\n\n• Light rains expected in the next 3 days\n• Good conditions for land preparation\n• Consider planting drought-tolerant varieties\n• Ensure proper drainage in low-lying areas\n• Monitor for fungal diseases due to humidity';
    }
    
    if (input.includes('pest') || input.includes('disease')) {
      return 'Common pests and diseases in Zambian farming:\n\n• Fall Armyworm: Use Bulldock or similar insecticides\n• Aphids: Apply Karate insecticide\n• Leaf blight: Use Ridomil fungicide\n• Stalk borer: Regular scouting and early treatment\n• Always follow label instructions and safety precautions';
    }
    
    if (input.includes('fertilizer') || input.includes('nutrition')) {
      return 'Fertilizer recommendations for Zambian soils:\n\n• Basal: Compound D (10:20:10) at 200-300kg/ha\n• Top dressing: Urea (46:0:0) at 150-200kg/ha\n• For legumes: Use DAP (18:46:0) for phosphorus\n• Soil test recommended for precise application\n• Apply during proper moisture conditions';
    }
    
    if (input.includes('price') || input.includes('market')) {
      return 'Current market insights:\n\n• Maize prices: ZMW 3.50-4.00/kg\n• Soybean prices: ZMW 8.00-9.00/kg\n• High demand for quality produce\n• Consider value addition for better prices\n• Direct marketing to processors can increase profits';
    }
    
    return 'Thank you for your question. Based on Zambian farming conditions, I recommend consulting with local agricultural extension officers for specific advice. You can also share more details about your specific situation, crop type, or location for more targeted recommendations.';
  };

  const aiFeatures = [
    {
      title: 'Crop Planning',
      description: 'Get optimal crop rotation and planting schedules',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pest & Disease ID',
      description: 'Upload photos for instant pest identification',
      icon: Camera,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Weather Insights',
      description: 'Receive weather-based farming recommendations',
      icon: AlertTriangle,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Market Predictions',
      description: 'Get price forecasts and market trends',
      icon: Lightbulb,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Farming Advisor</h1>
        <p className="mt-2 text-gray-600">Get personalized farming advice powered by artificial intelligence</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'chat'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageCircle className="h-4 w-4 inline mr-2" />
            Chat Advisor
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recommendations'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-2" />
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vision'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Image className="h-4 w-4 inline mr-2" />
            Vision Analysis
          </button>
        </nav>
      </div>

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* AI Features */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Capabilities</h3>
            <div className="space-y-4">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-md ${feature.color} mr-3`}>
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me about farming, crops, weather, or markets..."
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">{rec.title}</h3>
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{rec.description}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>Type: {rec.type.replace('_', ' ')}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(rec.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Brain className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start chatting with the AI advisor to receive personalized recommendations.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'vision' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Plant Vision Analysis</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload photos of your crops for AI-powered pest and disease identification
            </p>
            
            <div className="mt-6">
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer">
                <Camera className="h-4 w-4 mr-2" />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">Pest Detection</h4>
                <p className="text-xs text-gray-500">Identify harmful insects and pests</p>
              </div>
              
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">Disease Diagnosis</h4>
                <p className="text-xs text-gray-500">Detect plant diseases early</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full p-3 mx-auto w-12 h-12 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">Nutrient Analysis</h4>
                <p className="text-xs text-gray-500">Assess plant health and nutrition</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}