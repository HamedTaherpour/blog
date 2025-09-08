import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'categories', 'update')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to reset category orders',
        userRole: session.user.role 
      }, { status: 403 })
    }

    // Get all categories grouped by parent
    const categories = await prisma.category.findMany({
      orderBy: [
        { parentId: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Group by parent
    const groupedByParent = categories.reduce((acc, category) => {
      const parentKey = category.parentId || 'root'
      if (!acc[parentKey]) {
        acc[parentKey] = []
      }
      acc[parentKey].push(category)
      return acc
    }, {} as Record<string, typeof categories>)

    // Reset orders for each group
    for (const [parentKey, siblings] of Object.entries(groupedByParent)) {
      for (let i = 0; i < siblings.length; i++) {
        await prisma.category.update({
          where: { id: siblings[i].id },
          data: { order: i }
        })
      }
    }

    return NextResponse.json({ 
      message: 'Category orders reset successfully',
      resetCount: categories.length 
    })
  } catch (error) {
    console.error('Error resetting category orders:', error)
    return NextResponse.json(
      { message: 'Failed to reset category orders' },
      { status: 500 }
    )
  }
}
