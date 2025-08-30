import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, SecurityLog, Permission } from '../types';
import { storage } from '../utils/storage';
import { PermissionManager, SecurityManager, ROLE_PERMISSIONS } from '../utils/rbac';

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchRole: (newRole: 'admin' | 'farmer' | 'customer') => boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccessFeature: (feature: string) => boolean;
  securityLog: SecurityLog[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database with enhanced security
const MOCK_USERS: User[] = [
  {
    id: 'admin_001',
    name: 'Mubita',
    email: 'admin@ulimi.com',
    phone: '+260977000001',
    username: 'admin',
    role: 'admin',
    location: {
      province: 'Lusaka',
      district: 'Lusaka',
      coordinates: [-15.3875, 28.3228] as [number, number]
    },
    language: 'en',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'farmer_001',
    name: 'Mirriam',
    email: 'mirriam@ulimi.com',
    phone: '+260977123456',
    username: 'mirriam',
    role: 'farmer',
    location: {
      province: 'Lusaka',
      district: 'Lusaka',
      coordinates: [-15.3875, 28.3228] as [number, number]
    },
    language: 'en',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'customer_001',
    name: 'Natasha',
    email: 'natasha@ulimi.com',
    phone: '+260977987654',
    username: 'natasha',
    role: 'customer',
    location: {
      province: 'Copperbelt',
      district: 'Kitwe'
    },
    language: 'en',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Mock credentials database
const MOCK_CREDENTIALS: Record<string, { password: string }> = {
  'admin@ulimi.com': { password: 'Admin@123' },
  'admin': { password: 'Admin@123' },
  '+260977000001': { password: 'Admin@123' },
  
  'mirriam@ulimi.com': { password: 'Farmer@123' },
  'mirriam': { password: 'Farmer@123' },
  '+260977123456': { password: 'Farmer@123' },
  
  'natasha@ulimi.com': { password: 'Customer@123' },
  'natasha': { password: 'Customer@123' },
  '+260977987654': { password: 'Customer@123' }
};

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
    try {
      const savedUser = storage.getUser();
      const savedLogs = storage.get<SecurityLog[]>('security_logs') || [];
      
      setSecurityLog(savedLogs);
      
      if (savedUser && savedUser.isActive) {
        updateAuthState(savedUser, true);
        logSecurityEvent('login', 'Session restored from storage', savedUser.id);
      } else {
        updateAuthState(null, false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Ensure we don't stay in loading state even if there's an error
      updateAuthState(null, false);
    }
  }, []);

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

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    updateAuthState(null, false);
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Check if account is locked
    if (SecurityManager.isAccountLocked(credentials.identifier)) {
      const remainingTime = SecurityManager.getRemainingLockoutTime(credentials.identifier);
      logSecurityEvent('failed_login', `Account locked - ${credentials.identifier}`);
      updateAuthState(null, false);
      return {
        success: false,
        message: `Account temporarily locked. Try again in ${remainingTime} minutes.`
      };
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by identifier
    let user = MOCK_USERS.find(u => 
      u.email === credentials.identifier || 
      u.phone === credentials.identifier || 
      u.username === credentials.identifier
    );
    
    // Check credentials
    const userCredentials = MOCK_CREDENTIALS[credentials.identifier];
    const isValidPassword = userCredentials?.password === credentials.password;
    
    if (user && isValidPassword && user.isActive) {
      // Clear failed attempts on successful login
      SecurityManager.clearFailedAttempts(credentials.identifier);
      
      // Update last login
      user = { ...user, lastLogin: new Date().toISOString() };
      
      storage.saveUser(user);
      updateAuthState(user, true);
      
      logSecurityEvent('login', `Successful login via ${credentials.loginType}`, user.id);
      
      return { success: true, message: 'Login successful' };
    } else {
      // Record failed attempt
      SecurityManager.recordFailedAttempt(credentials.identifier);
      
      const failureReason = !user ? 'User not found' : 
                           !user.isActive ? 'Account inactive' : 
                           'Invalid password';
      
      logSecurityEvent('failed_login', `Failed login: ${failureReason} - ${credentials.identifier}`);
      updateAuthState(null, false);
      
      return {
        success: false,
        message: 'Invalid credentials or inactive account'
      };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Validate password strength
    const passwordValidation = SecurityManager.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      updateAuthState(null, false);
      return {
        success: false,
        message: passwordValidation.errors[0]
      };
    }
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => 
      u.email === data.email || 
      u.phone === data.phone || 
      (data.username && u.username === data.username)
    );
    
    if (existingUser) {
      updateAuthState(null, false);
      return {
        success: false,
        message: 'User already exists with this email, phone, or username'
      };
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new user
    const newUser: User = {
      id: `${data.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      username: data.username,
      role: data.role,
      location: {
        province: data.province,
        district: data.district
      },
      language: data.language,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    // Add to mock database (in real app, this would be a backend call)
    MOCK_USERS.push(newUser);
    MOCK_CREDENTIALS[newUser.email] = { password: data.password };
    MOCK_CREDENTIALS[newUser.phone] = { password: data.password };
    if (newUser.username) {
      MOCK_CREDENTIALS[newUser.username] = { password: data.password };
    }
    
    storage.saveUser(newUser);
    updateAuthState(newUser, true);
    
    logSecurityEvent('login', 'Account created and logged in', newUser.id);
    
    return { 
      success: true, 
      message: 'Registration successful! Welcome to ULIMI 2.0' 
    };
  };

  const logout = () => {
    const userId = authState.user?.id;
    
    storage.remove('user');
    updateAuthState(null, false);
    
    if (userId) {
      logSecurityEvent('logout', 'User logged out', userId);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      storage.saveUser(updatedUser);
      updateAuthState(updatedUser, true);
      
      logSecurityEvent('role_change', `Profile updated`, updatedUser.id);
    }
  };

  const switchRole = (newRole: 'admin' | 'farmer' | 'customer'): boolean => {
    if (!authState.user) return false;
    
    // Check if role switch is allowed
    if (!PermissionManager.canSwitchToRole(authState.user, newRole)) {
      logSecurityEvent('permission_denied', `Attempted unauthorized role switch to ${newRole}`, authState.user.id);
      return false;
    }
    
    const updatedUser = { 
      ...authState.user, 
      role: newRole,
      lastLogin: new Date().toISOString()
    };
    
    storage.saveUser(updatedUser);
    updateAuthState(updatedUser, true);
    
    logSecurityEvent('role_change', `Role switched to ${newRole}`, updatedUser.id);
    return true;
  };

  // Permission checking methods
  const hasPermission = (permission: Permission): boolean => {
    return PermissionManager.hasPermission(authState.user, permission);
  };

  const canAccessFeature = (feature: string): boolean => {
    return PermissionManager.canAccessFeature(authState.user, feature);
  };

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      register,
      logout,
      updateProfile,
      switchRole,
      hasPermission,
      canAccessFeature,
      securityLog
    }}>
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