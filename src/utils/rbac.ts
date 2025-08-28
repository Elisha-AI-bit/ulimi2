import { Permission, Role, User } from '../types';

// Role-Permission Matrix based on requirements
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    // Admin-specific permissions
    'manage_users',
    'configure_system',
    'view_analytics',
    'view_reports',
    // Farmer permissions (admin should have access to all farmer features)
    'manage_farm_profile',
    'add_products',
    'update_products',
    'receive_soil_advice',
    'receive_plant_advice',
    // Customer permissions (admin should have access to all customer features)
    'browse_marketplace',
    'place_orders',
    'make_payments',
    'track_orders',
    'track_deliveries',
    'rate_products',
    'review_products',
    // Universal permissions
    'receive_notifications',
    'update_profile',
    'view_weather'
  ],
  farmer: [
    'manage_farm_profile',
    'add_products',
    'update_products',
    'receive_soil_advice',
    'receive_plant_advice',
    'receive_notifications',
    'update_profile',
    'view_weather'
  ],
  customer: [
    'browse_marketplace',
    'place_orders',
    'make_payments',
    'track_orders',
    'track_deliveries',
    'rate_products',
    'review_products',
    'receive_notifications',
    'update_profile',
    'view_weather'
  ],
  ussd_user: [
    'manage_farm_profile',
    'add_products',
    'update_products',
    'receive_soil_advice',
    'receive_plant_advice',
    'browse_marketplace',
    'place_orders',
    'track_orders',
    'track_deliveries',
    'receive_notifications',
    'view_weather'
  ]
};

// Role definitions with metadata
export const ROLES: Role[] = [
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with user management and analytics',
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true
  },
  {
    id: 'farmer',
    name: 'farmer',
    displayName: 'Farmer',
    description: 'Manage farm operations, products, and receive agricultural advice',
    permissions: ROLE_PERMISSIONS.farmer,
    isActive: true
  },
  {
    id: 'customer',
    name: 'customer',
    displayName: 'Customer',
    description: 'Browse marketplace, place orders, and manage purchases',
    permissions: ROLE_PERMISSIONS.customer,
    isActive: true
  },
  {
    id: 'ussd_user',
    name: 'ussd_user',
    displayName: 'USSD User',
    description: 'Access via USSD with farming and marketplace features',
    permissions: ROLE_PERMISSIONS.ussd_user,
    isActive: true
  }
];

// Permission checking utilities
export class PermissionManager {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: User | null, permission: Permission): boolean {
    if (!user || !user.isActive) return false;
    
    // Admin users have access to everything
    if (user.role === 'admin') return true;
    
