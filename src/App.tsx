import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FarmManagement from './components/FarmManagement';
import Marketplace from './components/Marketplace';
import AIAdvisor from './components/AIAdvisor';
import AIDecisionSupport from './components/AIDecisionSupport';
import AICapabilities from './components/AICapabilities';
import Weather from './components/Weather';
import TaskManagement from './components/TaskManagement';
import Inventory from './components/Inventory';
import UserProfile from './components/UserProfile';
import IoTSmartIrrigation from './components/IoTSmartIrrigation';
import { UnauthorizedAccess } from './utils/rbac-components';
import { PermissionManager } from './utils/rbac';

// Main App Component with Authentication
const AppContent: React.FC = () => {
  const { authState } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  // Show loading spinner while checking authentication
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ULIMI 2.0...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!authState.isAuthenticated) {
    if (showLogin || showRegister) {
      return (
        <Login 
          onShowLanding={() => {
            setShowLogin(false);
            setShowRegister(false);
          }}
        />
      );
    }
    
    return (
      <LandingPage 
        onShowLogin={() => setShowLogin(true)}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  const renderCurrentPage = () => {
    // Admin users have access to all pages
    if (authState.user?.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard onPageChange={setCurrentPage} />;
        case 'farms':
          return <FarmManagement />;
        case 'marketplace':
          return <Marketplace />;
        case 'ai-advisor':
          return <AIAdvisor />;
        case 'ai-decision-support':
          return <AIDecisionSupport />;
        case 'ai-capabilities':
          return <AICapabilities />;
        case 'weather':
          return <Weather />;
        case 'tasks':
          return <TaskManagement />;
        case 'inventory':
          return <Inventory />;
        case 'iot-irrigation':
          return <IoTSmartIrrigation />;
        case 'profile':
          return <UserProfile />;
        default:
          return <Dashboard />;
      }
    }
    
    // Check if user has permission to access the current page
    const pagePermissions: Record<string, string[]> = {
      'dashboard': [], // Dashboard accessible to all authenticated users
      'farms': ['manage_farm_profile'],
      'marketplace': ['browse_marketplace'],
      'ai-advisor': ['receive_soil_advice', 'receive_plant_advice'],
      'ai-decision-support': ['receive_soil_advice', 'receive_plant_advice'],
      'ai-capabilities': ['receive_soil_advice', 'receive_plant_advice'],
      'weather': ['view_weather'],
      'tasks': ['manage_farm_profile'],
      'inventory': ['add_products', 'update_products'],
      'iot-irrigation': ['manage_farm_profile'],
      'profile': ['update_profile']
    };

    const requiredPermissions = pagePermissions[currentPage] || [];
    const hasPermission = requiredPermissions.length === 0 || 
                         PermissionManager.hasAnyPermission(authState.user, requiredPermissions as any);

    if (!hasPermission) {
      return (
        <UnauthorizedAccess 
          message={`You don't have permission to access the ${currentPage} feature. Please contact an administrator or switch to an appropriate role.`}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'farms':
        return <FarmManagement />;
      case 'marketplace':
        return <Marketplace />;
      case 'ai-advisor':
        return <AIAdvisor />;
      case 'ai-decision-support':
        return <AIDecisionSupport />;
      case 'ai-capabilities':
        return <AICapabilities />;
      case 'weather':
        return <Weather />;
      case 'tasks':
        return <TaskManagement />;
      case 'inventory':
        return <Inventory />;
      case 'iot-irrigation':
        return <IoTSmartIrrigation />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard />;
    }
  };

  // Role-based dashboard rendering with layout
  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {currentPage === 'dashboard' ? <RoleBasedDashboard onPageChange={setCurrentPage} /> : renderCurrentPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;