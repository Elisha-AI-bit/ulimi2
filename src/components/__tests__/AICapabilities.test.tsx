import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockStorage } from '../test/test-utils'
import AICapabilities from '../components/AICapabilities'

// Mock the storage module
vi.mock('../utils/storage', () => ({
  storage: createMockStorage()
}))

// Mock the AI capabilities service
const mockAIService = {
  optimizeCrop: vi.fn().mockResolvedValue({
    cropType: 'maize',
    variety: 'SC627',
    recommendations: {
      expectedYield: 8.5,
      plantingDate: '2024-12-01',
      harvestDate: '2025-04-15'
    }
  }),
  generateInputRecommendations: vi.fn().mockResolvedValue({
    totalBudget: 2500,
    recommendations: [
      { product: 'NPK Fertilizer', quantity: 2, unit: 'bags', cost: 700 },
      { product: 'Urea', quantity: 1, unit: 'bag', cost: 350 },
      { product: 'Seeds', quantity: 10, unit: 'kg', cost: 450 }
    ]
  }),
  diagnoseCropImage: vi.fn().mockResolvedValue({
    results: {
      diagnosis: 'Healthy crop',
      confidence: 95,
      severity: 'low',
      recommendations: ['Continue current care routine']
    },
    timestamp: new Date().toISOString()
  }),
  getModelPerformance: vi.fn(() => [
    { modelName: 'Crop Optimizer', version: '1.0', accuracy: 92.5, lastUpdated: new Date().toISOString() },
    { modelName: 'Pest Detector', version: '2.1', accuracy: 88.3, lastUpdated: new Date().toISOString() }
  ])
}

vi.mock('../services/AICapabilitiesService', () => ({
  aiCapabilitiesService: mockAIService
}))

