import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { message: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug }
    })

    if (existingTag) {
      return NextResponse.json(
        { message: 'Tag with this slug already exists' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { message: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
