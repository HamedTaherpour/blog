import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { processSEOFields } from '@/lib/seo-utils'
import { canAccess } from '@/lib/api-middleware'
import { UserRole } from '@/lib/permissions'
import { triggerSitemapRegeneration } from '@/lib/sitemap-utils'
import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const postType = searchParams.get('postType')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (postType) {
      where.postType = postType
    }

    // For AUTHOR role, only show their own posts
    if (session.user.role === 'AUTHOR') {
      where.authorId = session.user.id
    }

    const posts = await prisma.post.findMany({
      where,
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
        _count: {
          select: {
            views: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.post.count({ where })

    return NextResponse.json({
      posts,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to create posts
    const hasPermission = canAccess(session.user.role as UserRole, 'posts', 'create')
    if (!hasPermission) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to create posts',
        userRole: session.user.role 
      }, { status: 403 })
    }

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
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

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
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
          postId: null, // Will be updated after post creation
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
          postId: null, // Will be updated after post creation
        },
      })
      uploadedMedia.push(media)
    }

    // Parse tag IDs
    const tagIdArray = tagIds ? JSON.parse(tagIds) : []

    // Validate that post has featured image (required for all posts)
    if (!featuredImageFile || featuredImageFile.size === 0) {
      return NextResponse.json({ message: 'Post must have a featured image' }, { status: 400 })
    }

    // Validate that featured image is actually an image
    if (!featuredImageFile.type.startsWith('image/')) {
      return NextResponse.json({ message: 'Featured image must be an image file' }, { status: 400 })
    }

    // Get featured image URL for SEO processing
    const featuredImageUrl = uploadedMedia.length > 0 ? uploadedMedia[0].url : null

    // Process SEO fields with auto-population and validation
    const { processedFields: seoFields, validationResult } = processSEOFields(
      {
        title,
        excerpt: excerpt || null,
        content: content || '',
        featuredImageUrl,
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
          errors: validationResult.errors,
        },
        { status: 400 }
      )
    }

    // Validate post type specific requirements
    if (postType === 'AUDIO') {
      if (!optionalMediaFile || optionalMediaFile.size === 0) {
        return NextResponse.json({ message: 'Audio posts must have an audio file' }, { status: 400 })
      }
      if (!optionalMediaFile.type.startsWith('audio/')) {
        return NextResponse.json({ message: 'Audio file must be an audio file' }, { status: 400 })
      }
    }

    if (postType === 'VIDEO') {
      if (!optionalMediaFile || optionalMediaFile.size === 0) {
        return NextResponse.json({ message: 'Video posts must have a video file' }, { status: 400 })
      }
      if (!optionalMediaFile.type.startsWith('video/')) {
        return NextResponse.json({ message: 'Video file must be a video file' }, { status: 400 })
      }
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || '',
        postType: postType as any,
        status: (status as any) || 'DRAFT',
        categoryId: categoryId && categoryId.trim() !== '' ? categoryId : null,
        authorId: session.user.id,
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
        // Connect uploaded media
        media: {
          connect: uploadedMedia.map((media) => ({ id: media.id })),
        },
        // Connect tags
        tags: {
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

    // Trigger sitemap regeneration for published posts
    if (post.status === 'PUBLISHED') {
      await triggerSitemapRegeneration()
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 })
  }
}
