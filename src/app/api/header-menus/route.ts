import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { 
  getHeaderMenusHierarchy, 
  getHeaderMenusFlat, 
  getActiveHeaderMenus,
  createHeaderMenuItem, 
  updateHeaderMenuItem, 
  deleteHeaderMenuItem, 
  reorderHeaderMenus,
  getLinkOptions,
  CreateHeaderMenuItemData,
  UpdateHeaderMenuItemData,
  ReorderHeaderMenuData
} from '@/lib/header-menu-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'hierarchy'
    const active = searchParams.get('active') === 'true'
    
    let menuItems
    
    if (active) {
      menuItems = await getActiveHeaderMenus()
    } else if (format === 'flat') {
      menuItems = await getHeaderMenusFlat()
    } else {
      menuItems = await getHeaderMenusHierarchy()
    }

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching header menus:', error)
    return NextResponse.json(
      { message: 'Failed to fetch header menus' },
      { status: 500 }
    )
  }
}

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
        message: 'Insufficient permissions to update header menus',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const body = await request.json()
    const { menus }: { menus: any[] } = body

    if (!menus || !Array.isArray(menus)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected menus array.' },
        { status: 400 }
      )
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing header menus
      await tx.headerMenuItem.deleteMany({})

      // Create new header menus
      const createdMenus = []

      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        
        // Create parent menu item
        const parentMenu = await tx.headerMenuItem.create({
          data: {
            label: menu.label,
            href: menu.href,
            order: i,
            level: 0,
            path: '',
            isActive: menu.isActive !== false,
            isExternal: menu.isExternal || false,
            linkType: menu.linkType || 'custom',
            linkId: menu.linkId || null,
          },
        })

        createdMenus.push(parentMenu)

        // Create child menu items if they exist
        if (menu.children && menu.children.length > 0) {
          for (let j = 0; j < menu.children.length; j++) {
            const child = menu.children[j]
            await tx.headerMenuItem.create({
              data: {
                label: child.label,
                href: child.href,
                order: j,
                level: 1,
                path: parentMenu.id,
                isActive: child.isActive !== false,
                isExternal: child.isExternal || false,
                linkType: child.linkType || 'custom',
                linkId: child.linkId || null,
                parentId: parentMenu.id,
              },
            })
          }
        }
      }

      return createdMenus
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating header menus:', error)
    return NextResponse.json(
      { error: 'Failed to update header menus' },
      { status: 500 }
    )
  }
}