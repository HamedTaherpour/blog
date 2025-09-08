import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch a specific social media link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const socialMediaLink = await prisma.socialMediaLink.findUnique({
      where: { id }
    })

    if (!socialMediaLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(socialMediaLink)
  } catch (error) {
    console.error('Error fetching social media link:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media link' },
      { status: 500 }
    )
  }
}

// PUT - Update a social media link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, url, iconName, iconType, order, isActive } = body

    // Check if the social media link exists
    const existingLink = await prisma.socialMediaLink.findUnique({
      where: { id }
    })

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      )
    }

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url)
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        )
      }
    }

    // Build update data object with only provided fields
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (url !== undefined) updateData.url = url.trim()
    if (iconName !== undefined) updateData.iconName = iconName.trim()
    if (iconType !== undefined) updateData.iconType = iconType.trim()
    if (order !== undefined) updateData.order = parseInt(order) || 0
    if (isActive !== undefined) updateData.isActive = Boolean(isActive)

    const updatedLink = await prisma.socialMediaLink.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error('Error updating social media link:', error)
    return NextResponse.json(
      { error: 'Failed to update social media link' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a social media link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if the social media link exists
    const existingLink = await prisma.socialMediaLink.findUnique({
      where: { id }
    })

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Social media link not found' },
        { status: 404 }
      )
    }

    await prisma.socialMediaLink.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Social media link deleted successfully' })
  } catch (error) {
    console.error('Error deleting social media link:', error)
    return NextResponse.json(
      { error: 'Failed to delete social media link' },
      { status: 500 }
    )
  }
}
