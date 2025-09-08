import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { 
  getCategoryById, 
  updateCategory, 
  deleteCategory, 
  getCategoryBreadcrumb,
  UpdateCategoryData
} from '@/lib/category-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeBreadcrumb = searchParams.get('breadcrumb') === 'true'
    
    const category = await getCategoryById(id)
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    let responseData: any = category

    if (includeBreadcrumb) {
      const breadcrumb = await getCategoryBreadcrumb(id)
      responseData = {
        ...category,
        breadcrumb
      }
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { message: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'categories', 'update')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to update categories',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const formData = await request.formData()
    
    // Basic category data
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const color = formData.get('color') as string
    const order = formData.get('order') as string
    // SEO fields
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string
    const metaKeywords = formData.get('metaKeywords') as string
    const canonicalUrl = formData.get('canonicalUrl') as string
    // Open Graph fields
    const ogTitle = formData.get('ogTitle') as string
    const ogDescription = formData.get('ogDescription') as string
    const ogType = formData.get('ogType') as string
    const ogImage = formData.get('ogImage') as string
    // Twitter Card fields
    const twitterCard = formData.get('twitterCard') as string
    const twitterTitle = formData.get('twitterTitle') as string
    const twitterDescription = formData.get('twitterDescription') as string
    const twitterImage = formData.get('twitterImage') as string
    // Icon and Media fields
    const ogImageMediaId = formData.get('ogImageMediaId') as string
    const twitterImageMediaId = formData.get('twitterImageMediaId') as string
    // Parent category
    const parentId = formData.get('parentId') as string

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const { id } = await params

    // Check if slug already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    const updateData: UpdateCategoryData = {
      name,
      slug,
      description: description || undefined,
      color: color || undefined,
      order: order ? parseInt(order) : undefined,
      parentId: parentId || undefined,
      // SEO fields
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      metaKeywords: metaKeywords || undefined,
      canonicalUrl: canonicalUrl || undefined,
      // Open Graph fields
      ogTitle: ogTitle || undefined,
      ogDescription: ogDescription || undefined,
      ogType: ogType || undefined,
      ogImage: ogImage || undefined,
      // Twitter Card fields
      twitterCard: twitterCard || undefined,
      twitterTitle: twitterTitle || undefined,
      twitterDescription: twitterDescription || undefined,
      twitterImage: twitterImage || undefined,
      // Icon and Media fields
      ogImageMediaId: ogImageMediaId || undefined,
      twitterImageMediaId: twitterImageMediaId || undefined,
    }

    const category = await updateCategory(id, updateData)

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'categories', 'delete')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to delete categories',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const { id } = await params
    await deleteCategory(id)

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    )
  }
}