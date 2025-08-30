import React from 'react';
import { 
  Leaf, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface LandingPageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowLogin, onShowRegister }) => {
  const features = [
    {
      icon: Leaf,
      title: "Smart Farming",
      description: "AI-powered insights for optimal crop management and yield optimization"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Real-time data analytics to help you make informed farming decisions"
    },
    {
      icon: Users,
      title: "Community Marketplace",
      description: "Connect with other farmers and buyers in a trusted marketplace"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade security to protect your data and transactions"
    }
  ];

  const benefits = [
    "Increase crop yields by up to 30%",
    "Reduce farming costs and resource waste",
    "Access to modern farming techniques",
    "Access to Zambian market prices and trends",
    "Weather forecasting tailored to Zambian regions",
    "Community support and knowledge sharing"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    ULIMI 2.0
                  </h1>
                </div>
                
                <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Modern Farming</span>
                  <span className="block text-green-600">Made Simple</span>
                </h2>
                
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Transform your farming in Zambia with AI-powered insights, smart irrigation, weather forecasting, 
                  and a community marketplace. Join thousands of Zambian farmers already growing smarter.
                </p>
                
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={onShowRegister}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={onShowLogin}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Modern farming with tractor working in green agricultural fields"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-xl font-semibold drop-shadow-lg">Empowering Zambian Agriculture</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to farm smarter
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Zambian farmers choose ULIMI 2.0
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500 mt-1" />
                  <p className="ml-3 text-lg text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your farming?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-green-200">
            Join thousands of Zambian farmers who are already using ULIMI 2.0 to increase their yields and profits.
          </p>
          <button
            onClick={onShowRegister}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-lg font-semibold">ULIMI 2.0</p>
          </div>
          <p className="mt-4 text-center text-gray-400">
            © 2024 ULIMI 2.0. Empowering farmers across Zambia with smart agricultural solutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;