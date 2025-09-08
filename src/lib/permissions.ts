// Role-Based Access Control (RBAC) System
// Defines what each role can access

export type UserRole = 'AUTHOR' | 'EDITOR' | 'ADMIN'

export interface Permission {
  resource: string
  actions: string[]
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  description: string
}

// Define permissions for each role based on exact requirements
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'AUTHOR',
    description: 'Can only manage posts - full access to posts only',
    permissions: [
      { resource: 'posts', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'profile', actions: ['read', 'update'] },
    ]
  },
  {
    role: 'EDITOR',
    description: 'Can manage posts, categories, tags, and media - full access to content management',
    permissions: [
      { resource: 'posts', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'tags', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'media', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'profile', actions: ['read', 'update'] },
    ]
  },
  {
    role: 'ADMIN',
    description: 'Full system access - can manage everything including users and settings',
    permissions: [
      { resource: 'posts', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'categories', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'tags', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'media', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'menus', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'profile', actions: ['read', 'update'] },
    ]
  }
]

// Helper functions for permission checking
export class PermissionChecker {
  private userRole: UserRole

  constructor(userRole: UserRole) {
    this.userRole = userRole
  }

  // Check if user has permission for a specific resource and action
  hasPermission(resource: string, action: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === this.userRole)
    if (!rolePermissions) return false

    const permission = rolePermissions.permissions.find(p => p.resource === resource)
    if (!permission) return false

    return permission.actions.includes(action)
  }

  // Check if user can access a specific route
  canAccessRoute(route: string): boolean {
    const routePermissions: Record<string, { resource: string; action: string }> = {
      '/dashboard/posts': { resource: 'posts', action: 'read' },
      '/dashboard/posts/new': { resource: 'posts', action: 'create' },
      '/dashboard/posts/[id]': { resource: 'posts', action: 'read' },
      '/dashboard/categories': { resource: 'categories', action: 'read' },
      '/dashboard/tags': { resource: 'tags', action: 'read' },
      '/dashboard/media': { resource: 'media', action: 'read' },
      '/dashboard/users': { resource: 'users', action: 'read' },
      '/dashboard/users/new': { resource: 'users', action: 'create' },
      '/dashboard/users/[id]': { resource: 'users', action: 'read' },
      '/dashboard/settings': { resource: 'settings', action: 'read' },
      '/dashboard/menus': { resource: 'menus', action: 'read' },
    }

    const permission = routePermissions[route]
    if (!permission) return true // Allow access to unknown routes

    return this.hasPermission(permission.resource, permission.action)
  }

  // Get all permissions for the user's role
  getUserPermissions(): Permission[] {
    const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === this.userRole)
    return rolePermissions?.permissions || []
  }

  // Get role description
  getRoleDescription(): string {
    const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === this.userRole)
    return rolePermissions?.description || ''
  }
}

// Hook for using permissions in React components
export function usePermissions(userRole: UserRole) {
  const checker = new PermissionChecker(userRole)

  return {
    hasPermission: (resource: string, action: string) => checker.hasPermission(resource, action),
    canAccessRoute: (route: string) => checker.canAccessRoute(route),
    getUserPermissions: () => checker.getUserPermissions(),
    getRoleDescription: () => checker.getRoleDescription(),
    userRole,
  }
}

// API middleware for checking permissions
export function checkAPIPermission(userRole: UserRole, resource: string, action: string): boolean {
  const checker = new PermissionChecker(userRole)
  return checker.hasPermission(resource, action)
}

// Navigation items based on permissions
export function getNavigationItems(userRole: UserRole) {
  const checker = new PermissionChecker(userRole)
  
  const allItems = [
    { name: 'Posts', href: '/dashboard/posts' },
    { name: 'Categories', href: '/dashboard/categories' },
    { name: 'Tags', href: '/dashboard/tags' },
    { name: 'Media', href: '/dashboard/media' },
    { name: 'Users', href: '/dashboard/users' },
    { name: 'Menus', href: '/dashboard/menus' },
    { name: 'Site Settings', href: '/dashboard/settings' },
  ]

  return allItems.filter(item => {
    switch (item.href) {
      case '/dashboard/posts':
        return checker.hasPermission('posts', 'read')
      case '/dashboard/categories':
        return checker.hasPermission('categories', 'read')
      case '/dashboard/tags':
        return checker.hasPermission('tags', 'read')
      case '/dashboard/media':
        return checker.hasPermission('media', 'read')
      case '/dashboard/users':
        return checker.hasPermission('users', 'read')
      case '/dashboard/menus':
        return checker.hasPermission('menus', 'read')
      case '/dashboard/settings':
        return checker.hasPermission('settings', 'read')
      default:
        return true
    }
  })
}
