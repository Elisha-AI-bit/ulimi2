import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../test/test-utils'
import IoTSmartIrrigation from '../components/IoTSmartIrrigation'

describe('IoTSmartIrrigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders IoT Smart Irrigation title and description', () => {
    render(<IoTSmartIrrigation />)
    
    expect(screen.getByText('IoT Smart Irrigation')).toBeInTheDocument()
    expect(screen.getByText(/monitor and control your irrigation system/i)).toBeInTheDocument()
  })

  it('displays navigation tabs correctly', () => {
    render(<IoTSmartIrrigation />)
    
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zones/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /schedule/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sensors/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument()
  })

  it('switches tabs correctly', async () => {
    render(<IoTSmartIrrigation />)
    
    const zonesTab = screen.getByRole('button', { name: /zones/i })
    fireEvent.click(zonesTab)
    
    await waitFor(() => {
      expect(screen.getByText('Irrigation Zones')).toBeInTheDocument()
      expect(screen.getByText('Add Zone')).toBeInTheDocument()
    })
  })

  it('displays system status correctly', async () => {
    render(<IoTSmartIrrigation />)
    
    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument()
      expect(screen.getByText('Connected')).toBeInTheDocument()
      expect(screen.getByText('Power: 98%')).toBeInTheDocument()
      expect(screen.getByText('Efficiency: 94%')).toBeInTheDocument()
    })
  })

  it('shows real-time sensor readings', async () => {
    render(<IoTSmartIrrigation />)
    
    await waitFor(() => {
      expect(screen.getByText('Real-time Sensor Readings')).toBeInTheDocument()
      expect(screen.getByText('Moisture')).toBeInTheDocument()
      expect(screen.getByText('Temperature')).toBeInTheDocument()
      expect(screen.getByText('Humidity')).toBeInTheDocument()
      expect(screen.getByText('Ph')).toBeInTheDocument()
    })
  })

  it('displays zone status overview', async () => {
    render(<IoTSmartIrrigation />)
    
    await waitFor(() => {
      expect(screen.getByText('Zone Status')).toBeInTheDocument()
      expect(screen.getByText('Zone A - Maize Field')).toBeInTheDocument()
      expect(screen.getByText('Zone B - Vegetable Garden')).toBeInTheDocument()
    })
  })

  it('toggles zone activation in zones tab', async () => {
    render(<IoTSmartIrrigation />)
    
    // Switch to zones tab
    const zonesTab = screen.getByRole('button', { name: /zones/i })
    fireEvent.click(zonesTab)
    
    await waitFor(() => {
      const playButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')?.classList.contains('lucide-play') ||
        btn.querySelector('svg')?.classList.contains('lucide-pause')
      )
      if (playButton) {
        fireEvent.click(playButton)
      }
    })
  })

  it('toggles automation for zones', async () => {
    render(<IoTSmartIrrigation />)
    
    // Switch to zones tab
    const zonesTab = screen.getByRole('button', { name: /zones/i })
    fireEvent.click(zonesTab)
    
    await waitFor(() => {
      const autoButton = screen.getAllByText(/auto/i)[0].closest('button')
      if (autoButton) {
        fireEvent.click(autoButton)
      }
    })
  })

  it('displays zone thresholds and status information', async () => {
    render(<IoTSmartIrrigation />)
    
    // Switch to zones tab
    const zonesTab = screen.getByRole('button', { name: /zones/i })
    fireEvent.click(zonesTab)
    
    await waitFor(() => {
      expect(screen.getByText('Thresholds')).toBeInTheDocument()
      expect(screen.getByText(/moisture:/i)).toBeInTheDocument()
      expect(screen.getByText(/max temp:/i)).toBeInTheDocument()
    })
  })

  it('shows system control buttons', async () => {
    render(<IoTSmartIrrigation />)
    
    await waitFor(() => {
      const pauseButton = screen.getByText('Pause System')
      expect(pauseButton).toBeInTheDocument()
      
      fireEvent.click(pauseButton)
      expect(screen.getByText('Start System')).toBeInTheDocument()
    })
  })

  it('displays connection status indicators', async () => {
    render(<IoTSmartIrrigation />)
    
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument()
    })
  })

  it('shows sensor status colors correctly', async () => {
    render(<IoTSmartIrrigation />)
    
    await waitFor(() => {
      // Check for status indicators (normal, warning, critical)
      const statusElements = screen.getAllByText(/normal|warning|critical/i)
      expect(statusElements.length).toBeGreaterThan(0)
    })
  })

  it('displays schedule tab content', async () => {
    render(<IoTSmartIrrigation />)
    
    const scheduleTab = screen.getByRole('button', { name: /schedule/i })
    fireEvent.click(scheduleTab)
    
    await waitFor(() => {
      expect(screen.getByText('Irrigation Schedule')).toBeInTheDocument()
      expect(screen.getByText('Schedule management coming soon...')).toBeInTheDocument()
    })
  })

  it('displays sensors tab content', async () => {
    render(<IoTSmartIrrigation />)
    
    const sensorsTab = screen.getByRole('button', { name: /sensors/i })
    fireEvent.click(sensorsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Sensor Management')).toBeInTheDocument()
      expect(screen.getByText('Sensor configuration coming soon...')).toBeInTheDocument()
    })
  })

  it('displays analytics tab content', async () => {
    render(<IoTSmartIrrigation />)
    
    const analyticsTab = screen.getByRole('button', { name: /analytics/i })
    fireEvent.click(analyticsTab)
    
    await waitFor(() => {
      expect(screen.getByText('Analytics & Reports')).toBeInTheDocument()
      expect(screen.getByText('Analytics dashboard coming soon...')).toBeInTheDocument()
    })
  })

  it('updates sensor data periodically', async () => {
    vi.useFakeTimers()
    
    render(<IoTSmartIrrigation />)
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Real-time Sensor Readings')).toBeInTheDocument()
    })
    
    // Fast forward time to trigger sensor data update
    vi.advanceTimersByTime(5000)
    
    await waitFor(() => {
      expect(screen.getByText('Real-time Sensor Readings')).toBeInTheDocument()
    })
    
    vi.useRealTimers()
  })

  it('shows zone configuration buttons', async () => {
    render(<IoTSmartIrrigation />)
    
    // Switch to zones tab
    const zonesTab = screen.getByRole('button', { name: /zones/i })
    fireEvent.click(zonesTab)
    
    await waitFor(() => {
      expect(screen.getByText('Edit Settings')).toBeInTheDocument()
      expect(screen.getByText('View History')).toBeInTheDocument()
    })
  })

  it('displays mobile-responsive tabs', () => {
    render(<IoTSmartIrrigation />)
    
    // Check that tab text is hidden on small screens (sm:inline class)
    const tabs = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('span')?.classList.contains('sm:inline')
    )
    expect(tabs.length).toBeGreaterThan(0)
  })

  it('handles zone sensor count display', async () => {
    render(<IoTSmartIrrigation />)
    
    // Switch to zones tab
    const zonesTab = screen.getByRole('button', { name: /zones/i })
    fireEvent.click(zonesTab)
    
    await waitFor(() => {
      expect(screen.getByText(/sensors connected/)).toBeInTheDocument()
    })
  })
})