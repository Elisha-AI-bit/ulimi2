import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Sprout, ShoppingCart, Brain, Cloud, CheckSquare, Package, User, Globe, LogOut, Zap, Cpu, Droplets, MessageSquare, Users, Settings, BarChart3, Database, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, LanguageSwitcher } from '../contexts/LanguageContext';
import { storage } from '../utils/storage';
import { PermissionNavItem } from '../utils/rbac-components';
import OfflineStatusIndicator from './OfflineStatusIndicator';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);
  
  const { authState, logout, switchRole } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const user = authState.user;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Role-specific navigation
  const getNavigationForRole = () => {
    const commonNavigation = [
      { name: t('dashboard'), icon: Home, page: 'dashboard', permission: null },
      { name: 'Community Forum', icon: MessageSquare, page: 'forum', permission: null },
      { name: t('profile'), icon: User, page: 'profile', permission: 'update_profile' },
    ];

    if (user?.role === 'admin') {
      return [
        { name: t('dashboard'), icon: Home, page: 'dashboard', permission: null },
        { name: 'User Management', icon: Users, page: 'user-management', permission: 'manage_users' },
        { name: 'Farmer Comparison', icon: Sprout, page: 'farmer-comparison', permission: 'manage_users' },
        { name: 'System Settings', icon: Settings, page: 'system-settings', permission: 'configure_system' },
        { name: 'Analytics & Reports', icon: BarChart3, page: 'analytics', permission: 'view_analytics' },
        { name: 'System Monitoring', icon: Database, page: 'system-monitoring', permission: 'view_reports' },
        { name: 'Security & Access', icon: Shield, page: 'security', permission: 'manage_users' },
        { name: t('marketplace'), icon: ShoppingCart, page: 'marketplace', permission: 'browse_marketplace' },
        { name: 'Community Forum', icon: MessageSquare, page: 'forum', permission: null },
        { name: t('weather'), icon: Cloud, page: 'weather', permission: 'view_weather' },
        { name: t('profile'), icon: User, page: 'profile', permission: 'update_profile' },
      ];
    }

    if (user?.role === 'farmer') {
      return [
        { name: t('dashboard'), icon: Home, page: 'dashboard', permission: null },
        { name: t('farms'), icon: Sprout, page: 'farms', permission: 'manage_farm_profile' },
        { name: t('marketplace'), icon: ShoppingCart, page: 'marketplace', permission: 'browse_marketplace' },
        { name: t('ai_advisor'), icon: Brain, page: 'ai-advisor', permission: 'receive_soil_advice' },
        { name: 'AI Decision Support', icon: Zap, page: 'ai-decision-support', permission: 'receive_soil_advice' },
        { name: 'AI Capabilities', icon: Cpu, page: 'ai-capabilities', permission: 'receive_soil_advice' },
        { name: t('weather'), icon: Cloud, page: 'weather', permission: 'view_weather' },
        { name: t('tasks'), icon: CheckSquare, page: 'tasks', permission: 'manage_farm_profile' },
        { name: t('inventory'), icon: Package, page: 'inventory', permission: 'add_products' },
        { name: 'IoT Smart Irrigation', icon: Droplets, page: 'iot-irrigation', permission: 'manage_farm_profile' },
        { name: 'Community Forum', icon: MessageSquare, page: 'forum', permission: null },
        { name: t('profile'), icon: User, page: 'profile', permission: 'update_profile' },
      ];
    }

    if (user?.role === 'customer') {
      return [
        { name: t('dashboard'), icon: Home, page: 'dashboard', permission: null },
        { name: t('marketplace'), icon: ShoppingCart, page: 'marketplace', permission: 'browse_marketplace' },
        { name: 'My Orders', icon: Package, page: 'orders', permission: 'place_orders' },
        { name: 'Community Forum', icon: MessageSquare, page: 'forum', permission: null },
        { name: t('weather'), icon: Cloud, page: 'weather', permission: 'view_weather' },
        { name: t('profile'), icon: User, page: 'profile', permission: 'update_profile' },
      ];
    }

    if (user?.role === 'vendor') {
      return [
        { name: t('dashboard'), icon: Home, page: 'dashboard', permission: null },
        { name: t('marketplace'), icon: ShoppingCart, page: 'marketplace', permission: 'browse_marketplace' },
        { name: 'My Products', icon: Package, page: 'vendor-products', permission: 'manage_products' },
        { name: 'Sales Analytics', icon: BarChart3, page: 'vendor-analytics', permission: 'view_sales_analytics' },
        { name: 'Orders Management', icon: CheckSquare, page: 'vendor-orders', permission: 'manage_orders' },
        { name: 'Community Forum', icon: MessageSquare, page: 'forum', permission: null },
        { name: t('profile'), icon: User, page: 'profile', permission: 'update_profile' },
      ];
    }

    // Default navigation for unknown roles
    return commonNavigation;
  };

  const navigation = getNavigationForRole();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleRoleSwitch = (newRole: 'admin' | 'farmer' | 'customer' | 'vendor') => {
    const success = switchRole(newRole);
    if (success) {
      setShowRoleSwitcher(false);
      // Redirect to appropriate page based on role
      if (newRole === 'farmer') {
        onPageChange('dashboard');
      } else if (newRole === 'customer') {
        onPageChange('marketplace');
      } else if (newRole === 'admin') {
        onPageChange('dashboard');
      } else if (newRole === 'vendor') {
        onPageChange('dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 sm:w-72 flex-col bg-white shadow-xl">
          <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 border-b">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-gray-900">ULIMI 2.0</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2 sm:space-y-3 overflow-y-auto">
            {navigation.map((item) => (
              <PermissionNavItem
                key={item.page}
                permission={item.permission as any}
              >
                <button
                  onClick={() => {
                    onPageChange(item.page);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-colors touch-manipulation min-h-[44px] sm:min-h-[48px] ${
                    currentPage === item.page
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 sm:mr-4 sm:h-6 sm:w-6 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              </PermissionNavItem>
            ))}
          </nav>
          
          {/* Mobile-specific quick actions */}
          <div className="border-t border-gray-200 p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px]"
              >
                <User className="mr-3 h-5 w-5" />
                {user?.name || 'User Profile'}
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 sm:px-4 sm:py-3 text-sm sm:text-base text-red-700 hover:bg-red-50 rounded-lg transition-colors min-h-[44px]"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ULIMI 2.0</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <PermissionNavItem
                key={item.page}
                permission={item.permission as any}
              >
                <button
                  onClick={() => onPageChange(item.page)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                    currentPage === item.page
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              </PermissionNavItem>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden touch-manipulation min-h-[44px] min-w-[44px]"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-3 sm:px-4">
            <div className="flex items-center min-w-0">
              <h1 className="text-base font-semibold text-gray-900 capitalize truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
                {navigation.find(item => item.page === currentPage)?.name || 'ULIMI 2.0'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Offline Status Indicator */}
              <OfflineStatusIndicator compact={true} />
              
              {/* Role Switcher - Hidden on very small screens */}
              <div className="relative hidden sm:block" ref={roleSwitcherRef}>
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="flex items-center space-x-1 px-2 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium touch-manipulation min-h-[40px]"
                >
                  <span className="text-sm">
                    {user?.role === 'farmer' && '👨‍🌾'}
                    {user?.role === 'customer' && '🛒'}
                    {user?.role === 'admin' && '👑'}
                    {user?.role === 'vendor' && '🏪'}
                  </span>
                  <span className="capitalize hidden md:inline">{user?.role}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {/* Role Switcher Dropdown */}
                {showRoleSwitcher && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Switch Role</p>
                    </div>
                    {(['admin', 'farmer', 'customer', 'vendor'] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSwitch(role)}
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors min-h-[44px] ${
                          user?.role === role
                            ? 'bg-green-50 text-green-800'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3">
                          {role === 'farmer' && '👨‍🌾'}
                          {role === 'customer' && '🛒'}
                          {role === 'admin' && '👑'}
                          {role === 'vendor' && '🏪'}
                        </span>
                        <div className="text-left">
                          <div className="capitalize font-medium">{role.replace('_', ' ')}</div>
                          <div className="text-xs text-gray-500">
                            {role === 'farmer' && 'Manage farms & crops'}
                            {role === 'customer' && 'Browse & buy products'}
                            {role === 'admin' && 'System administration'}
                            {role === 'vendor' && 'Sell products & manage inventory'}
                          </div>
                        </div>
                        {user?.role === role && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language selector */}
              <LanguageSwitcher compact={true} showNativeNames={true} />
              
              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg p-1.5 touch-manipulation min-h-[40px] min-w-[40px]"
                >
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-medium text-gray-700 text-xs truncate max-w-[80px]">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize hidden md:block">
                      ({user?.role})
                    </div>
                  </div>
                </button>
                
                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        onPageChange('profile');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation min-h-[44px]"
                    >
                      <User className="mr-3 h-5 w-5" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 touch-manipulation min-h-[44px]"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-4 px-2 sm:px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}