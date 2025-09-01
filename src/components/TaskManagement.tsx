import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckSquare, Clock, AlertTriangle, Filter, Search, Edit, Trash2, Users, MapPin, Repeat, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SupabaseDataService } from '../services/supabaseDataService';
import { formatDate } from '../utils/zambia-data';
import { Task, TaskTemplate, TaskSchedule, TeamMember } from '../types';

export default function TaskManagement() {
  const { authState } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'schedule' | 'templates' | 'team'>('tasks');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'kanban'>('list');

  useEffect(() => {
    if (authState.user) {
      loadTasks();
    }
  }, [authState.user]);

  const loadTasks = async () => {
    if (!authState.user) return;
    
    setLoading(true);
    try {
      // Load tasks from Supabase
      const userTasks = await SupabaseDataService.getTasks(authState.user.id);
      setTasks(userTasks);
      setFilteredTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    // This would be updated to use Supabase in a real implementation
    const userTasks = await SupabaseDataService.getTasks(authState.user?.id || '');
    if (userTasks.length === 0) {
      // Generate enhanced sample tasks
      const sampleTasks: Task[] = [
        {
          id: '1',
          farmId: 'farm1',
          cropId: 'crop1',
          title: 'Apply Compound D Fertilizer',
          description: 'Apply basal fertilizer to maize crop at 200kg/ha for optimal growth',
          type: 'fertilizing',
          category: 'routine',
          priority: 'high',
          status: 'pending',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 4,
          assignedTo: ['Mirriam Banda', 'Peter Phiri'],
          createdBy: authState.user?.name || 'Farm Manager',
          dependencies: [],
          resourceRequirements: [
            {
              type: 'input',
              name: 'Compound D Fertilizer',
              quantity: 200,
              unit: 'kg',
              costPerUnit: 1.75,
              availability: 'available',
              required: true
            },
            {
              type: 'equipment',
              name: 'Fertilizer Spreader',
              quantity: 1,
              unit: 'unit',
              availability: 'available',
              required: true
            }
          ],
          weatherDependent: true,
          weatherConditions: [
            {
              parameter: 'rainfall',
              condition: 'max',
              value: 0
            }
          ],
          recurring: false,
          cost: {
            estimated: 350,
            currency: 'ZMW'
          },
          location: {
            fieldName: 'Main Maize Field',
            area: 'North Section'
          },
          attachments: [],
          notes: 'Apply when soil moisture is adequate but no rain expected for 24 hours',
          qualityChecks: [
            {
              id: 'qc1',
              description: 'Check fertilizer distribution uniformity',
              criteria: 'Even spread across entire area',
              required: true,
              completed: false
            }
          ],
          safetyRequirements: [
            'Wear protective gloves and mask',
            'Avoid application in windy conditions'
          ],
          completionCriteria: [
            'All specified area covered',
            'Fertilizer applied at correct rate',
            'Equipment cleaned after use'
          ],
          progressUpdates: [],
          relatedTasks: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          farmId: 'farm1',
          cropId: 'crop1',
          title: 'Weekly Crop Monitoring',
          description: 'Conduct weekly monitoring for pest and disease detection',
          type: 'monitoring',
          category: 'routine',
          priority: 'medium',
          status: 'pending',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 3,
          assignedTo: ['Natasha Mwanza'],
          createdBy: authState.user?.name || 'Farm Manager',
          dependencies: [],
          resourceRequirements: [
            {
              type: 'tool',
              name: 'Monitoring Kit',
              quantity: 1,
              unit: 'kit',
              availability: 'available',
              required: true
            }
          ],
          weatherDependent: false,
          recurring: true,
          recurrencePattern: {
            type: 'weekly',
            interval: 1,
            daysOfWeek: [1], // Monday
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          },
          cost: {
            estimated: 50,
            currency: 'ZMW'
          },
          location: {
            fieldName: 'All Fields',
            area: 'Complete Farm'
          },
          attachments: [],
          notes: 'Take photos of any issues found and record GPS coordinates',
          qualityChecks: [
            {
              id: 'qc2',
              description: 'Complete monitoring checklist',
              criteria: 'All sections covered and documented',
              required: true,
              completed: false
            }
          ],
          safetyRequirements: [
            'Wear appropriate field clothing',
            'Carry communication device'
          ],
          completionCriteria: [
            'All fields inspected',
            'Report submitted with findings',
            'Photos uploaded for any issues'
          ],
          progressUpdates: [],
          relatedTasks: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          farmId: 'farm1',
          equipmentId: 'equipment1',
          title: 'Irrigation System Maintenance',
          description: 'Inspect and maintain drip irrigation system',
          type: 'maintenance',
          category: 'maintenance',
          priority: 'medium',
          status: 'completed',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 2,
          actualDuration: 1.5,
          assignedTo: ['Peter Phiri'],
          createdBy: authState.user?.name || 'Farm Manager',
          dependencies: [],
          resourceRequirements: [
            {
              type: 'tool',
              name: 'Maintenance Tools',
              quantity: 1,
              unit: 'set',
              availability: 'available',
              required: true
            }
          ],
          weatherDependent: false,
          recurring: true,
          recurrencePattern: {
            type: 'monthly',
            interval: 1,
            dayOfMonth: 15
          },
          cost: {
            estimated: 100,
            actual: 75,
            currency: 'ZMW'
          },
          location: {
            fieldName: 'Irrigation Zone A',
            area: 'Pump Station'
          },
          attachments: [],
          notes: 'System operating efficiently, minor cleaning completed',
          qualityChecks: [
            {
              id: 'qc3',
              description: 'Test system pressure',
              criteria: 'Pressure within normal range',
              required: true,
              completed: true,
              completedBy: 'Peter Phiri',
              completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              result: 'pass'
            }
          ],
          safetyRequirements: [
            'Turn off power before maintenance',
            'Use proper electrical safety procedures'
          ],
          completionCriteria: [
            'All components inspected',
            'System tested and operational',
            'Maintenance log updated'
          ],
          progressUpdates: [
            {
              id: 'progress1',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              progressPercentage: 100,
              description: 'Maintenance completed successfully',
              updatedBy: 'Peter Phiri'
            }
          ],
          relatedTasks: [],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Sample team members
      const sampleTeamMembers: TeamMember[] = [
        {
          id: 'member1',
          name: 'Mirriam Banda',
          role: 'Senior Farm Worker',
          skills: ['fertilizer application', 'crop monitoring', 'equipment operation'],
          experience: 'experienced',
          availability: {},
          hourlyRate: 25,
          contact: {
            phone: '+260-97-123-4567'
          }
        },
        {
          id: 'member2',
          name: 'Peter Phiri',
          role: 'Maintenance Specialist',
          skills: ['irrigation systems', 'equipment repair', 'electrical work'],
          experience: 'expert',
          availability: {},
          hourlyRate: 35,
          contact: {
            phone: '+260-97-234-5678'
          }
        },
        {
          id: 'member3',
          name: 'Natasha Mwanza',
          role: 'Field Monitor',
          skills: ['pest identification', 'disease diagnosis', 'data collection'],
          experience: 'experienced',
          availability: {},
          hourlyRate: 30,
          contact: {
            phone: '+260-97-345-6789'
          }
        }
      ];

      // Sample task templates
      const sampleTemplates: TaskTemplate[] = [
        {
          id: 'template1',
          name: 'Maize Fertilizer Application',
          category: 'routine',
          type: 'fertilizing',
          description: 'Standard fertilizer application for maize crops',
          estimatedDuration: 4,
          resourceRequirements: [
            {
              type: 'input',
              name: 'NPK Fertilizer',
              quantity: 200,
              unit: 'kg',
              availability: 'available',
              required: true
            }
          ],
          qualityChecks: [
            {
              description: 'Check application rate',
              criteria: 'Correct rate applied uniformly',
              required: true
            }
          ],
          safetyRequirements: ['Wear protective equipment'],
          completionCriteria: ['Area fully covered', 'Equipment cleaned'],
          seasonalTiming: ['Planting season', 'Mid-season'],
          applicableCrops: ['Maize', 'Wheat'],
          skillLevel: 'intermediate',
          createdAt: new Date().toISOString()
        }
      ];

      // In a real implementation, we would save these to Supabase
      setTasks(sampleTasks);
      setTeamMembers(sampleTeamMembers);
      setTaskTemplates(sampleTemplates);
    } else {
      setTasks(userTasks);
      // Load other data from Supabase
      setTeamMembers([]); // await SupabaseDataService.getTeamMembers()
      setTaskTemplates([]); // await SupabaseDataService.getTaskTemplates()
    }
  };

  useEffect(() => {
    let filtered = tasks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.some(assignee => assignee.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Filter by assignee
    if (filterAssignee !== 'all') {
      filtered = filtered.filter(task => task.assignedTo.includes(filterAssignee));
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignee, filterCategory]);

  const handleAddTask = async (taskData: any) => {
    if (!authState.user) return;
    
    try {
      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        farmId: taskData.farmId,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        category: taskData.category,
        priority: taskData.priority,
        status: 'pending',
        dueDate: taskData.dueDate,
        estimatedDuration: parseFloat(taskData.estimatedDuration),
        assignedTo: taskData.assignedTo ? [taskData.assignedTo] : [],
        createdBy: authState.user.name,
        dependencies: [],
        resourceRequirements: [],
        weatherDependent: false,
        recurring: false,
        cost: {
          estimated: 0,
          currency: 'ZMW'
        },
        location: {
          fieldName: '',
          area: ''
        },
        attachments: [],
        notes: '',
        qualityChecks: [],
        safetyRequirements: [],
        completionCriteria: [],
        progressUpdates: [],
        relatedTasks: []
      };

      const createdTask = await SupabaseDataService.createTask(newTask);
      
      if (createdTask) {
        setTasks([...tasks, createdTask]);
        setFilteredTasks([...tasks, createdTask]);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (formData: any) => {
    if (!editingTask) return;
    
    try {
      const updates: Partial<Task> = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        assignedTo: formData.assignedTo ? formData.assignedTo.split(',').map((a: string) => a.trim()) : editingTask.assignedTo,
        notes: formData.notes || editingTask.notes,
        updatedAt: new Date().toISOString()
      };
      
      const success = await SupabaseDataService.updateTask(editingTask.id, updates);
      
      if (success) {
        const updatedTask = { ...editingTask, ...updates };
        const updatedTasks = tasks.map(task =>
          task.id === editingTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updates: Partial<Task> = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      if (newStatus === 'completed') {
        updates.completedDate = new Date().toISOString();
      }
      
      const success = await SupabaseDataService.updateTask(taskId, updates);
      
      if (success) {
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            const updatedTask = { ...task, ...updates };
            return updatedTask;
          }
          return task;
        });
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const updateTaskProgress = async (taskId: string, progressPercentage: number, description: string) => {
    try {
      const newProgress = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        progressPercentage,
        description,
        updatedBy: authState.user?.name || 'User'
      };
      
      const newStatus: Task['status'] = progressPercentage >= 100 ? 'completed' : progressPercentage > 0 ? 'in_progress' : 'pending';
      
      const updates: Partial<Task> = {
        progressUpdates: [...(tasks.find(t => t.id === taskId)?.progressUpdates || []), newProgress],
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      const success = await SupabaseDataService.updateTask(taskId, updates);
      
      if (success) {
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            const updatedTask = { ...task, ...updates };
            return updatedTask;
          }
          return task;
        });
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error updating task progress:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const success = await SupabaseDataService.deleteTask(taskId);
      
      if (success) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const duplicateTask = async (taskId: string) => {
    const taskToDuplicate = tasks.find(task => task.id === taskId);
    if (taskToDuplicate) {
      try {
        const duplicatedTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
          ...taskToDuplicate,
          title: `${taskToDuplicate.title} (Copy)`,
          status: 'pending',
          completedDate: undefined,
          actualDuration: undefined,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          progressUpdates: [],
        };
        
        const createdTask = await SupabaseDataService.createTask(duplicatedTask);
        
        if (createdTask) {
          setTasks([...tasks, createdTask]);
          setFilteredTasks([...tasks, createdTask]);
        }
      } catch (error) {
        console.error('Error duplicating task:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'planting': return '🌱';
      case 'irrigation': return '💧';
      case 'fertilizing': return '🧪';
      case 'pest_control': return '🐛';
      case 'harvesting': return '🌾';
      default: return '📋';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus: Task['status'] = task.status === 'completed' ? 'pending' : 'completed';
      updateTaskStatus(taskId, newStatus);
    }
  };

  // Mock data for farms since we're not using storage anymore
  const farms = [
    { id: 'farm1', name: 'Main Farm' },
    { id: 'farm2', name: 'Secondary Farm' }
  ];
  
  const taskTypes = [
    { value: 'planting', label: 'Planting' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'fertilizing', label: 'Fertilizing' },
    { value: 'pest_control', label: 'Pest Control' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'other', label: 'Other' }
  ];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Task Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Organize and track your farming activities and tasks
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{filteredTasks.length} tasks</span>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{tasks.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(task => task.status !== 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(task => task.status !== 'completed' && isOverdue(task.dueDate)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.filter(task => task.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <li key={task.id} className={`px-4 sm:px-6 py-4 ${task.status === 'completed' ? 'bg-gray-50' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg flex-shrink-0">{getTypeIcon(task.type)}</span>
                        <h3 className={`text-sm font-medium truncate ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getPriorityColor(task.priority)
                        }`}>
                          {task.priority}
                        </span>
                        {isOverdue(task.dueDate) && task.status !== 'completed' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`mt-1 text-sm line-clamp-2 ${
                      task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{task.estimatedDuration}h</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <div className="flex items-center truncate">
                        <span className="truncate">Assigned to: {task.assignedTo.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first task.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddForm || editingTask) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => {
              setShowAddForm(false);
              setEditingTask(null);
            }} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                if (editingTask) {
                  handleEditTask(Object.fromEntries(formData));
                } else {
                  handleAddTask(Object.fromEntries(formData));
                }
              }}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Task Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={editingTask?.title || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={editingTask?.description || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Describe the task"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          name="type"
                          required
                          defaultValue={editingTask?.type || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Type</option>
                          {taskTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                          name="priority"
                          required
                          defaultValue={editingTask?.priority || 'medium'}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                          type="date"
                          name="dueDate"
                          required
                          defaultValue={editingTask?.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                        <input
                          type="number"
                          name="estimatedDuration"
                          min="1"
                          defaultValue={editingTask?.estimatedDuration || 1}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                      <input
                        type="text"
                        name="assignedTo"
                        defaultValue={editingTask?.assignedTo.join(', ') || authState.user?.name || ''}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Enter assignee name(s), comma separated"
                      />
                    </div>

                    {farms.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Farm (Optional)</label>
                        <select
                          name="farmId"
                          defaultValue={editingTask?.farmId || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="">Select Farm</option>
                          {farms.map(farm => (
                            <option key={farm.id} value={farm.id}>{farm.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingTask(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}