    // Check user-specific permissions first
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }
    
    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    return rolePermissions ? rolePermissions.includes(permission) : false;
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission));
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission));
  }

  /**
   * Get all permissions for a user
   */
  static getUserPermissions(user: User | null): Permission[] {
    if (!user || !user.isActive) return [];
    
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    const userSpecificPermissions = user.permissions || [];
    
    // Combine and deduplicate permissions
    return [...new Set([...rolePermissions, ...userSpecificPermissions])];
  }

  /**
   * Check if a user can access a specific feature/page
   */
  static canAccessFeature(user: User | null, feature: string): boolean {
    if (!user || !user.isActive) return false;
    
    // Admin users can access all features
    if (user.role === 'admin') return true;
    
    const featurePermissions: Record<string, Permission[]> = {
      // Admin features
      'user-management': ['manage_users'],
      'system-settings': ['configure_system'],
      'analytics': ['view_analytics'],
      'reports': ['view_reports'],
      
      // Farmer features
      'farm-management': ['manage_farm_profile'],
      'product-management': ['add_products', 'update_products'],
      'agricultural-advice': ['receive_soil_advice', 'receive_plant_advice'],
      
      // Customer features
      'marketplace': ['browse_marketplace'],
      'orders': ['place_orders'],
      'payments': ['make_payments'],
      'order-tracking': ['track_orders', 'track_deliveries'],
      'product-reviews': ['rate_products', 'review_products'],
      
      // Universal features
      'profile': ['update_profile'],
      'notifications': ['receive_notifications'],
      'weather': ['view_weather']
    };

    const requiredPermissions = featurePermissions[feature];
    if (!requiredPermissions) return false;
    
    return this.hasAnyPermission(user, requiredPermissions);
  }

  /**
   * Get accessible features for a user
   */
  static getAccessibleFeatures(user: User | null): string[] {
    const allFeatures = [
      'user-management', 'system-settings', 'analytics', 'reports',
      'farm-management', 'product-management', 'agricultural-advice',
      'marketplace', 'orders', 'payments', 'order-tracking', 'product-reviews',
      'profile', 'notifications', 'weather'
    ];

    return allFeatures.filter(feature => this.canAccessFeature(user, feature));
  }

  /**
   * Validate role assignment
   */
  static isValidRole(roleName: string): boolean {
    return ROLES.some(role => role.name === roleName && role.isActive);
  }

  /**
   * Get role definition
   */
  static getRoleDefinition(roleName: string): Role | null {
    return ROLES.find(role => role.name === roleName) || null;
  }

  /**
   * Check if user can switch to a specific role
   */
  static canSwitchToRole(currentUser: User | null, targetRole: string): boolean {
    if (!currentUser || !currentUser.isActive) return false;
    
    // Admin can switch to any role
    if (currentUser.role === 'admin') return this.isValidRole(targetRole);
    
    // Regular users can only switch between farmer, customer, and ussd_user
    const allowedRoles = ['farmer', 'customer', 'ussd_user'];
    return allowedRoles.includes(targetRole) && this.isValidRole(targetRole);
  }
}

// Security utilities
export class SecurityManager {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  
  /**
   * Check if account is locked due to failed attempts
   */
  static isAccountLocked(identifier: string): boolean {
    const key = `lockout_${identifier}`;
    const lockoutData = localStorage.getItem(key);
    
    if (!lockoutData) return false;
    
    const { attempts, lastAttempt } = JSON.parse(lockoutData);
    const timeSinceLastAttempt = Date.now() - lastAttempt;
    
    if (timeSinceLastAttempt > this.LOCKOUT_DURATION) {
      localStorage.removeItem(key);
      return false;
    }
    
    return attempts >= this.MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Record a failed login attempt
   */
  static recordFailedAttempt(identifier: string): void {
    const key = `lockout_${identifier}`;
    const existingData = localStorage.getItem(key);
    
    let attempts = 1;
    if (existingData) {
      const data = JSON.parse(existingData);
      attempts = data.attempts + 1;
    }
    
    localStorage.setItem(key, JSON.stringify({
      attempts,
      lastAttempt: Date.now()
    }));
  }

  /**
   * Clear failed login attempts
   */
  static clearFailedAttempts(identifier: string): void {
    const key = `lockout_${identifier}`;
    localStorage.removeItem(key);
  }

  /**
   * Get remaining lockout time in minutes
   */
  static getRemainingLockoutTime(identifier: string): number {
    const key = `lockout_${identifier}`;
    const lockoutData = localStorage.getItem(key);
    
    if (!lockoutData) return 0;
    
    const { lastAttempt } = JSON.parse(lockoutData);
    const timeSinceLastAttempt = Date.now() - lastAttempt;
    const remainingTime = this.LOCKOUT_DURATION - timeSinceLastAttempt;
    
    return Math.max(0, Math.ceil(remainingTime / (60 * 1000)));
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate PIN for USSD users
   */
  static validatePIN(pin: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (pin.length !== 4) {
      errors.push('PIN must be exactly 4 digits');
    }
    
    if (!/^\d{4}$/.test(pin)) {
      errors.push('PIN must contain only numbers');
    }
    
    // Check for common weak PINs
    const weakPins = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321'];
    if (weakPins.includes(pin)) {
      errors.push('PIN is too weak. Please choose a different combination');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}