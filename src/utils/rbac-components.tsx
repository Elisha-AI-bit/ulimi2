import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../types';
import { PermissionManager } from './rbac';

// Higher-Order Component for permission-based rendering
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission | Permission[],
  fallback?: ReactNode
) {
  return function PermissionWrappedComponent(props: P) {
    const { authState } = useAuth();
    
    const hasPermission = Array.isArray(requiredPermission)
      ? PermissionManager.hasAnyPermission(authState.user, requiredPermission)
      : PermissionManager.hasPermission(authState.user, requiredPermission);

    if (!hasPermission) {
      return fallback ? <>{fallback}</> : null;
    }

    return <Component {...props} />;
  };
}

// Permission Guard Component
interface PermissionGuardProps {
  permission: Permission | Permission[];
  requireAll?: boolean; // If true, requires all permissions; if false, requires any
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  requireAll = false,
  fallback = null,
  children
}) => {
  const { authState } = useAuth();
  
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  const hasPermission = requireAll
    ? PermissionManager.hasAllPermissions(authState.user, permissions)
    : PermissionManager.hasAnyPermission(authState.user, permissions);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Feature Access Component
interface FeatureGuardProps {
  feature: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  feature,
  fallback = null,
  children
}) => {
  const { authState } = useAuth();
  
  const canAccess = PermissionManager.canAccessFeature(authState.user, feature);

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Role-based Component
interface RoleGuardProps {
  roles: string | string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  fallback = null,
  children
}) => {
  const { authState } = useAuth();
  
  if (!authState.user) {
    return <>{fallback}</>;
  }
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = allowedRoles.includes(authState.user.role);

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Unauthorized Access Component
export const UnauthorizedAccess: React.FC<{ message?: string }> = ({ 
  message = "You don't have permission to access this feature." 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚫</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Account Locked Component
export const AccountLocked: React.FC<{ remainingTime: number; onRetry: () => void }> = ({ 
  remainingTime, 
  onRetry 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-red-500 text-lg">🔒</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Account Temporarily Locked</h3>
          <p className="text-sm text-red-700 mt-1">
            Too many failed login attempts. Please try again in {remainingTime} minutes.
          </p>
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-800 underline hover:text-red-900"
          >
            Check Again
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom hooks for permissions
export const usePermissions = () => {
  const { authState } = useAuth();
  
  return {
    user: authState.user,
    permissions: authState.permissions,
    hasPermission: (permission: Permission) => 
      PermissionManager.hasPermission(authState.user, permission),
    hasAnyPermission: (permissions: Permission[]) => 
      PermissionManager.hasAnyPermission(authState.user, permissions),
    hasAllPermissions: (permissions: Permission[]) => 
      PermissionManager.hasAllPermissions(authState.user, permissions),
    canAccessFeature: (feature: string) => 
      PermissionManager.canAccessFeature(authState.user, feature),
    getAccessibleFeatures: () => 
      PermissionManager.getAccessibleFeatures(authState.user)
  };
};

export const useRole = () => {
  const { authState } = useAuth();
  
  return {
    role: authState.user?.role,
    isAdmin: authState.user?.role === 'admin',
    isFarmer: authState.user?.role === 'farmer',
    isCustomer: authState.user?.role === 'customer',
    isUSSDUser: authState.user?.role === 'ussd_user',
    canSwitchToRole: (targetRole: string) => 
      PermissionManager.canSwitchToRole(authState.user, targetRole)
  };
};

// Permission-based navigation item
interface PermissionNavItemProps {
  permission?: Permission | Permission[];
  feature?: string;
  role?: string | string[];
  requireAll?: boolean;
  children: ReactNode;
}

export const PermissionNavItem: React.FC<PermissionNavItemProps> = ({
  permission,
  feature,
  role,
  requireAll = false,
  children
}) => {
  const { authState } = useAuth();
  
  // Check permission-based access
  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requireAll
      ? PermissionManager.hasAllPermissions(authState.user, permissions)
      : PermissionManager.hasAnyPermission(authState.user, permissions);
    
    if (!hasPermission) return null;
  }
  
  // Check feature-based access
  if (feature && !PermissionManager.canAccessFeature(authState.user, feature)) {
    return null;
  }
  
  // Check role-based access
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!authState.user || !allowedRoles.includes(authState.user.role)) {
      return null;
    }
  }
  
  return <>{children}</>;
};