import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const footerMenuGroups = await prisma.footerMenuGroup.findMany({
      include: {
        menuItems: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(footerMenuGroups)
  } catch (error) {
    console.error('Error fetching footer menus:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer menus' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { groups } = body

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing footer menu groups and items
      await tx.footerMenuItem.deleteMany()
      await tx.footerMenuGroup.deleteMany()

      // Create new groups and items
      const createdGroups = []
      for (const group of groups) {
        const createdGroup = await tx.footerMenuGroup.create({
          data: {
            title: group.title,
            order: group.order,
            isActive: group.isActive ?? true,
            menuItems: {
              create: group.menuItems.map((item: any) => ({
                label: item.label,
                href: item.href,
                order: item.order,
                isActive: item.isActive ?? true
              }))
            }
          },
          include: {
            menuItems: true
          }
        })
        createdGroups.push(createdGroup)
      }

      return createdGroups
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating footer menus:', error)
    return NextResponse.json(
      { error: 'Failed to update footer menus' },
      { status: 500 }
    )
  }
}
