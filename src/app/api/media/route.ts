import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to read media
    const hasPermission = canAccess(session.user.role as UserRole, 'media', 'read')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to read media',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')
    const mimeType = searchParams.get('mimeType')

    const where: any = {}

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { url: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (mimeType) {
      where.mimeType = { startsWith: mimeType }
    }

    const media = await prisma.media.findMany({
      where,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.media.count({ where })

    return NextResponse.json({
      media,
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
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

    // Check if user has permission to create media
    const hasPermission = canAccess(session.user.role as UserRole, 'media', 'create')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to upload media',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const postId = formData.get('postId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, new Uint8Array(bytes))

    // Get file dimensions for images
    let width: number | null = null
    let height: number | null = null

    if (file.type.startsWith('image/')) {
      try {
        const sharp = require('sharp')
        const metadata = await sharp(new Uint8Array(bytes)).metadata()
        width = metadata.width || null
        height = metadata.height || null
      } catch (error) {
        console.log('Could not get image dimensions:', error)
      }
    }

    // Create media record
    const media = await prisma.media.create({
      data: {
        url: `/uploads/media/${filename}`,
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        width,
        height,
        postId: postId || null
      }
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}
