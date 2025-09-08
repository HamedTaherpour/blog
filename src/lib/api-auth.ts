import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Try to get session from NextAuth
    const session = await getServerSession(authOptions)
    
    if (session?.user) {
      return session.user
    }

    // If no session, try to get user info from cookies
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token')
    
    if (sessionToken) {
      // For now, return a mock admin user for testing
      // TODO: Implement proper session token validation
      console.log('Found session token, returning mock admin user')
      return {
        id: 'admin-user',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
        username: 'admin'
      }
    }

    return null
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

export async function checkUserPermission(request: NextRequest, resource: string, action: string) {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return { allowed: false, error: 'Unauthorized' }
  }

  if (!user.role) {
    return { allowed: false, error: 'No role assigned' }
  }

  // Import permission checker dynamically to avoid circular imports
  const { checkAPIPermission } = await import('@/lib/permissions')
  
  if (!checkAPIPermission(user.role as any, resource, action)) {
    return { allowed: false, error: 'Forbidden' }
  }

  return { allowed: true, user }
}
