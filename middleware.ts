import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { PermissionChecker } from '@/lib/permissions'

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access dashboard
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      const token = req.nextauth.token
      
      // If no token or user is not authenticated, redirect to login
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      
      // Check if user has appropriate role (AUTHOR, EDITOR, or ADMIN)
      if (!['AUTHOR', 'EDITOR', 'ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/', req.url))
      }

      // Check specific route permissions
      const userRole = token.role as 'AUTHOR' | 'EDITOR' | 'ADMIN'
      const permissionChecker = new PermissionChecker(userRole)
      
      // Check if user can access the specific route
      if (!permissionChecker.canAccessRoute(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // For dashboard routes, require authentication
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ]
}
