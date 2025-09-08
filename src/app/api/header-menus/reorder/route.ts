import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { reorderHeaderMenus, getLinkOptions, ReorderHeaderMenuData } from '@/lib/header-menu-service'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'update')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to reorder menu items',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const body = await request.json()
    const { reorderData }: { reorderData: ReorderHeaderMenuData[] } = body

    console.log('Reorder request received:', reorderData)

    if (!reorderData || !Array.isArray(reorderData)) {
      return NextResponse.json(
        { message: 'Invalid reorder data' },
        { status: 400 }
      )
    }

    // Validate reorder data
    for (const item of reorderData) {
      if (!item.menuItemId || typeof item.newOrder !== 'number') {
        return NextResponse.json(
          { message: 'Invalid reorder item: menuItemId and newOrder are required' },
          { status: 400 }
        )
      }
    }

    await reorderHeaderMenus(reorderData)

    return NextResponse.json({ message: 'Menu items reordered successfully' })
  } catch (error) {
    console.error('Error reordering menu items:', error)
    return NextResponse.json(
      { message: 'Failed to reorder menu items' },
      { status: 500 }
    )
  }
}
