import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { processCategorySEOFields } from '@/lib/category-seo-utils'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Basic category data
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const color = formData.get('color') as string
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

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    // Handle file uploads
    const uploadedMedia: any[] = []
    const files = formData.getAll('files') as File[]
    
    for (const file of files) {
      if (file.size > 0) {
        // Generate unique filename
        const timestamp = Date.now()
        const fileName = file.name
        const extension = fileName.split('.').pop()
        const uniqueFileName = `${timestamp}-${fileName}`

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir, { recursive: true })
        }

        // Save file to disk
        const bytes = await file.arrayBuffer()
        const buffer = new Uint8Array(bytes)
        const filePath = join(uploadsDir, uniqueFileName)
        await writeFile(filePath, buffer)

        // Save to database
        const media = await prisma.media.create({
          data: {
            url: `/uploads/${uniqueFileName}`,
            filename: fileName,
            size: file.size,
            mimeType: file.type,
            postId: null, // Categories don't have posts initially
          },
        })
        uploadedMedia.push(media)
      }
    }

    // Get the first uploaded image as the category image
    const categoryImage = uploadedMedia.find(m => m.mimeType?.startsWith('image/'))?.url || null

    // Process SEO fields with auto-population and validation
    const { processedFields: seoFields, validationResult } = processCategorySEOFields(
      {
        name,
        description: description || null,
        image: categoryImage
      },
      {
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogType: ogType || null,
        ogImage: ogImage || null,
        twitterCard: twitterCard || null,
        twitterTitle: twitterTitle || null,
        twitterDescription: twitterDescription || null,
        twitterImage: twitterImage || null,
      },
      categoryImage
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

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: categoryImage,
        color: color || 'blue',
        // SEO fields (processed with auto-population)
        metaTitle: seoFields.metaTitle,
        metaDescription: seoFields.metaDescription,
        metaKeywords: seoFields.metaKeywords,
        canonicalUrl: seoFields.canonicalUrl,
        // Open Graph fields
        ogTitle: seoFields.ogTitle,
        ogDescription: seoFields.ogDescription,
        ogType: seoFields.ogType,
        ogImage: seoFields.ogImage,
        // Twitter Card fields
        twitterCard: seoFields.twitterCard,
        twitterTitle: seoFields.twitterTitle,
        twitterDescription: seoFields.twitterDescription,
        twitterImage: seoFields.twitterImage,
        // Icon and Media fields
        ogImageMediaId: ogImageMediaId || null,
        twitterImageMediaId: twitterImageMediaId || null,
        // Parent category
        parentId: parentId || null
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    )
  }
}
