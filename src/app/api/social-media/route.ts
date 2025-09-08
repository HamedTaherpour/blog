import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all social media links
export async function GET() {
  try {
    const socialMediaLinks = await prisma.socialMediaLink.findMany({
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(socialMediaLinks)
  } catch (error) {
    console.error('Error fetching social media links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media links' },
      { status: 500 }
    )
  }
}

// POST - Create a new social media link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, iconName, iconType = 'hugeicons', order = 0, isActive = true } = body

    // Validate required fields
    if (!name || !url || !iconName) {
      return NextResponse.json(
        { error: 'Name, URL, and icon name are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const socialMediaLink = await prisma.socialMediaLink.create({
      data: {
        name: name.trim(),
        url: url.trim(),
        iconName: iconName.trim(),
        iconType: iconType.trim(),
        order: parseInt(order) || 0,
        isActive: Boolean(isActive)
      }
    })

    return NextResponse.json(socialMediaLink, { status: 201 })
  } catch (error) {
    console.error('Error creating social media link:', error)
    return NextResponse.json(
      { error: 'Failed to create social media link' },
      { status: 500 }
    )
  }
}
