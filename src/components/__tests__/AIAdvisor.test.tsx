import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AIAdvisor from '../AIAdvisor';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the AuthContext
const mockAuthState = {
  isAuthenticated: true,
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'farmer',
  },
  loading: false,
  permissions: [],
};

const mockAuthContextValue = {
  authState: mockAuthState,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  switchRole: vi.fn(),
  hasPermission: vi.fn(),
  canAccessFeature: vi.fn(),
  securityLog: [],
};

// Mock the storage utility
vi.mock('../../utils/storage', () => ({
  storage: {
    get: vi.fn().mockReturnValue([]),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock window.fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AIAdvisor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the AI Advisor component', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <AIAdvisor />
      </AuthContext.Provider>
    );

    expect(screen.getByText('AI Farming Advisor')).toBeInTheDocument();
    expect(screen.getByText('Chat Advisor')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Vision Analysis')).toBeInTheDocument();
  });

  it('displays the initial welcome message', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <AIAdvisor />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Hello! I'm your AI farming advisor/i)).toBeInTheDocument();
  });

  it('allows sending a message and displays the response', async () => {
    // Mock API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'This is a test response from the AI advisor.',
      }),
    });

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <AIAdvisor />
      </AuthContext.Provider>
    );

    // Find the input and send button
    const input = screen.getByPlaceholderText(/Ask me about farming, crops, weather, or markets/i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // Type a message and send it
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Wait for the response to appear
    await waitFor(() => {
      expect(screen.getByText('This is a test response from the AI advisor.')).toBeInTheDocument();
    });

    // Verify the API was called correctly
    expect(mockFetch).toHaveBeenCalledWith('/api/advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Test message',
        userId: 'test-user-id',
        language: 'en',
      }),
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <AIAdvisor />
      </AuthContext.Provider>
    );

    // Find the input and send button
    const input = screen.getByPlaceholderText(/Ask me about farming, crops, weather, or markets/i);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    // Type a message and send it
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to get AI response. Please try again./i)).toBeInTheDocument();
    });
  });

  it('switches between tabs correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <AIAdvisor />
      </AuthContext.Provider>
    );

    // Initially on chat tab
    expect(screen.getByText(/Hello! I'm your AI farming advisor/i)).toBeInTheDocument();

    // Switch to recommendations tab
    const recommendationsTab = screen.getByRole('button', { name: /Recommendations/i });
    fireEvent.click(recommendationsTab);

    // Should show recommendations content
    expect(screen.getByText(/No recommendations yet/i)).toBeInTheDocument();

    // Switch to vision tab
    const visionTab = screen.getByRole('button', { name: /Vision Analysis/i });
    fireEvent.click(visionTab);

    // Should show vision analysis content
    expect(screen.getByText(/Plant Vision Analysis/i)).toBeInTheDocument();
  });
});