import React from 'react';
import Dashboard from './Dashboard';

const CustomerDashboard: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  // Simply render the main Dashboard with customer-specific context
  return <Dashboard onPageChange={onPageChange} />;
};

export default CustomerDashboard;