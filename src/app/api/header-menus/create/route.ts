import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { createHeaderMenuItem, CreateHeaderMenuItemData } from '@/lib/header-menu-service'

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
        message: 'Insufficient permissions to create header menu items',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const body = await request.json()
    const menuData: CreateHeaderMenuItemData = {
      label: body.label || 'New Menu Item',
      href: body.href || '#',
      linkType: body.linkType || 'custom',
      linkId: body.linkId || null,
      parentId: body.parentId || null,
      isActive: body.isActive !== false,
      isExternal: body.isExternal || false,
    }

    const newMenuItem = await createHeaderMenuItem(menuData)

    return NextResponse.json(newMenuItem)
  } catch (error) {
    console.error('Error creating header menu item:', error)
    return NextResponse.json(
      { message: 'Failed to create header menu item' },
      { status: 500 }
    )
  }
}
