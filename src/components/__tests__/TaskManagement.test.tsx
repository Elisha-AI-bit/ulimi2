import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, mockTask, createMockStorage } from '../test/test-utils'
import TaskManagement from '../components/TaskManagement'

// Mock the storage module
const mockStorage = createMockStorage()
vi.mock('../utils/storage', () => ({
  storage: mockStorage
}))

// Mock offline sync service
vi.mock('../services/OfflineSyncService', () => ({
  useOfflineSync: vi.fn(() => ({
    addToSyncQueue: vi.fn(),
    syncStatus: {
      isOnline: true,
      pendingOperations: 0
    }
  }))
}))

describe('TaskManagement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStorage.getTasks.mockReturnValue([mockTask])
  })

  it('renders task management title and description', () => {
    render(<TaskManagement />)
    
    expect(screen.getByText('Task Management')).toBeInTheDocument()
    expect(screen.getByText(/organize and track your farming activities/i)).toBeInTheDocument()
  })

  it('displays add task button', () => {
    render(<TaskManagement />)
    
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  it('shows search and filter controls', () => {
    render(<TaskManagement />)
    
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/all status/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/all priority/i)).toBeInTheDocument()
  })

  it('displays task statistics correctly', async () => {
    render(<TaskManagement />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Tasks')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Overdue')).toBeInTheDocument()
    })
  })

  it('displays task list with correct information', async () => {
    render(<TaskManagement />)
    
    await waitFor(() => {
      expect(screen.getByText(mockTask.title)).toBeInTheDocument()
      expect(screen.getByText(mockTask.description)).toBeInTheDocument()
      expect(screen.getByText('high')).toBeInTheDocument()
    })
  })

  it('opens add task modal when add button is clicked', async () => {
    render(<TaskManagement />)
    
    const addButton = screen.getByRole('button', { name: /add task/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument()
      expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
    })
  })

  it('handles task creation form submission', async () => {
    render(<TaskManagement />)
    
    // Open add task modal
    const addButton = screen.getByRole('button', { name: /add task/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      const titleInput = screen.getByLabelText(/task title/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const typeSelect = screen.getByLabelText(/type/i)
      const prioritySelect = screen.getByLabelText(/priority/i)
      const dueDateInput = screen.getByLabelText(/due date/i)
      
      fireEvent.change(titleInput, { target: { value: 'New Test Task' } })
      fireEvent.change(descriptionInput, { target: { value: 'Test description' } })
      fireEvent.change(typeSelect, { target: { value: 'planting' } })
      fireEvent.change(prioritySelect, { target: { value: 'medium' } })
      fireEvent.change(dueDateInput, { target: { value: '2024-12-31' } })
      
      const submitButton = screen.getByRole('button', { name: /save task/i })
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(mockStorage.saveTasks).toHaveBeenCalled()
    })
  })

  it('toggles task completion status', async () => {
    render(<TaskManagement />)
    
    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)
    })
    
    await waitFor(() => {
      expect(mockStorage.saveTasks).toHaveBeenCalled()
    })
  })

  it('opens edit modal when edit button is clicked', async () => {
    render(<TaskManagement />)
    
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Edit Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockTask.title)).toBeInTheDocument()
    })
  })

  it('handles task deletion', async () => {
    render(<TaskManagement />)
    
    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
    })
    
    await waitFor(() => {
      expect(mockStorage.saveTasks).toHaveBeenCalled()
    })
  })

  it('filters tasks by search term', async () => {
    const tasks = [
      { ...mockTask, id: 'task1', title: 'Fertilize maize field' },
      { ...mockTask, id: 'task2', title: 'Harvest tomatoes' }
    ]
    mockStorage.getTasks.mockReturnValue(tasks)
    
    render(<TaskManagement />)
    
    const searchInput = screen.getByPlaceholderText(/search tasks/i)
    fireEvent.change(searchInput, { target: { value: 'maize' } })
    
    await waitFor(() => {
      expect(screen.getByText('Fertilize maize field')).toBeInTheDocument()
      expect(screen.queryByText('Harvest tomatoes')).not.toBeInTheDocument()
    })
  })

  it('filters tasks by status', async () => {
    const tasks = [
      { ...mockTask, id: 'task1', status: 'pending' },
      { ...mockTask, id: 'task2', status: 'completed' }
    ]
    mockStorage.getTasks.mockReturnValue(tasks)
    
    render(<TaskManagement />)
    
    const statusFilter = screen.getByDisplayValue(/all status/i)
    fireEvent.change(statusFilter, { target: { value: 'completed' } })
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // Should show 1 completed task
    })
  })

  it('filters tasks by priority', async () => {
    const tasks = [
      { ...mockTask, id: 'task1', priority: 'high' },
      { ...mockTask, id: 'task2', priority: 'low' }
    ]
    mockStorage.getTasks.mockReturnValue(tasks)
    
    render(<TaskManagement />)
    
    const priorityFilter = screen.getByDisplayValue(/all priority/i)
    fireEvent.change(priorityFilter, { target: { value: 'high' } })
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // Should show 1 high priority task
    })
  })

  it('shows overdue indicator for overdue tasks', async () => {
    const overdueTasks = [
      { 
        ...mockTask, 
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        status: 'pending' 
      }
    ]
    mockStorage.getTasks.mockReturnValue(overdueTasks)
    
    render(<TaskManagement />)
    
    await waitFor(() => {
      expect(screen.getByText('Overdue')).toBeInTheDocument()
    })
  })

  it('displays empty state when no tasks exist', async () => {
    mockStorage.getTasks.mockReturnValue([])
    
    render(<TaskManagement />)
    
    await waitFor(() => {
      expect(screen.getByText('No tasks found')).toBeInTheDocument()
      expect(screen.getByText(/get started by creating your first task/i)).toBeInTheDocument()
    })
  })

  it('validates form inputs', async () => {
    render(<TaskManagement />)
    
    // Open add task modal
    const addButton = screen.getByRole('button', { name: /add task/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /save task/i })
      fireEvent.click(submitButton)
      
      // Form should not submit without required fields
      expect(screen.getByText('Add New Task')).toBeInTheDocument()
    })
  })

  it('closes modal when cancel button is clicked', async () => {
    render(<TaskManagement />)
    
    // Open add task modal
    const addButton = screen.getByRole('button', { name: /add task/i })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Add New Task')).not.toBeInTheDocument()
    })
  })

  it('handles task type icons correctly', async () => {
    const tasks = [
      { ...mockTask, type: 'planting' },
      { ...mockTask, id: 'task2', type: 'harvesting' },
      { ...mockTask, id: 'task3', type: 'fertilizing' }
    ]
    mockStorage.getTasks.mockReturnValue(tasks)
    
    render(<TaskManagement />)
    
    await waitFor(() => {
      // Icons should be displayed for different task types
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })
  })
})