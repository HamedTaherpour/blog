import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const postId = formData.get('postId') as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Validate file type
      const fileType = file.type
      const fileName = file.name
      const fileSize = file.size

      // Check file size (max 10MB)
      if (fileSize > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${fileName} is too large. Maximum size is 10MB` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = fileName.split('.').pop()
      const uniqueFileName = `${timestamp}-${fileName}`

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file to disk
      const bytes = await file.arrayBuffer()
      const filePath = join(uploadsDir, uniqueFileName)
      await writeFile(filePath, new Uint8Array(bytes))

      // Save to database
      const media = await prisma.media.create({
        data: {
          url: `/uploads/${uniqueFileName}`,
          filename: fileName,
          size: fileSize,
          mimeType: fileType,
          postId: postId || null,
        },
      })

      uploadedFiles.push(media)
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
