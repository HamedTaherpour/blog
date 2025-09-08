import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkAPIPermission, UserRole } from '@/lib/permissions'

export interface APIMiddlewareOptions {
  resource: string
  action: string
  requireAuth?: boolean
}

/**
 * Middleware function to check user permissions for API routes
 * @param options - Permission requirements
 * @returns Middleware function
 */
export function withPermission(options: APIMiddlewareOptions) {
  return async function middleware(
    handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
  ) {
    return async function protectedHandler(
      request: NextRequest,
      ...args: any[]
    ): Promise<NextResponse> {
      try {
        // Get user session
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
          return NextResponse.json(
            { message: 'Authentication required' },
            { status: 401 }
          )
        }

        // Check if user has required permission
        const hasPermission = checkAPIPermission(
          session.user.role as UserRole,
          options.resource,
          options.action
        )

        if (!hasPermission) {
          return NextResponse.json(
            { 
              message: `Insufficient permissions. Required: ${options.resource}:${options.action}`,
              userRole: session.user.role 
            },
            { status: 403 }
          )
        }

        // Add user info to request for use in handler
        const requestWithUser = {
          ...request,
          user: session.user
        } as NextRequest & { user: any }

        // Call the original handler
        return await handler(requestWithUser, ...args)
      } catch (error) {
        console.error('Permission middleware error:', error)
        return NextResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
        )
      }
    }
  }
}

/**
 * Higher-order function to wrap API handlers with permission checks
 * @param handler - The API handler function
 * @param options - Permission requirements
 * @returns Protected handler function
 */
export function protectAPI(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: APIMiddlewareOptions
) {
  return withPermission(options)(handler)
}

/**
 * Check if user can access a specific resource
 * @param userRole - User's role
 * @param resource - Resource name
 * @param action - Action name
 * @returns boolean
 */
export function canAccess(userRole: UserRole, resource: string, action: string): boolean {
  return checkAPIPermission(userRole, resource, action)
}

/**
 * Get user's accessible resources based on their role
 * @param userRole - User's role
 * @returns Array of accessible resources
 */
export function getAccessibleResources(userRole: UserRole): string[] {
  const resources: string[] = []
  
  if (canAccess(userRole, 'posts', 'read')) resources.push('posts')
  if (canAccess(userRole, 'categories', 'read')) resources.push('categories')
  if (canAccess(userRole, 'tags', 'read')) resources.push('tags')
  if (canAccess(userRole, 'media', 'read')) resources.push('media')
  if (canAccess(userRole, 'users', 'read')) resources.push('users')
  if (canAccess(userRole, 'settings', 'read')) resources.push('settings')
  
  return resources
}

/**
 * Check if user is admin
 * @param userRole - User's role
 * @returns boolean
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'ADMIN'
}

/**
 * Check if user is editor or admin
 * @param userRole - User's role
 * @returns boolean
 */
export function isEditorOrAdmin(userRole: UserRole): boolean {
  return userRole === 'EDITOR' || userRole === 'ADMIN'
}

/**
 * Check if user is author or higher
 * @param userRole - User's role
 * @returns boolean
 */
export function isAuthorOrHigher(userRole: UserRole): boolean {
  return ['AUTHOR', 'EDITOR', 'ADMIN'].includes(userRole)
}
