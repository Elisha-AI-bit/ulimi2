import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, BarChart3, Database, Shield, AlertTriangle,
  TrendingUp, Activity, Server, Cpu, HardDrive, RefreshCw,
  Clock, CheckCircle, X, Eye, Edit, Trash2, Plus, Sprout
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/zambia-data';

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
  initialTab?: 'overview' | 'users' | 'farmers' | 'system' | 'analytics';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPageChange, initialTab = 'overview' }) => {
  const { authState } = useAuth();
  const [systemStats, setSystemStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'farmers' | 'system' | 'analytics'>(initialTab);
  const [loading, setLoading] = useState(true);

  // Update active tab when initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load system statistics
      const stats = {
        totalUsers: 156,
        activeUsers: 89,
        totalFarms: 45,
        systemUptime: '99.8%',
        dataStorage: '2.4 GB',
        apiCalls: 12450,
        errorRate: '0.2%',
        lastBackup: new Date().toISOString()
      };
      setSystemStats(stats);

      // Load user data
      const mockUsers = [
        {
          id: 'admin_001',
          name: 'Mubita',
          email: 'admin@ulimi.com',
          role: 'admin',
          status: 'active',
          lastLogin: new Date().toISOString(),
          farms: 0
        },
        {
          id: 'farmer_001',
          name: 'Mirriam',
          email: 'mirriam@ulimi.com',
          role: 'farmer',
          status: 'active',
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          farms: 3
        },
        {
          id: 'customer_001',
          name: 'Natasha',
          email: 'natasha@ulimi.com',
          role: 'customer',
          status: 'active',
          lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          farms: 0
        },
        {
          id: 'vendor_001',
          name: 'David Seeds Co.',
          email: 'david@ulimi.com',
          role: 'vendor',
          status: 'active',
          lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          farms: 0
        }
      ];
      setUsers(mockUsers);

      // Load farmer comparison data
      const mockFarmers = [
        {
          id: 'farmer_001',
          name: 'Mirriam',
          email: 'mirriam@ulimi.com',
          farms: 3,
          totalYield: 1250, // in kg
          avgYieldPerFarm: 417,
          tasksCompleted: 28,
          tasksPending: 5,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          performance: 'excellent',
          region: 'Lusaka'
        },
        {
          id: 'farmer_002',
          name: 'John',
          email: 'john@ulimi.com',
          farms: 2,
          totalYield: 890, // in kg
          avgYieldPerFarm: 445,
          tasksCompleted: 22,
          tasksPending: 3,
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          performance: 'good',
          region: 'Copperbelt'
        },
        {
          id: 'farmer_003',
          name: 'Sarah',
          email: 'sarah@ulimi.com',
          farms: 1,
          totalYield: 650, // in kg
          avgYieldPerFarm: 650,
          tasksCompleted: 15,
          tasksPending: 2,
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          performance: 'good',
          region: 'Southern'
        },
        {
          id: 'farmer_004',
          name: 'Michael',
          email: 'michael@ulimi.com',
          farms: 4,
          totalYield: 1800, // in kg
          avgYieldPerFarm: 450,
          tasksCompleted: 35,
          tasksPending: 8,
          lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          performance: 'excellent',
          region: 'Central'
        },
        {
          id: 'farmer_005',
          name: 'Emma',
          email: 'emma@ulimi.com',
          farms: 2,
          totalYield: 420, // in kg
          avgYieldPerFarm: 210,
          tasksCompleted: 12,
          tasksPending: 7,
          lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          performance: 'needs_improvement',
          region: 'Northern'
        }
      ];
      setFarmers(mockFarmers);

      // Load system logs
      const logs = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          action: 'User Login',
          details: 'User Mirriam logged in successfully from mobile device',
          user: 'mirriam@ulimi.com'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          level: 'info',
          action: 'User Registration',
          details: 'New user Natasha registered as customer',
          user: 'natasha@ulimi.com'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          level: 'warning',
          action: 'System Alert',
          details: 'High memory usage detected on server - 72% utilization',
          user: 'system'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          level: 'info',
          action: 'API Request',
          details: 'Weather data sync completed for Lusaka region',
          user: 'system'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          level: 'info',
          action: 'Data Backup',
          details: 'Scheduled backup completed successfully - 2.4GB stored',
          user: 'system'
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
          level: 'error',
          action: 'Database Error',
          details: 'Connection timeout during user authentication - auto-recovered',
          user: 'system'
        },
        {
          id: '7',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          level: 'info',
          action: 'User Activity',
          details: 'Admin Mubita accessed user management panel',
          user: 'admin@ulimi.com'
        },
        {
          id: '8',
          timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
          level: 'warning',
          action: 'Security Alert',
          details: 'Multiple failed login attempts detected for user account',
          user: 'system'
        }
      ];
      setSystemLogs(logs);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminStats = [
    {
      name: 'Total Users',
      value: systemStats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      change: '+12 this month'
    },
    {
      name: 'Active Users',
      value: systemStats?.activeUsers || 0,
      icon: Activity,
      color: 'text-green-600 bg-green-100',
      change: '89% active rate'
    },
    {
      name: 'System Uptime',
      value: systemStats?.systemUptime || '0%',
      icon: Server,
      color: 'text-purple-600 bg-purple-100',
      change: 'Last 30 days'
    },
    {
      name: 'API Calls',
      value: systemStats?.apiCalls || 0,
      icon: Database,
      color: 'text-orange-600 bg-orange-100',
      change: 'Today'
    },
    {
      name: 'Error Rate',
      value: systemStats?.errorRate || '0%',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100',
      change: 'Last 24 hours'
    },
    {
      name: 'Data Storage',
      value: systemStats?.dataStorage || '0 GB',
      icon: HardDrive,
      color: 'text-indigo-600 bg-indigo-100',
      change: 'Used space'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'farmer': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs_improvement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {adminStats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 sm:p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</dd>
                    <dd className="text-xs sm:text-sm text-gray-500">{stat.change}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Admin Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Admin Quick Actions</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => setActiveTab('users')}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]"
            >
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-medium text-gray-900">Manage Users</div>
              <div className="text-xs text-gray-500 mt-1">{users.length} total users</div>
            </button>
            <button 
              onClick={() => setActiveTab('system')}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]"
            >
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-medium text-gray-900">System Settings</div>
              <div className="text-xs text-gray-500 mt-1">Configure system</div>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]"
            >
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-medium text-gray-900">Analytics</div>
              <div className="text-xs text-gray-500 mt-1">View reports</div>
            </button>
            <button className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-xs sm:text-sm font-medium text-gray-900">Security</div>
              <div className="text-xs text-gray-500 mt-1">Access controls</div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent System Activity</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {systemLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`px-2 py-1 text-xs font-semibold rounded-full ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{log.action}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{log.details}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDate(log.timestamp)} - {log.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemLogs = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">System Logs & Administration</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor system activity and perform administrative tasks</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {/* System Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                System Status
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Server Status</span>
                  <span className="flex items-center text-xs sm:text-sm font-medium text-green-600">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Database Status</span>
                  <span className="flex items-center text-xs sm:text-sm font-medium text-green-600">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Backup Status</span>
                  <span className="flex items-center text-xs sm:text-sm font-medium text-blue-600">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Last: 2 hours ago
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">CPU Usage</span>
                  <span className="text-xs sm:text-sm font-medium text-yellow-600">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Memory Usage</span>
                  <span className="text-xs sm:text-sm font-medium text-orange-600">72%</span>
                </div>
              </div>
            </div>

            {/* Administration Tools */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-2" />
                Administration Tools
              </h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">Database Backup</div>
                        <div className="text-xs text-gray-500">Create system backup</div>
                      </div>
                    </div>
                    <div className="text-blue-600 text-sm">→</div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-3" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">System Restart</div>
                        <div className="text-xs text-gray-500">Restart services</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm">→</div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-3" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">Performance Monitor</div>
                        <div className="text-xs text-gray-500">View system metrics</div>
                      </div>
                    </div>
                    <div className="text-purple-600 text-sm">→</div>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-3" />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">Security Audit</div>
                        <div className="text-xs text-gray-500">Run security check</div>
                      </div>
                    </div>
                    <div className="text-red-600 text-sm">→</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent System Logs */}
          <div className="mt-4 sm:mt-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent System Activity</h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Details
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {systemLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLogLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-500 max-w-xs truncate hidden md:table-cell">
                          {log.details}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {log.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFarmers = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Farmer Performance Comparison</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Compare farmer performance based on yield, task completion, and activity</p>
        </div>
        <div className="p-4 sm:p-6">
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-900 mb-2">Top Performers</h4>
              <div className="text-3xl font-bold text-green-700">
                {farmers.filter(f => f.performance === 'excellent').length}
              </div>
              <div className="text-sm text-green-700">Farmers with excellent performance</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Good Performers</h4>
              <div className="text-3xl font-bold text-blue-700">
                {farmers.filter(f => f.performance === 'good').length}
              </div>
              <div className="text-sm text-blue-700">Farmers with good performance</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-yellow-900 mb-2">Needs Support</h4>
              <div className="text-3xl font-bold text-yellow-700">
                {farmers.filter(f => f.performance === 'needs_improvement').length}
              </div>
              <div className="text-sm text-yellow-700">Farmers needing improvement</div>
            </div>
          </div>

          {/* Farmers Comparison Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farms
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Yield (kg)
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Yield/Farm
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{farmer.name}</div>
                          <div className="text-xs text-gray-500">{farmer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {farmer.farms}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {farmer.totalYield}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {farmer.avgYieldPerFarm}
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      <span className="text-green-600">{farmer.tasksCompleted}</span> / 
                      <span className="text-yellow-600"> {farmer.tasksPending}</span>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(farmer.performance)}`}>
                        {farmer.performance.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {farmer.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Insights */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Top Performing Farmers</h5>
                <ul className="space-y-2">
                  {farmers
                    .filter(f => f.performance === 'excellent')
                    .map(farmer => (
                      <li key={farmer.id} className="flex justify-between text-sm">
                        <span>{farmer.name}</span>
                        <span className="font-medium">{farmer.totalYield} kg yield</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">Farmers Needing Support</h5>
                <ul className="space-y-2">
                  {farmers
                    .filter(f => f.performance === 'needs_improvement')
                    .map(farmer => (
                      <li key={farmer.id} className="flex justify-between text-sm">
                        <span>{farmer.name}</span>
                        <span className="font-medium">{farmer.tasksPending} pending tasks</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">User Management</h3>
          <button className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm min-h-[40px]">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Last Login
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs text-gray-500 hidden sm:table-cell">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, {authState.user?.name}! 👑
              </h1>
              <p className="text-sm sm:text-gray-600 mt-1">System administration and user management</p>
            </div>
            <button
              onClick={loadAdminData}
              className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm sm:text-base min-h-[40px]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="border-b border-gray-200 overflow-x-auto pb-1">
            <nav className="-mb-px flex space-x-6 min-w-max sm:min-w-0">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'farmers', label: 'Farmers', icon: Sprout },
                { id: 'system', label: 'System Logs', icon: Database },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap min-h-[40px] ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="inline mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-4 sm:mb-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'farmers' && renderFarmers()}
          {activeTab === 'system' && renderSystemLogs()}
          {activeTab === 'analytics' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  System Analytics & Reports
                </h3>
                
                {/* Analytics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">User Analytics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">New Users (This Month)</span>
                        <span className="text-sm font-medium text-blue-900">+12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Active Sessions</span>
                        <span className="text-sm font-medium text-blue-900">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">User Retention</span>
                        <span className="text-sm font-medium text-blue-900">94%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">System Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Response Time</span>
                        <span className="text-sm font-medium text-green-900">245ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">API Success Rate</span>
                        <span className="text-sm font-medium text-green-900">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Throughput</span>
                        <span className="text-sm font-medium text-green-900">1,245 req/min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 md:col-span-2 xl:col-span-1">
                    <h4 className="text-lg font-semibold text-purple-900 mb-2">Business Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">Total Farms</span>
                        <span className="text-sm font-medium text-purple-900">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">Marketplace Orders</span>
                        <span className="text-sm font-medium text-purple-900">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-700">AI Consultations</span>
                        <span className="text-sm font-medium text-purple-900">234</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reports Section */}
                <div className="mt-4 sm:mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <button className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]">
                      <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-xs sm:text-sm font-medium text-gray-900">User Report</div>
                      <div className="text-xs text-gray-500 mt-1">Export user analytics</div>
                    </button>
                    <button className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]">
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-xs sm:text-sm font-medium text-gray-900">Performance Report</div>
                      <div className="text-xs text-gray-500 mt-1">System metrics</div>
                    </button>
                    <button className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-xs sm:text-sm font-medium text-gray-900">Business Report</div>
                      <div className="text-xs text-gray-500 mt-1">Revenue & growth</div>
                    </button>
                    <button className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-center min-h-[100px] sm:min-h-[120px]">
                      <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-xs sm:text-sm font-medium text-gray-900">Error Report</div>
                      <div className="text-xs text-gray-500 mt-1">System issues</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;