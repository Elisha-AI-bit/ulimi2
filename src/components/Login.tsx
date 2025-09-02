import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, RegisterData } from '../types';

interface LoginProps {
  onShowLanding?: () => void;
}

const Login: React.FC<LoginProps> = ({ onShowLanding }) => {
  const { login, register, authState } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    identifier: '',
    password: '',
    loginType: 'email'
  });

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    province: 'Lusaka',
    district: 'Lusaka',
    language: 'en'
  });

  const provinces = [
    'Central', 'Copperbelt', 'Eastern', 'Luapula', 'Lusaka',
    'Muchinga', 'Northern', 'North-Western', 'Southern', 'Western'
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!loginForm.identifier || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    // Additional validation for email format
    if (loginForm.loginType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginForm.identifier)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Additional validation for password strength
    if (loginForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await login({ ...loginForm, loginType: 'email' });
    if (result.success) {
      setSuccess(result.message || 'Login successful!');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!registerForm.name || !registerForm.email || !registerForm.password || 
        !registerForm.confirmPassword || !registerForm.phone) {
      setError('Please fill in all required fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+260\d{9}$/;
    if (!phoneRegex.test(registerForm.phone)) {
      setError('Please enter a valid Zambian phone number (+260XXXXXXXXX)');
      return;
    }

    const result = await register(registerForm);
    if (result.success) {
      setSuccess(result.message || 'Registration successful!');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'farmer' | 'customer' | 'vendor') => {
    console.log('Demo credentials feature has been disabled');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          {onShowLanding && (
            <button
              onClick={onShowLanding}
              className="mb-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </button>
          )}
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">U</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ULIMI 2.0</h1>
          <p className="text-gray-600 mt-2">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Demo Credentials - REMOVED */}
        {/* 
        {!isRegister && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-3 font-medium">Demo Accounts:</p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="text-center text-xs text-blue-700 hover:text-blue-900 bg-white p-3 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                👑<br/><strong>Admin</strong>
              </button>
              <button
                onClick={() => fillDemoCredentials('farmer')}
                className="text-center text-xs text-blue-700 hover:text-blue-900 bg-white p-3 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                👨‍🌾<br/><strong>Farmer</strong>
              </button>
              <button
                onClick={() => fillDemoCredentials('customer')}
                className="text-center text-xs text-blue-700 hover:text-blue-900 bg-white p-3 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                🛒<br/><strong>Customer</strong>
              </button>
              <button
                onClick={() => fillDemoCredentials('vendor')}
                className="text-center text-xs text-blue-700 hover:text-blue-900 bg-white p-3 rounded border border-blue-200 hover:border-blue-300 transition-colors"
              >
                🏪<br/><strong>Vendor</strong>
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2 text-center">💡 Click to try different roles</p>
          </div>
        )} 
        */}

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {success}
          </div>
        )}

        {/* Forms */}
        {!isRegister ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={authState.loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {authState.loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection for Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['farmer', 'customer', 'vendor'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setRegisterForm(prev => ({ ...prev, role }));
                    }}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      registerForm.role === role
                        ? 'border-green-600 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {role === 'farmer' && '👨‍🌾'}
                    {role === 'customer' && '🛒'}
                    {role === 'vendor' && '🏪'}
                    <div className="mt-1 capitalize">{role}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Admin accounts are created by administrators only</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="+260 97 123 4567"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Province
              </label>
              <select
                value={registerForm.province}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, province: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                required
              >
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Create a strong password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </div>
            <button
              type="submit"
              disabled={authState.loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {authState.loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Toggle Form */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            className="text-green-600 hover:text-green-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;