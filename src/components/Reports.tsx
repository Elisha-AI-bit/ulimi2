import React, { useState } from 'react';
import { 
  BarChart3, FileText, Download, Filter, Calendar, 
  TrendingUp, Package, Sprout, ShoppingCart, Users,
  Printer, Share2, AlertCircle, CheckCircle, Clock,
  Search, ChevronDown, Eye, PieChart, BarChart, LineChart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../utils/storage';
// Add chart imports
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'generated' | 'pending' | 'failed';
  size: string;
  description: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

// Mock data for charts
const farmPerformanceData = [
  { name: 'Jan', yield: 4000, tasks: 2400, revenue: 2400 },
  { name: 'Feb', yield: 3000, tasks: 1398, revenue: 2210 },
  { name: 'Mar', yield: 2000, tasks: 9800, revenue: 2290 },
  { name: 'Apr', yield: 2780, tasks: 3908, revenue: 2000 },
  { name: 'May', yield: 1890, tasks: 4800, revenue: 2181 },
  { name: 'Jun', yield: 2390, tasks: 3800, revenue: 2500 },
  { name: 'Jul', yield: 3490, tasks: 4300, revenue: 2100 },
];

const cropDistributionData = [
  { name: 'Maize', value: 400 },
  { name: 'Beans', value: 300 },
  { name: 'Cassava', value: 300 },
  { name: 'Sweet Potatoes', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'generated' | 'templates' | 'scheduled' | 'analytics'>('generated');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for generated reports
  const [generatedReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Monthly Farm Performance Report',
      type: 'farm_performance',
      date: '2025-08-30',
      status: 'generated',
      size: '2.4 MB',
      description: 'Detailed analysis of crop yields, resource usage, and financial performance'
    },
    {
      id: '2',
      title: 'Irrigation Efficiency Report',
      type: 'irrigation',
      date: '2025-08-28',
      status: 'generated',
      size: '1.8 MB',
      description: 'Water usage analysis and irrigation system performance metrics'
    },
    {
      id: '3',
      title: 'Market Price Analysis',
      type: 'market_analysis',
      date: '2025-08-25',
      status: 'generated',
      size: '3.1 MB',
      description: 'Historical price trends and market predictions for your crops'
    },
    {
      id: '4',
      title: 'Task Completion Summary',
      type: 'task_summary',
      date: '2025-08-20',
      status: 'generated',
      size: '1.2 MB',
      description: 'Overview of completed tasks, pending items, and productivity metrics'
    }
  ]);

  // Mock data for report templates
  const [reportTemplates] = useState<ReportTemplate[]>([
    {
      id: 'farm_summary',
      name: 'Farm Summary Report',
      description: 'Comprehensive overview of all your farms including size, crops, and performance',
      icon: Sprout,
      category: 'farm'
    },
    {
      id: 'crop_analysis',
      name: 'Crop Analysis Report',
      description: 'Detailed analysis of crop performance, yield predictions, and health status',
      icon: TrendingUp,
      category: 'crop'
    },
    {
      id: 'financial_report',
      name: 'Financial Report',
      description: 'Income, expenses, and profitability analysis for your farming operations',
      icon: ShoppingCart,
      category: 'finance'
    },
    {
      id: 'inventory_report',
      name: 'Inventory Report',
      description: 'Detailed inventory of seeds, fertilizers, pesticides, and other supplies',
      icon: Package,
      category: 'inventory'
    },
    {
      id: 'task_report',
      name: 'Task Management Report',
      description: 'Summary of completed tasks, pending items, and productivity metrics',
      icon: CheckCircle,
      category: 'operations'
    },
    {
      id: 'weather_impact',
      name: 'Weather Impact Report',
      description: 'Analysis of how weather conditions affected your farming operations',
      icon: Calendar,
      category: 'environment'
    }
  ]);

  const filteredReports = generatedReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.type.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleGenerateReport = (templateId: string) => {
    // In a real implementation, this would call an API to generate the report
    alert(`Generating report: ${templateId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    // In a real implementation, this would download the actual report
    alert(`Downloading report: ${reportId}`);
  };

  const handleViewReport = (reportId: string) => {
    // In a real implementation, this would open the report in a viewer
    alert(`Viewing report: ${reportId}`);
  };

  // Function to generate PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Farm Performance Report', 20, 20);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 30);
    
    // Add chart data as table
    (doc as any).autoTable({
      head: [['Month', 'Yield (kg)', 'Tasks Completed', 'Revenue (ZMW)']],
      body: farmPerformanceData.map(item => [
        item.name,
        item.yield,
        item.tasks,
        item.revenue
      ]),
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] }
    });
    
    // Add crop distribution data
    (doc as any).autoTable({
      head: [['Crop Type', 'Area (hectares)']],
      body: cropDistributionData.map(item => [
        item.name,
        item.value
      ]),
      startY: (doc as any).lastAutoTable.finalY + 10,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [76, 175, 80] }
    });
    
    // Save the PDF
    doc.save('farm-performance-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">
            Generate, view, and manage your farming reports and analytics
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('generated')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generated'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generated Reports
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Report Templates
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduled'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Scheduled Reports
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics Dashboard
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="farm">Farm</option>
                  <option value="crop">Crop</option>
                  <option value="finance">Finance</option>
                  <option value="inventory">Inventory</option>
                  <option value="operations">Operations</option>
                  <option value="environment">Environment</option>
                </select>
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5 text-gray-500 mr-1" />
                  <span>Filters</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 ml-1" />
                </button>
              </div>
            </div>
            <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="h-5 w-5 mr-2" />
              New Report
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'generated' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            <div className="text-sm text-gray-500">{report.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(report.status)}
                          <span className="ml-2 text-sm capitalize">{report.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewReport(report.id)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      {React.createElement(template.icon, { className: "h-6 w-6 text-green-600" })}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.category}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{template.description}</p>
                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => handleGenerateReport(template.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate
                    </button>
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Scheduled Reports</h3>
              <p className="mt-1 text-sm text-gray-500">
                Set up automated reports to be generated and delivered on a regular schedule
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <FileText className="h-5 w-5 mr-2" />
                  Schedule New Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Action buttons */}
            <div className="flex justify-end mb-4">
              <button
                onClick={generatePDFReport}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF Report
              </button>
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <BarChart className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Farm Performance Overview</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={farmPerformanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="yield" fill="#0088FE" name="Yield (kg)" />
                      <Bar dataKey="tasks" fill="#00C49F" name="Tasks Completed" />
                      <Bar dataKey="revenue" fill="#FFBB28" name="Revenue (ZMW)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <PieChart className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Crop Distribution</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={cropDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {cropDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
                <div className="flex items-center mb-4">
                  <LineChart className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Performance Trends</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={farmPerformanceData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="yield" stroke="#0088FE" name="Yield (kg)" strokeWidth={2} />
                      <Line type="monotone" dataKey="tasks" stroke="#00C49F" name="Tasks Completed" strokeWidth={2} />
                      <Line type="monotone" dataKey="revenue" stroke="#FFBB28" name="Revenue (ZMW)" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Sprout className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Yield</p>
                    <p className="text-2xl font-semibold text-gray-900">19,750 kg</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">26,798</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <ShoppingCart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">14,591 ZMW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;