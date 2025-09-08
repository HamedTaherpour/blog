'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { ArrowLeftIcon, CheckIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import FileUpload from '@/components/FileUpload'

interface Media {
  id: string
  url: string
  filename: string | null
  size: number | null
  mimeType: string | null
  width: number | null
  height: number | null
  durationSec: number | null
  provider: string | null
  createdAt: string
  post: {
    id: string
    title: string
    slug: string
  } | null
}

export default function MediaEditPage() {
  const router = useRouter()
  const params = useParams()
  const mediaId = params.id as string

  const [media, setMedia] = useState<Media | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [replacingFile, setReplacingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    filename: '',
    postId: ''
  })

  const fetchMedia = useCallback(async () => {
    try {
      const response = await fetch(`/api/media/${mediaId}`)
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
        setFormData({
          filename: data.filename || '',
          postId: data.postId || ''
        })
      } else {
        toast.error('Failed to fetch media')
        router.push('/dashboard/media')
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Something went wrong')
      router.push('/dashboard/media')
    } finally {
      setLoading(false)
    }
  }, [mediaId, router])

  useEffect(() => {
    if (mediaId) {
      fetchMedia()
    }
  }, [mediaId, fetchMedia])

  const handleFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]) // Only take the first file for replacement
    } else {
      setSelectedFile(null)
    }
  }

  const handleFileReplacement = async () => {
    if (!selectedFile || !media) return

    setReplacingFile(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        const updatedMedia = await response.json()
        setMedia(updatedMedia)
        setSelectedFile(null)
        toast.success('File replaced successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to replace file')
      }
    } catch (error) {
      console.error('Error replacing file:', error)
      toast.error('Something went wrong')
    } finally {
      setReplacingFile(false)
    }
  }

  const handleSave = async () => {
    if (!media) return

    setSaving(true)
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Media updated successfully')
        router.push('/dashboard/media')
      } else {
        toast.error('Failed to update media')
      }
    } catch (error) {
      console.error('Error updating media:', error)
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileTypeIcon = (mimeType: string | null) => {
    if (!mimeType) return '📄'
    
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.includes('pdf')) return '📄'
    return '📁'
  }

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/media" prefetch={false}>
              <Button plain className="p-2">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Media</h1>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading media...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!media) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/media" prefetch={false}>
              <Button plain className="p-2">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Not Found</h1>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">The requested media file could not be found.</p>
            <Link href="/dashboard/media" prefetch={false}>
              <Button className="mt-4">Back to Media Library</Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Media</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update media file information
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Media Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Media Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                {media.mimeType?.startsWith('image/') ? (
                  <img
                    src={media.url}
                    alt={media.filename || 'Media file'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                      if (nextElement) nextElement.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="text-6xl" style={{ display: media.mimeType?.startsWith('image/') ? 'none' : 'flex' }}>
                  {getFileTypeIcon(media.mimeType)}
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Type:</span>
                  <span className="text-neutral-900 dark:text-neutral-100">{media.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Size:</span>
                  <span className="text-neutral-900 dark:text-neutral-100">{formatFileSize(media.size)}</span>
                </div>
                {media.width && media.height && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500 dark:text-neutral-400">Dimensions:</span>
                    <span className="text-neutral-900 dark:text-neutral-100">{media.width}×{media.height}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Created:</span>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* File Replacement Section */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                  Replace File
                </h4>
                <FileUpload
                  files={selectedFile ? [selectedFile] : []}
                  onFilesChange={handleFilesChange}
                  postType="FILE"
                  maxFiles={1}
                  label="Select New File"
                  description="Choose a file to replace the current one"
                  className="w-full"
                />
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {formatFileSize(selectedFile.size)} • {selectedFile.type}
                        </p>
                      </div>
                      <Button
                        onClick={handleFileReplacement}
                        disabled={replacingFile}
                        className="flex items-center gap-2"
                      >
                        <CloudArrowUpIcon className="h-4 w-4" />
                        {replacingFile ? 'Replacing...' : 'Replace File'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Media Information</CardTitle>
              <CardDescription>
                Update the media file details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Filename
                </label>
                <Input
                  value={formData.filename}
                  onChange={(e) => setFormData(prev => ({ ...prev, filename: e.target.value }))}
                  placeholder="Enter filename"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Associated Post ID (Optional)
                </label>
                <Input
                  value={formData.postId}
                  onChange={(e) => setFormData(prev => ({ ...prev, postId: e.target.value }))}
                  placeholder="Enter post ID"
                />
                {media.post && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Currently associated with: <strong>{media.post.title}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Media URL
                </label>
                <Input
                  value={media.url}
                  disabled
                  className="bg-neutral-50 dark:bg-neutral-800"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  This is the public URL of your media file
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex gap-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button plain onClick={() => router.push('/dashboard/media')}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
