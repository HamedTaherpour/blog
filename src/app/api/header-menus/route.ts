import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const headerMenus = await prisma.headerMenuItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      include: {
        children: {
          where: {
            isActive: true,
          },
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    })

    // Filter to only show parent items (items without parentId)
    const parentMenus = headerMenus.filter(menu => !menu.parentId)

    return NextResponse.json(parentMenus)
  } catch (error) {
    console.error('Error fetching header menus:', error)
    return NextResponse.json(
      { error: 'Failed to fetch header menus' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { menus } = body

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
            isActive: menu.isActive !== false,
            isExternal: menu.isExternal || false,
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
                isActive: child.isActive !== false,
                isExternal: child.isExternal || false,
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
