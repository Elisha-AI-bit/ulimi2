import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, SecurityLog, Permission } from '../types';
import { storage } from '../utils/storage';
import { PermissionManager, SecurityManager, ROLE_PERMISSIONS } from '../utils/rbac';
import { SupabaseAuthService } from '../services/supabaseAuthService';
import { SupabaseDataService } from '../services/supabaseDataService';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchRole: (newRole: 'admin' | 'farmer' | 'customer' | 'vendor') => boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccessFeature: (feature: string) => boolean;
  securityLog: SecurityLog[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    permissions: []
  });
  const [securityLog, setSecurityLog] = useState<SecurityLog[]>([]);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Listen for auth state changes
    const { data: authListener } = SupabaseAuthService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // User signed in
        updateAuthStateFromSupabase(session?.user);
        logSecurityEvent('login', 'User signed in via Supabase', session?.user?.id);
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        updateAuthState(null, false);
        logSecurityEvent('logout', 'User signed out');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    try {
      const user = await SupabaseAuthService.getCurrentUser();
      
      if (user && user.isActive) {
        // Check if user exists in the application database
        const appUser = await SupabaseDataService.getUser(user.id);
        if (!appUser) {
          console.log('User exists in auth but not in app database');
          // This could happen if the user was created via Supabase Auth but not in our app database
          // We might want to create the user in the app database here
        }
        updateAuthState(user, true);
        logSecurityEvent('login', 'Session restored from Supabase', user.id);
      } else {
        updateAuthState(null, false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Ensure we don't stay in loading state even if there's an error
      updateAuthState(null, false);
    }
  };

  // Helper function to log security events
  const logSecurityEvent = (action: SecurityLog['action'], details: string, userId?: string) => {
    const logEntry: SecurityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId || authState.user?.id || 'anonymous',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    setSecurityLog(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 logs
    const existingLogs = storage.get<SecurityLog[]>('security_logs') || [];
    storage.set('security_logs', [logEntry, ...existingLogs.slice(0, 99)]);
  };

  // Helper function to update auth state with permissions
  const updateAuthState = (user: User | null, isAuthenticated: boolean = false) => {
    const permissions = user ? PermissionManager.getUserPermissions(user) : [];
    setAuthState({
      isAuthenticated,
      user,
      loading: false,
      permissions
    });
  };

  // Update auth state from Supabase user
  const updateAuthStateFromSupabase = (supabaseUser: any) => {
    if (supabaseUser) {
      const user: User = {
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
      };
      
      updateAuthState(user, true);
    } else {
      updateAuthState(null, false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    updateAuthState(null, false);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await SupabaseAuthService.login(credentials);
      
      if (result.success && result.user) {
        updateAuthState(result.user, true);
        logSecurityEvent('login', `Successful login via ${credentials.loginType}`, result.user.id);
        return { success: true, message: 'Login successful' };
      } else {
        logSecurityEvent('failed_login', `Failed login: ${result.message} - ${credentials.identifier}`);
        updateAuthState(null, false);
        return { success: false, message: result.message || 'Invalid credentials' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An unexpected error occurred during login';
      
      // Provide more specific error messages
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 400) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      logSecurityEvent('failed_login', `Failed login: ${errorMessage} - ${credentials.identifier}`);
      updateAuthState(null, false);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('Starting registration process for:', data.email);
      const result = await SupabaseAuthService.register(data);
      console.log('Supabase auth registration result:', result);
      
      if (result.success && result.user) {
        console.log('Auth registration successful, creating user in app database');
        
        // Wait a moment to ensure the auth session is fully established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Also insert user data into the application's users table
        const userCreateResult = await SupabaseDataService.createUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          username: data.username || data.email.split('@')[0],
          role: data.role,
          location: {
            province: data.province,
            district: data.district,
            coordinates: [0, 0] // Default coordinates, can be updated later
          },
          language: data.language,
          isActive: true
        });
        
        console.log('User creation in app database result:', userCreateResult);
        
        // Refresh the user data to ensure we have the latest state
        const currentUser = await SupabaseAuthService.getCurrentUser();
        if (currentUser) {
          updateAuthState(currentUser, true);
        } else {
          updateAuthState(result.user, true);
        }
        
        logSecurityEvent('login', 'Account created and logged in', result.user.id);
        return { success: true, message: 'Registration successful! Welcome to ULIMI 2.0' };
      } else {
        console.log('Registration failed:', result.message);
        updateAuthState(null, false);
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Even if there's an error creating the user in the database, 
      // we should still allow the registration to succeed if auth was successful
      updateAuthState(null, false);
      return { success: false, message: 'An unexpected error occurred during registration' };
    }
  };

  const logout = async () => {
    const userId = authState.user?.id;
    
    try {
      await SupabaseAuthService.logout();
      updateAuthState(null, false);
      
      if (userId) {
        logSecurityEvent('logout', 'User logged out', userId);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still update local state even if Supabase logout fails
      updateAuthState(null, false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;
    
    try {
      const result = await SupabaseAuthService.updateProfile(authState.user.id, updates);
      
      if (result.success) {
        // Also update the application's users table
        await SupabaseDataService.updateUser(authState.user.id, updates);
        
        // Update local user state
        const updatedUser = { ...authState.user, ...updates };
        updateAuthState(updatedUser, true);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const switchRole = (newRole: 'admin' | 'farmer' | 'customer' | 'vendor') => {
    if (!authState.user) return false;
    
    // In a real implementation, this would check if the user has access to the requested role
    // For now, we'll allow role switching for demonstration purposes
    const updatedUser = { ...authState.user, role: newRole };
    updateAuthState(updatedUser, true);
    return true;
  };

  const hasPermission = (permission: Permission) => {
    return authState.permissions.includes(permission);
  };

  const canAccessFeature = (feature: string) => {
    // Implementation would depend on how features are mapped to permissions
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        hasPermission,
        canAccessFeature,
        securityLog
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};