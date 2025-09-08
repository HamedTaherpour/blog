import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { processSEOFields } from '@/lib/seo-utils'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { triggerSitemapRegeneration, shouldRegenerateSitemap } from '@/lib/sitemap-utils'


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Check if user has permission to read posts
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const hasPermission = canAccess(session.user.role as UserRole, 'posts', 'read')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to read posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        media: true,
      },
    })

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    // For AUTHOR role, only allow access to their own posts
    if (session.user.role === 'AUTHOR' && post.authorId !== session.user.id) {
      return NextResponse.json({ 
        message: 'You can only access your own posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to update posts
    const hasPermission = canAccess(session.user.role as UserRole, 'posts', 'update')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to update posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    const formData = await request.formData()

    // Basic post data
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const postType = formData.get('postType') as string
    const categoryId = formData.get('categoryId') as string
    const status = formData.get('status') as string
    const tagIds = formData.get('tagIds') as string

    // SEO fields
    const metaTitle = formData.get('metaTitle') as string
    const metaDescription = formData.get('metaDescription') as string
    const metaKeywords = formData.get('metaKeywords') as string
    const focusKeyword = formData.get('focusKeyword') as string
    const canonicalUrl = formData.get('canonicalUrl') as string
    const allowIndexing = formData.get('allowIndexing') === 'true'
    const ogTitle = formData.get('ogTitle') as string
    const ogDescription = formData.get('ogDescription') as string
    const ogType = formData.get('ogType') as string
    const ogImage = formData.get('ogImage') as string
    const twitterTitle = formData.get('twitterTitle') as string
    const twitterDescription = formData.get('twitterDescription') as string
    const twitterCardType = formData.get('twitterCardType') as string
    const twitterImage = formData.get('twitterImage') as string

    // Validate required fields
    if (!title || !slug || !postType) {
      return NextResponse.json({ message: 'Title, slug, and post type are required' }, { status: 400 })
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!existingPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    // For AUTHOR role, only allow editing their own posts
    if (session.user.role === 'AUTHOR' && existingPost.authorId !== session.user.id) {
      return NextResponse.json({ 
        message: 'You can only edit your own posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    // Check if slug already exists (excluding current post)
    const slugExists = await prisma.post.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    })

    if (slugExists) {
      return NextResponse.json({ message: 'Post with this slug already exists' }, { status: 400 })
    }

    // Handle file uploads
    const uploadedMedia: any[] = []
    
    // Handle featured image (required for all posts)
    const featuredImageFile = formData.get('featuredImage') as File
    if (featuredImageFile && featuredImageFile.size > 0) {
      const timestamp = Date.now()
      const fileName = featuredImageFile.name
      const extension = fileName.split('.').pop()
      const uniqueFileName = `${timestamp}-${fileName}`

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file to disk
      const bytes = await featuredImageFile.arrayBuffer()
      const buffer = new Uint8Array(bytes)
      const filePath = join(uploadsDir, uniqueFileName)
      await writeFile(filePath, buffer)

      // Save to database
      const media = await prisma.media.create({
        data: {
          url: `/uploads/${uniqueFileName}`,
          filename: fileName,
          size: featuredImageFile.size,
          mimeType: featuredImageFile.type,
          postId: id,
        },
      })
      uploadedMedia.push(media)
    }

    // Handle optional media file (for AUDIO/VIDEO posts)
    const optionalMediaFile = formData.get('optionalMedia') as File
    if (optionalMediaFile && optionalMediaFile.size > 0) {
      const timestamp = Date.now()
      const fileName = optionalMediaFile.name
      const extension = fileName.split('.').pop()
      const uniqueFileName = `${timestamp}-${fileName}`

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file to disk
      const bytes = await optionalMediaFile.arrayBuffer()
      const buffer = new Uint8Array(bytes)
      const filePath = join(uploadsDir, uniqueFileName)
      await writeFile(filePath, buffer)

      // Save to database
      const media = await prisma.media.create({
        data: {
          url: `/uploads/${uniqueFileName}`,
          filename: fileName,
          size: optionalMediaFile.size,
          mimeType: optionalMediaFile.type,
          postId: id,
        },
      })
      uploadedMedia.push(media)
    }

    // Parse tag IDs
    const tagIdArray = tagIds ? JSON.parse(tagIds) : []

    // Get existing media for validation
    const existingMedia = await prisma.media.findMany({
      where: { postId: id }
    })

    // Combine existing and new media for validation
    const allMedia = [...existingMedia, ...uploadedMedia]

    // Validate that post has featured image (required for all posts)
    // Check if we have a new featured image or if existing media has an image
    const hasFeaturedImage = featuredImageFile && featuredImageFile.size > 0
    const hasExistingImage = existingMedia.some(media => media.mimeType?.startsWith('image/'))
    
    if (!hasFeaturedImage && !hasExistingImage) {
      return NextResponse.json(
        { message: 'Post must have a featured image' },
        { status: 400 }
      )
    }

    // Validate that featured image is actually an image (if provided)
    if (featuredImageFile && featuredImageFile.size > 0 && !featuredImageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Featured image must be an image file' },
        { status: 400 }
      )
    }

    // Get featured image URL for SEO processing
    const featuredImageUrl = uploadedMedia.length > 0 
      ? uploadedMedia[0].url 
      : existingMedia.find(media => media.mimeType?.startsWith('image/'))?.url || null

    // Process SEO fields with auto-population and validation
    const { processedFields: seoFields, validationResult } = processSEOFields(
      {
        title,
        excerpt: excerpt || null,
        content: content || '',
        featuredImageUrl
      },
      {
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        focusKeyword: focusKeyword || null,
        canonicalUrl: canonicalUrl || null,
        allowIndexing,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogType: ogType || null,
        ogImage: ogImage || null,
        twitterTitle: twitterTitle || null,
        twitterDescription: twitterDescription || null,
        twitterCardType: twitterCardType || null,
        twitterImage: twitterImage || null,
      },
      featuredImageUrl
    )

    // Return SEO validation errors if any
    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          message: 'SEO validation failed', 
          errors: validationResult.errors 
        },
        { status: 400 }
      )
    }

    // Validate post type specific requirements
    if (postType === 'AUDIO') {
      // Check if we have a new audio file or if existing media has audio
      const hasNewAudio = optionalMediaFile && optionalMediaFile.size > 0
      const hasExistingAudio = existingMedia.some(media => media.mimeType?.startsWith('audio/'))
      
      if (!hasNewAudio && !hasExistingAudio) {
        return NextResponse.json(
          { message: 'Audio posts must have an audio file' },
          { status: 400 }
        )
      }
      
      // Validate that audio file is actually audio (if provided)
      if (optionalMediaFile && optionalMediaFile.size > 0 && !optionalMediaFile.type.startsWith('audio/')) {
        return NextResponse.json(
          { message: 'Audio file must be an audio file' },
          { status: 400 }
        )
      }
    }

    if (postType === 'VIDEO') {
      // Check if we have a new video file or if existing media has video
      const hasNewVideo = optionalMediaFile && optionalMediaFile.size > 0
      const hasExistingVideo = existingMedia.some(media => media.mimeType?.startsWith('video/'))
      
      if (!hasNewVideo && !hasExistingVideo) {
        return NextResponse.json(
          { message: 'Video posts must have a video file' },
          { status: 400 }
        )
      }
      
      // Validate that video file is actually video (if provided)
      if (optionalMediaFile && optionalMediaFile.size > 0 && !optionalMediaFile.type.startsWith('video/')) {
        return NextResponse.json(
          { message: 'Video file must be a video file' },
          { status: 400 }
        )
      }
    }

    // Update the post
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || '',
        postType: postType as any,
        status: status as any,
        categoryId: categoryId && categoryId.trim() !== '' ? categoryId : null,
        // SEO fields (processed with auto-population)
        metaTitle: seoFields.metaTitle,
        metaDescription: seoFields.metaDescription,
        metaKeywords: seoFields.metaKeywords,
        focusKeyword: seoFields.focusKeyword,
        canonicalUrl: seoFields.canonicalUrl,
        allowIndexing: seoFields.allowIndexing,
        ogTitle: seoFields.ogTitle,
        ogDescription: seoFields.ogDescription,
        ogType: seoFields.ogType,
        ogImage: seoFields.ogImage,
        twitterTitle: seoFields.twitterTitle,
        twitterDescription: seoFields.twitterDescription,
        twitterCardType: seoFields.twitterCardType,
        twitterImage: seoFields.twitterImage,
        // Connect new uploaded media
        media: {
          connect: uploadedMedia.map((media) => ({ id: media.id })),
        },
        // Update tags
        tags: {
          deleteMany: {},
          create: tagIdArray.map((tagId: string) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        media: true,
      },
    })

    // Trigger sitemap regeneration if needed
    if (shouldRegenerateSitemap(existingPost.status, post.status)) {
      await triggerSitemapRegeneration()
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to delete posts
    const hasPermission = canAccess(session.user.role as UserRole, 'posts', 'delete')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to delete posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
      include: { 
        author: true,
        media: true
      },
    })

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    // For AUTHOR role, only allow deleting their own posts
    if (session.user.role === 'AUTHOR' && post.authorId !== session.user.id) {
      return NextResponse.json({ 
        message: 'You can only delete your own posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    // Delete associated files from disk
    for (const media of post.media) {
      try {
        const filePath = join(process.cwd(), 'public', media.url)
        await unlink(filePath)
      } catch (error) {
        console.warn(`Failed to delete file ${media.url}:`, error)
        // Continue even if file deletion fails
      }
    }

    // Delete the post (this will cascade delete related records)
    await prisma.post.delete({
      where: { id },
    })

    // Trigger sitemap regeneration if the deleted post was published
    if (post.status === 'PUBLISHED') {
      await triggerSitemapRegeneration()
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 })
  }
}
