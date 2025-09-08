import { canAccess } from '@/lib/api-middleware'
import { authOptions } from '@/lib/auth'
import { deleteHeaderMenuItem, updateHeaderMenuItem } from '@/lib/header-menu-service'
import { UserRole } from '@/lib/permissions'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        {
          message: 'Insufficient permissions to update header menu item',
          userRole: session.user.role,
        },
        { status: 403 }
      )
    }

    const data = await request.json()
    const updatedMenuItem = await updateHeaderMenuItem(id, data)

    return NextResponse.json(updatedMenuItem, { status: 200 })
  } catch (error) {
    console.error('Error updating header menu item:', error)
    return NextResponse.json({ message: 'Failed to update header menu item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'settings', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        {
          message: 'Insufficient permissions to delete header menu item',
          userRole: session.user.role,
        },
        { status: 403 }
      )
    }

    await deleteHeaderMenuItem(id)

    return NextResponse.json({ message: 'Menu item deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting header menu item:', error)
    return NextResponse.json({ message: 'Failed to delete header menu item' }, { status: 500 })
  }
}
