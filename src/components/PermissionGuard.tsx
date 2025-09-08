'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/lib/permissions'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PermissionGuardProps {
  children: ReactNode
  resource: string
  action: string
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Component that protects content based on user permissions
 * @param children - Content to render if user has permission
 * @param resource - Resource name (e.g., 'posts', 'categories', 'users')
 * @param action - Action name (e.g., 'read', 'create', 'update', 'delete')
 * @param fallback - Content to render if user doesn't have permission
 * @param redirectTo - Route to redirect to if user doesn't have permission
 */
export function PermissionGuard({ 
  children, 
  resource, 
  action, 
  fallback = null, 
  redirectTo 
}: PermissionGuardProps) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions(user?.role as any)
  const router = useRouter()

  const canAccess = hasPermission(resource, action)

  useEffect(() => {
    if (!canAccess && redirectTo) {
      router.push(redirectTo)
    }
  }, [canAccess, redirectTo, router])

  if (!canAccess) {
    return fallback as React.ReactElement
  }

  return children as React.ReactElement
}

/**
 * Hook to check if user can perform a specific action
 * @param resource - Resource name
 * @param action - Action name
 * @returns boolean indicating if user has permission
 */
export function useCanAccess(resource: string, action: string): boolean {
  const { user } = useAuth()
  const { hasPermission } = usePermissions(user?.role as any)
  
  return hasPermission(resource, action)
}

/**
 * Component that shows content only if user has permission
 * @param children - Content to render if user has permission
 * @param resource - Resource name
 * @param action - Action name
 */
export function ShowIfCanAccess({ children, resource, action }: Omit<PermissionGuardProps, 'fallback' | 'redirectTo'>) {
  return (
    <PermissionGuard resource={resource} action={action}>
      {children}
    </PermissionGuard>
  )
}

/**
 * Component that shows content only if user doesn't have permission
 * @param children - Content to render if user doesn't have permission
 * @param resource - Resource name
 * @param action - Action name
 */
export function HideIfCanAccess({ children, resource, action }: Omit<PermissionGuardProps, 'fallback' | 'redirectTo'>) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions(user?.role as any)
  
  const canAccess = hasPermission(resource, action)
  
  if (canAccess) {
    return null
  }
  
  return children as React.ReactElement
}

/**
 * Higher-order component to protect pages
 * @param WrappedComponent - Component to protect
 * @param resource - Resource name
 * @param action - Action name
 * @param redirectTo - Route to redirect to if no permission
 */
export function withPermission<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  resource: string,
  action: string,
  redirectTo?: string
) {
  return function ProtectedComponent(props: T) {
    return (
      <PermissionGuard resource={resource} action={action} redirectTo={redirectTo}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    )
  }
}

/**
 * Component for displaying permission-based buttons/actions
 * @param children - Button/action content
 * @param resource - Resource name
 * @param action - Action name
 * @param disabled - Whether to disable instead of hide
 */
interface PermissionButtonProps extends Omit<PermissionGuardProps, 'fallback' | 'redirectTo'> {
  disabled?: boolean
  className?: string
}

export function PermissionButton({ 
  children, 
  resource, 
  action, 
  disabled = false,
  className = ''
}: PermissionButtonProps) {
  const { user } = useAuth()
  const { hasPermission } = usePermissions(user?.role as any)
  
  const canAccess = hasPermission(resource, action)
  
  if (!canAccess && !disabled) {
    return null
  }
  
  if (disabled && !canAccess) {
    return (
      <div className={`opacity-50 pointer-events-none ${className}`}>
        {children}
      </div>
    )
  }
  
  return children as React.ReactElement
}
