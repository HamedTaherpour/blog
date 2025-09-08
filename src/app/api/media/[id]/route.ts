import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to update media
    const hasPermission = canAccess(session.user.role as UserRole, 'media', 'update')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to update media',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const { id } = await params
    const contentType = request.headers.get('content-type')

    // Handle file replacement
    if (contentType?.includes('multipart/form-data')) {
      return handleFileReplacement(request, id)
    }

    // Handle regular metadata update
    const body = await request.json()

    const media = await prisma.media.findUnique({
      where: { id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        filename: body.filename || media.filename,
        postId: body.postId !== undefined ? body.postId : media.postId
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(updatedMedia)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

async function handleFileReplacement(request: NextRequest, mediaId: string) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

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

    // Get existing media record
    const existingMedia = await prisma.media.findUnique({
      where: { id: mediaId }
    })

    if (!existingMedia) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete old file from filesystem
    try {
      const oldFilepath = join(process.cwd(), 'public', existingMedia.url)
      await unlink(oldFilepath)
    } catch (error) {
      console.log('Could not delete old file:', error)
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'media')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Generate new filename with same name as original
    const fileExtension = file.name.split('.').pop()
    const originalFilename = existingMedia.filename || 'file'
    const baseName = originalFilename.replace(/\.[^/.]+$/, '') // Remove extension
    const newFilename = `${baseName}.${fileExtension}`
    const filepath = join(uploadDir, newFilename)

    // Save new file
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

    // Update media record with new file info
    const updatedMedia = await prisma.media.update({
      where: { id: mediaId },
      data: {
        url: `/uploads/media/${newFilename}`,
        filename: originalFilename, // Keep original filename
        size: file.size,
        mimeType: file.type,
        width,
        height
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(updatedMedia)
  } catch (error) {
    console.error('Error replacing file:', error)
    return NextResponse.json(
      { error: 'Failed to replace file' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to delete media
    const hasPermission = canAccess(session.user.role as UserRole, 'media', 'delete')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to delete media',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete the file from filesystem
    try {
      const filepath = join(process.cwd(), 'public', media.url)
      await unlink(filepath)
    } catch (error) {
      console.log('Could not delete file from filesystem:', error)
    }

    // Delete from database
    await prisma.media.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
