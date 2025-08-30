import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  const { authState } = useAuth();
  
  if (!authState.user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (authState.user.role) {
    case 'farmer':
      return <FarmerDashboard onPageChange={onPageChange} />;
    case 'customer':
      return <CustomerDashboard onPageChange={onPageChange} />;
    case 'admin':
      return <AdminDashboard onPageChange={onPageChange} />;
    default:
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unknown Role</h2>
            <p className="text-gray-600">Please contact an administrator.</p>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;