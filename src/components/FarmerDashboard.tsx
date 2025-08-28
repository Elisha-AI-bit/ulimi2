import React from 'react';
import Dashboard from './Dashboard';

const FarmerDashboard: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  // Simply render the main Dashboard with farmer-specific context
  return <Dashboard onPageChange={onPageChange} />;
};

export default FarmerDashboard;