describe('AICapabilities Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AI capabilities title and description', () => {
    render(<AICapabilities />)
    
    expect(screen.getByText('AI Capabilities')).toBeInTheDocument()
    expect(screen.getByText(/artificial intelligence for smart farming/i)).toBeInTheDocument()
  })

  it('displays overview cards with correct information', () => {
    render(<AICapabilities />)
    
    expect(screen.getByText('Crop Optimizer')).toBeInTheDocument()
    expect(screen.getByText('Input Recommender')).toBeInTheDocument()
    expect(screen.getByText('Vision Diagnosis')).toBeInTheDocument()
    expect(screen.getByText('AI Models')).toBeInTheDocument()
  })

  it('shows navigation tabs correctly', () => {
    render(<AICapabilities />)
    
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crop optimizer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /input recommender/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /vision diagnosis/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ai models/i })).toBeInTheDocument()
  })

  it('switches tabs correctly', async () => {
    render(<AICapabilities />)
    
    const cropOptimizerTab = screen.getByRole('button', { name: /crop optimizer/i })
    fireEvent.click(cropOptimizerTab)
    
    await waitFor(() => {
      expect(screen.getByText('Crop Optimization')).toBeInTheDocument()
      expect(screen.getByText('Generate Optimization')).toBeInTheDocument()
    })
  })

  it('handles crop optimization form submission', async () => {
    render(<AICapabilities />)
    
    // Switch to crop optimizer tab
    const cropOptimizerTab = screen.getByRole('button', { name: /crop optimizer/i })
    fireEvent.click(cropOptimizerTab)
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Optimization')
      fireEvent.click(generateButton)
    })
    
    await waitFor(() => {
      expect(mockAIService.optimizeCrop).toHaveBeenCalled()
    })
  })

  it('displays crop optimization results', async () => {
    render(<AICapabilities />)
    
    // Switch to crop optimizer tab and trigger optimization
    const cropOptimizerTab = screen.getByRole('button', { name: /crop optimizer/i })
    fireEvent.click(cropOptimizerTab)
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Optimization')
      fireEvent.click(generateButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument()
      expect(screen.getByText('8.5 tons/ha')).toBeInTheDocument()
    })
  })

  it('handles input recommendations generation', async () => {
    render(<AICapabilities />)
    
    // Switch to input recommender tab
    const inputTab = screen.getByRole('button', { name: /input recommender/i })
    fireEvent.click(inputTab)
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Recommendations')
      fireEvent.click(generateButton)
    })
    
    await waitFor(() => {
      expect(mockAIService.generateInputRecommendations).toHaveBeenCalled()
    })
  })

  it('displays input recommendation results', async () => {
    render(<AICapabilities />)
    
    // Switch to input recommender tab and generate recommendations
    const inputTab = screen.getByRole('button', { name: /input recommender/i })
    fireEvent.click(inputTab)
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Recommendations')
      fireEvent.click(generateButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Recommended Inputs')).toBeInTheDocument()
      expect(screen.getByText('NPK Fertilizer')).toBeInTheDocument()
      expect(screen.getByText('ZMW 2,500')).toBeInTheDocument()
    })
  })

  it('handles image upload for vision diagnosis', async () => {
    render(<AICapabilities />)
    
    // Switch to vision diagnosis tab
    const visionTab = screen.getByRole('button', { name: /vision diagnosis/i })
    fireEvent.click(visionTab)
    
    await waitFor(() => {
      const fileInput = screen.getByLabelText(/upload image/i)
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file] } })
      
      const analyzeButton = screen.getByText('Analyze Image')
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(mockAIService.diagnoseCropImage).toHaveBeenCalled()
    })
  })

  it('displays vision diagnosis results', async () => {
    render(<AICapabilities />)
    
    // Switch to vision diagnosis tab and analyze image
    const visionTab = screen.getByRole('button', { name: /vision diagnosis/i })
    fireEvent.click(visionTab)
    
    await waitFor(() => {
      const fileInput = screen.getByLabelText(/upload image/i)
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file] } })
      
      const analyzeButton = screen.getByText('Analyze Image')
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Healthy crop')).toBeInTheDocument()
      expect(screen.getByText('Confidence: 95%')).toBeInTheDocument()
    })
  })

  it('shows AI model performance information', async () => {
    render(<AICapabilities />)
    
    // Switch to models tab
    const modelsTab = screen.getByRole('button', { name: /ai models/i })
    fireEvent.click(modelsTab)
    
    await waitFor(() => {
      expect(screen.getByText('AI Model Performance')).toBeInTheDocument()
      expect(screen.getByText('Crop Optimizer')).toBeInTheDocument()
      expect(screen.getByText('92.5%')).toBeInTheDocument()
    })
  })

  it('handles loading states correctly', async () => {
    render(<AICapabilities />)
    
    // Switch to crop optimizer tab
    const cropOptimizerTab = screen.getByRole('button', { name: /crop optimizer/i })
    fireEvent.click(cropOptimizerTab)
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Optimization')
      fireEvent.click(generateButton)
      
      // Should show loading state
      expect(screen.getByText('Optimizing...')).toBeInTheDocument()
    })
  })

  it('displays severity indicators correctly', async () => {
    // Mock diagnosis with different severity
    mockAIService.diagnoseCropImage.mockResolvedValueOnce({
      results: {
        diagnosis: 'Pest infestation detected',
        confidence: 87,
        severity: 'high',
        recommendations: ['Apply pesticide immediately']
      },
      timestamp: new Date().toISOString()
    })

    render(<AICapabilities />)
    
    const visionTab = screen.getByRole('button', { name: /vision diagnosis/i })
    fireEvent.click(visionTab)
    
    await waitFor(() => {
      const fileInput = screen.getByLabelText(/upload image/i)
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file] } })
      
      const analyzeButton = screen.getByText('Analyze Image')
      fireEvent.click(analyzeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument()
      expect(screen.getByText('Pest infestation detected')).toBeInTheDocument()
    })
  })

  it('validates form inputs correctly', async () => {
    render(<AICapabilities />)
    
    // Switch to vision diagnosis tab
    const visionTab = screen.getByRole('button', { name: /vision diagnosis/i })
    fireEvent.click(visionTab)
    
    await waitFor(() => {
      const analyzeButton = screen.getByText('Analyze Image')
      expect(analyzeButton).toBeDisabled() // Should be disabled without image
    })
  })
})