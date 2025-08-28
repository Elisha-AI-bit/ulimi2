import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, USSDCredentials, RegisterData } from '../types';
import { SecurityManager } from '../utils/rbac';
import { AccountLocked } from '../utils/rbac-components';

const Login: React.FC = () => {
  const { login, loginUSSD, register, authState } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isUSSDLogin, setIsUSSDLogin] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'phone' | 'username'>('email');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    identifier: '',
    password: '',
    loginType: 'email'
  });

  const [ussdForm, setUssdForm] = useState<USSDCredentials>({
    phone: '',
    pin: ''
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

  // Check for account lockout on mount and form changes
  useEffect(() => {
    const checkLockout = () => {
      const identifier = isUSSDLogin ? ussdForm.phone : loginForm.identifier;
      if (identifier) {
        const locked = SecurityManager.isAccountLocked(identifier);
        setIsAccountLocked(locked);
        if (locked) {
          setLockoutTime(SecurityManager.getRemainingLockoutTime(identifier));
        }
      }
    };
    
    checkLockout();
    const interval = setInterval(checkLockout, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [loginForm.identifier, ussdForm.phone, isUSSDLogin]);

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

    if (isAccountLocked) {
      setError(`Account is locked. Try again in ${lockoutTime} minutes.`);
      return;
    }

    const result = await login({ ...loginForm, loginType });
    if (result.success) {
      setSuccess(result.message || 'Login successful!');
    } else {
      setError(result.message || 'Login failed');
      // Refresh lockout status
      const locked = SecurityManager.isAccountLocked(loginForm.identifier);
      setIsAccountLocked(locked);
      if (locked) {
        setLockoutTime(SecurityManager.getRemainingLockoutTime(loginForm.identifier));
      }
    }
  };

  const handleUSSDSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!ussdForm.phone || !ussdForm.pin) {
      setError('Please enter phone number and PIN');
      return;
    }

    if (isAccountLocked) {
      setError(`Account is locked. Try again in ${lockoutTime} minutes.`);
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+260\d{9}$/;
    if (!phoneRegex.test(ussdForm.phone)) {
      setError('Please enter a valid Zambian phone number (+260XXXXXXXXX)');
      return;
    }

    const result = await loginUSSD(ussdForm);
    if (result.success) {
      setSuccess(result.message || 'USSD login successful!');
    } else {
      setError(result.message || 'USSD login failed');
      const locked = SecurityManager.isAccountLocked(ussdForm.phone);
      setIsAccountLocked(locked);
      if (locked) {
        setLockoutTime(SecurityManager.getRemainingLockoutTime(ussdForm.phone));
      }
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

  const fillDemoCredentials = (userType: 'admin' | 'farmer' | 'customer' | 'ussd') => {
    const credentials = {
      admin: { identifier: 'admin@ulimi.com', password: 'Admin@123' },
      farmer: { identifier: 'mirriam@ulimi.com', password: 'Farmer@123' },
      customer: { identifier: 'natasha@ulimi.com', password: 'Customer@123' },
      ussd: { phone: '+260977555123', pin: '5678' }
    };
    
    if (userType === 'ussd') {
      setUssdForm(credentials.ussd);
      setIsUSSDLogin(true);
    } else {
      setLoginForm({
        identifier: credentials[userType].identifier,
        password: credentials[userType].password,
        loginType: 'email'
      });
      setLoginType('email');
      setIsUSSDLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <span className="text-xl sm:text-2xl font-bold text-white">U</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ULIMI 2.0</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Demo Credentials */}
        {!isRegister && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2 md:mb-3 font-medium">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white p-2 md:p-2.5 rounded border border-blue-200 hover:border-blue-300 touch-manipulation min-h-[60px] transition-colors active:scale-95"
              >
                👑 <strong>Admin</strong><br/>
                <span className="text-xs">admin@ulimi.com</span>
              </button>
              <button
                onClick={() => fillDemoCredentials('farmer')}
                className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white p-2 md:p-2.5 rounded border border-blue-200 hover:border-blue-300 touch-manipulation min-h-[60px] transition-colors active:scale-95"
              >
                👨‍🌾 <strong>Farmer</strong><br/>
                <span className="text-xs">mirriam@ulimi.com</span>
              </button>
              <button
                onClick={() => fillDemoCredentials('customer')}
                className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white p-2 md:p-2.5 rounded border border-blue-200 hover:border-blue-300 touch-manipulation min-h-[60px] transition-colors active:scale-95"
              >
                🛒 <strong>Customer</strong><br/>
                <span className="text-xs">natasha@ulimi.com</span>
              </button>
              <button
                onClick={() => fillDemoCredentials('ussd')}
                className="text-left text-xs text-blue-700 hover:text-blue-900 bg-white p-2 md:p-2.5 rounded border border-blue-200 hover:border-blue-300 touch-manipulation min-h-[60px] transition-colors active:scale-95"
              >
                📱 <strong>USSD</strong><br/>
                <span className="text-xs">+260977555123</span>
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2">💡 Each role has different permissions and features</p>
          </div>
        )}

        {/* Login Method Selection */}
        {!isRegister && (
          <div className="mb-4 md:mb-6">
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setIsUSSDLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors touch-manipulation min-h-[50px] ${
                  !isUSSDLogin 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                💻 Web Login
              </button>
              <button
                type="button"
                onClick={() => setIsUSSDLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors touch-manipulation min-h-[50px] ${
                  isUSSDLogin 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                📱 USSD Login
              </button>
            </div>
            
            {/* Login Type Selection for Web Login */}
            {!isUSSDLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login with:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['email', 'phone', 'username'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setLoginType(type);
                        setLoginForm(prev => ({ ...prev, loginType: type, identifier: '' }));
                      }}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors touch-manipulation min-h-[60px] active:scale-95 ${
                        loginType === type
                          ? 'border-green-600 bg-green-50 text-green-800'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 active:bg-gray-50'
                      }`}
                    >
                      {type === 'email' && '📧'}
                      {type === 'phone' && '📱'}
                      {type === 'username' && '👤'}
                      <div className="mt-1 capitalize text-xs">{type}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Lockout Warning */}
        {isAccountLocked && (
          <AccountLocked 
            remainingTime={lockoutTime} 
            onRetry={() => {
              const identifier = isUSSDLogin ? ussdForm.phone : loginForm.identifier;
              const locked = SecurityManager.isAccountLocked(identifier);
              setIsAccountLocked(locked);
              if (locked) {
                setLockoutTime(SecurityManager.getRemainingLockoutTime(identifier));
              }
            }} 
          />
        )}

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
          !isUSSDLogin ? (
            /* Web Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {loginType === 'email' && 'Email Address'}
                  {loginType === 'phone' && 'Phone Number'}
                  {loginType === 'username' && 'Username'}
                </label>
                <input
                  type={loginType === 'email' ? 'email' : 'text'}
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
                  placeholder={
                    loginType === 'email' ? 'Enter your email' :
                    loginType === 'phone' ? '+260977123456' :
                    'Enter your username'
                  }
                  disabled={isAccountLocked}
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
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
                  placeholder="Enter your password"
                  disabled={isAccountLocked}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authState.loading || isAccountLocked}
                className="w-full bg-green-600 text-white py-4 md:py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base touch-manipulation active:scale-95"
              >
                {authState.loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* USSD Login Form */
            <form onSubmit={handleUSSDSubmit} className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-600 text-lg mr-2">📱</span>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">USSD Access</h3>
                    <p className="text-sm text-yellow-700">Login using your phone and PIN for simplified access</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={ussdForm.phone}
                  onChange={(e) => setUssdForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
                  placeholder="+260977123456"
                  disabled={isAccountLocked}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4-Digit PIN
                </label>
                <input
                  type="password"
                  value={ussdForm.pin}
                  onChange={(e) => setUssdForm(prev => ({ ...prev, pin: e.target.value }))}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest transition-colors"
                  placeholder="••••"
                  maxLength={4}
                  disabled={isAccountLocked}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authState.loading || isAccountLocked}
                className="w-full bg-green-600 text-white py-4 md:py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base touch-manipulation active:scale-95"
              >
                {authState.loading ? 'Connecting...' : 'USSD Login'}
              </button>
            </form>
          )
        ) : (
          /* Register Form */
          <div className="space-y-4">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection for Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['farmer', 'customer'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setRegisterForm(prev => ({ ...prev, role }));
                    }}
                    className={`p-3 md:p-4 rounded-lg border-2 text-sm font-medium transition-colors touch-manipulation min-h-[60px] active:scale-95 ${
                      registerForm.role === role
                        ? 'border-green-600 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 active:bg-gray-50'
                    }`}
                  >
                    {role === 'farmer' && '👨‍🌾'}
                    {role === 'customer' && '🛒'}
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
                className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
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
                className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
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
                className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
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
                className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
                required
              >
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
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
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base md:text-sm transition-colors"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </div>
            <button
              type="submit"
              disabled={authState.loading}
              className="w-full bg-green-600 text-white py-4 md:py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base touch-manipulation active:scale-95"
            >
              {authState.loading ? 'Creating Account...' : 'Create Account'}
            </button>
            </form>
          </div>
        )}

        {/* Toggle Form */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            className="text-green-600 hover:text-green-800 text-sm font-medium py-2 px-4 rounded-lg touch-manipulation transition-colors"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;