'use client'

import { Button } from '@/shared/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import FileUpload from '@/components/FileUpload'

interface UploadedFile {
  file: File
  preview: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

export default function MediaUploadPage() {
  const router = useRouter()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files)
    
    // Convert to UploadedFile format and start upload
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadedFiles(newFiles)
    uploadFiles(newFiles)
  }

  const uploadFiles = async (filesToUpload: UploadedFile[]) => {
    setIsUploading(true)

    for (let i = 0; i < filesToUpload.length; i++) {
      const fileData = filesToUpload[i]
      
      try {
        const formData = new FormData()
        formData.append('file', fileData.file)

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          setUploadedFiles(prev => prev.map(f => 
            f.file === fileData.file 
              ? { ...f, progress: 100, status: 'success' as const }
              : f
          ))
        } else {
          const error = await response.json()
          setUploadedFiles(prev => prev.map(f => 
            f.file === fileData.file 
              ? { ...f, status: 'error' as const, error: error.error || 'Upload failed' }
              : f
          ))
        }
      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.file === fileData.file 
            ? { ...f, status: 'error' as const, error: 'Network error' }
            : f
        ))
      }
    }

    setIsUploading(false)
    toast.success('Upload completed')
  }

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.file !== fileToRemove)
      // Revoke object URL to prevent memory leaks
      const fileData = prev.find(f => f.file === fileToRemove)
      if (fileData?.preview) {
        URL.revokeObjectURL(fileData.preview)
      }
      return updated
    })
    
    setSelectedFiles(prev => prev.filter(f => f !== fileToRemove))
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.includes('pdf')) return '📄'
    return '📁'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/media" prefetch={false}>
              <Button plain className="p-2">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Media</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Upload images, videos, audio files, and documents
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop files here or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                files={selectedFiles}
                onFilesChange={handleFilesChange}
                postType="FILE"
                maxFiles={10}
                label="Upload Media Files"
                description="Select multiple media files to upload"
                className="w-full"
              />
              
              <div className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
                <p>Supported formats: Images (JPEG, PNG, GIF, WebP), Videos (MP4, WebM), Audio (MP3, WAV, OGG), Documents (PDF, TXT)</p>
                <p>Maximum file size: 10MB per file</p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {uploadedFiles.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upload Progress</CardTitle>
                <CardDescription>
                  {uploadedFiles.filter(f => f.status === 'success').length} of {uploadedFiles.length} files uploaded successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((fileData, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      {/* File Preview */}
                      <div className="flex-shrink-0">
                        {fileData.preview ? (
                          <img
                            src={fileData.preview}
                            alt={fileData.file.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-xl">
                            {getFileTypeIcon(fileData.file.type)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {fileData.file.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatFileSize(fileData.file.size)}
                        </p>
                        
                        {/* Progress Bar */}
                        {fileData.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${fileData.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Status */}
                        {fileData.status === 'success' && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            ✓ Uploaded successfully
                          </p>
                        )}
                        {fileData.status === 'error' && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            ✗ {fileData.error}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <Button
                        plain
                        onClick={() => removeFile(fileData.file)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={() => router.push('/dashboard/media')}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Done'}
                  </Button>
                  <Button
                    plain
                    onClick={() => {
                      setUploadedFiles([])
                      setSelectedFiles([])
                    }}
                    disabled={isUploading}
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
