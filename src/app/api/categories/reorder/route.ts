import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { reorderCategories, ReorderCategoriesData } from '@/lib/category-service'

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
        message: 'Insufficient permissions to reorder categories',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const body = await request.json()
    const { reorderData }: { reorderData: ReorderCategoriesData[] } = body

    console.log('Reorder request received:', reorderData)

    if (!reorderData || !Array.isArray(reorderData)) {
      return NextResponse.json(
        { message: 'Invalid reorder data' },
        { status: 400 }
      )
    }

    // Validate reorder data
    for (const item of reorderData) {
      if (!item.categoryId || typeof item.newOrder !== 'number') {
        return NextResponse.json(
          { message: 'Invalid reorder item: categoryId and newOrder are required' },
          { status: 400 }
        )
      }
    }

    // Debug: Log current state before reorder
    const categoriesBefore = await prisma.category.findMany({
      where: {
        id: { in: reorderData.map(item => item.categoryId) }
      }
    })
    console.log('Categories before reorder:', categoriesBefore.map(c => ({
      id: c.id,
      name: c.name,
      order: c.order,
      parentId: c.parentId
    })))

    await reorderCategories(reorderData)

    // Debug: Log state after reorder
    const categoriesAfter = await prisma.category.findMany({
      where: {
        id: { in: reorderData.map(item => item.categoryId) }
      }
    })
    console.log('Categories after reorder:', categoriesAfter.map(c => ({
      id: c.id,
      name: c.name,
      order: c.order,
      parentId: c.parentId
    })))

    return NextResponse.json({ message: 'Categories reordered successfully' })
  } catch (error) {
    console.error('Error reordering categories:', error)
    return NextResponse.json(
      { message: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
}
