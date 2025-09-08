import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Reorder social media links
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { links } = body

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { error: 'Links must be an array' },
        { status: 400 }
      )
    }

    // Update order for each link
    await Promise.all(
      links.map((link: { id: string; order: number }) =>
        prisma.socialMediaLink.update({
          where: { id: link.id },
          data: { order: link.order }
        })
      )
    )

    return NextResponse.json({ message: 'Social media links reordered successfully' })
  } catch (error) {
    console.error('Error reordering social media links:', error)
    return NextResponse.json(
      { error: 'Failed to reorder social media links' },
      { status: 500 }
    )
  }
}
