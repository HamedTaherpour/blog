import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { bulkUpdateHeaderMenuItems } from '@/lib/header-menu-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'update')
    if (!hasPermission) {
      return NextResponse.json({
        message: 'Insufficient permissions to perform bulk actions on header menu items',
        userRole: session.user.role
      }, { status: 403 })
    }

    const { action, itemIds } = await request.json()

    if (!action || !itemIds || !Array.isArray(itemIds)) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }

    const result = await bulkUpdateHeaderMenuItems(action, itemIds)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error performing bulk action on header menu items:', error)
    return NextResponse.json(
      { message: 'Failed to perform bulk action' },
      { status: 500 }
    )
  }
}
