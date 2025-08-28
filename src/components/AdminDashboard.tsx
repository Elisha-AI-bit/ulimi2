import React from 'react';
import Dashboard from './Dashboard';

const AdminDashboard: React.FC<{ onPageChange?: (page: string) => void }> = ({ onPageChange }) => {
  // Simply render the main Dashboard with admin-specific context
  return <Dashboard onPageChange={onPageChange} />;
};

export default AdminDashboard;