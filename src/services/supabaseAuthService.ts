import { supabase } from './supabaseClient'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User, LoginCredentials, RegisterData, AuthState } from '../types'

// Map Supabase user to our User type
const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    phone: supabaseUser.phone || '',
    username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || '',
    role: supabaseUser.user_metadata?.role || 'farmer',
    location: {
      province: supabaseUser.user_metadata?.province || 'Lusaka',
      district: supabaseUser.user_metadata?.district || 'Lusaka',
      coordinates: supabaseUser.user_metadata?.coordinates || [0, 0]
    },
    language: supabaseUser.user_metadata?.language || 'en',
    isActive: true,
    createdAt: supabaseUser.created_at,
    lastLogin: new Date().toISOString()
  }
}

// Supabase Authentication Service
export class SupabaseAuthService {
  // Login with email and password
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      // Validate email format if loginType is email
      if (credentials.loginType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.identifier)) {
          return { success: false, message: 'Please enter a valid email address' };
        }
      }

      let authResult;
      if (credentials.loginType === 'email') {
        authResult = await supabase.auth.signInWithPassword({
          email: credentials.identifier,
          password: credentials.password
        });
      } else if (credentials.loginType === 'phone') {
        // For phone login, we would need to implement phone authentication
        return { success: false, message: 'Phone login not implemented yet' };
      } else {
        // For username login, we would need to implement custom logic
        return { success: false, message: 'Username login not implemented yet' };
      }

      const { data, error } = authResult;

      if (error) {
        // Provide more specific error messages based on error codes
        if (error.status === 400) {
          return { success: false, message: 'Invalid email or password. Please check your credentials and try again.' };
        }
        return { success: false, message: error.message };
      }

      if (data.user) {
        const user = mapSupabaseUserToAppUser(data.user);
        return { success: true, user };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred during login' };
    }
  }

  // Register new user
  static async register(data: RegisterData): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      console.log('Registering user with Supabase auth:', data.email);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            username: data.username,
            role: data.role,
            province: data.province,
            district: data.district,
            language: data.language
          }
        }
      })

      if (error) {
        console.error('Supabase auth registration error:', error);
        return { success: false, message: error.message }
      }

      console.log('Supabase auth registration successful:', authData);
      if (authData.user) {
        const user = mapSupabaseUserToAppUser(authData.user)
        console.log('Mapped user:', user);
        return { success: true, user }
      }

      return { success: false, message: 'Registration failed' }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'An unexpected error occurred during registration' }
    }
  }

  // Logout user
  static async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, message: 'An unexpected error occurred during logout' }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        return mapSupabaseUserToAppUser(user)
      }

      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          phone: updates.phone,
          username: updates.username,
          province: updates.location?.province,
          district: updates.location?.district,
          coordinates: updates.location?.coordinates,
          language: updates.language
        }
      })

      if (error) {
        return { success: false, message: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, message: 'An unexpected error occurred while updating profile' }
    }
  }

  // Listen for auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}