import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { message: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { message: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists for other tags
    const existingTag = await prisma.tag.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    })

    if (existingTag) {
      return NextResponse.json(
        { message: 'Tag with this slug already exists' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { message: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { message: 'Tag not found' },
        { status: 404 }
      )
    }

    // Check if tag has associated posts
    if (tag._count.posts > 0) {
      return NextResponse.json(
        { message: 'Cannot delete tag that has associated posts' },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { message: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
