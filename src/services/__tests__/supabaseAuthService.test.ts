import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SupabaseAuthService } from '../supabaseAuthService';

// Mock the Supabase client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockOnAuthStateChange = vi.fn();

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
      updateUser: mockUpdateUser,
      onAuthStateChange: mockOnAuthStateChange
    }
  }
}));

describe('SupabaseAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          role: 'farmer'
        },
        created_at: new Date().toISOString()
      };

      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await SupabaseAuthService.login({
        identifier: 'test@example.com',
        password: 'password123',
        loginType: 'email'
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe('user1');
      expect(result.user?.email).toBe('test@example.com');
    });

    it('should fail login with invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' }
      });

      const result = await SupabaseAuthService.login({
        identifier: 'test@example.com',
        password: 'wrongpassword',
        loginType: 'email'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          role: 'farmer'
        },
        created_at: new Date().toISOString()
      };

      mockSignUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const result = await SupabaseAuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'farmer',
        province: 'Test Province',
        district: 'Test District',
        language: 'en'
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      mockSignOut.mockResolvedValue({
        error: null
      });

      const result = await SupabaseAuthService.logout();

      expect(result.success).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          role: 'farmer'
        },
        created_at: new Date().toISOString()
      };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser }
      });

      const user = await SupabaseAuthService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.id).toBe('user1');
      expect(user?.email).toBe('test@example.com');
    });

    it('should return null when not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null }
      });

      const user = await SupabaseAuthService.getCurrentUser();

      expect(user).toBeNull();
    });
  });
});