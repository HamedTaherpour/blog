import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { getLinkOptions } from '@/lib/header-menu-service'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'read')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to access link options',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const linkOptions = await getLinkOptions()

    return NextResponse.json(linkOptions)
  } catch (error) {
    console.error('Error fetching link options:', error)
    return NextResponse.json(
      { message: 'Failed to fetch link options' },
      { status: 500 }
    )
  }
}
