'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import { PencilIcon, PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'

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

interface MediaResponse {
  media: Media[]
  total: number
  hasMore: boolean
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [mimeTypeFilter, setMimeTypeFilter] = useState('all')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchMedia = useCallback(async (reset = false) => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (mimeTypeFilter && mimeTypeFilter !== 'all') params.append('mimeType', mimeTypeFilter)
      params.append('limit', '20')
      params.append('offset', reset ? '0' : offset.toString())

      const response = await fetch(`/api/media?${params}`)
      if (!response.ok) throw new Error('Failed to fetch media')

      const data: MediaResponse = await response.json()

      if (reset) {
        setMedia(data.media)
        setOffset(20)
      } else {
        setMedia((prev) => [...prev, ...data.media])
        setOffset((prev) => prev + 20)
      }

      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Failed to fetch media')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, mimeTypeFilter, offset])

  useEffect(() => {
    fetchMedia(true)
  }, [fetchMedia])

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return

    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Media deleted successfully')
        fetchMedia(true)
      } else {
        toast.error('Failed to delete media')
      }
    } catch (error) {
      toast.error('Something went wrong')
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

  const getFileTypeLabel = (mimeType: string | null) => {
    if (!mimeType) return 'Unknown'
    
    if (mimeType.startsWith('image/')) return 'Image'
    if (mimeType.startsWith('video/')) return 'Video'
    if (mimeType.startsWith('audio/')) return 'Audio'
    if (mimeType.includes('pdf')) return 'PDF'
    return 'File'
  }

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
            <Link href="/dashboard/media/upload" prefetch={false}>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Upload Media
              </Button>
            </Link>
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

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your media files
            </p>
          </div>
          <Link href="/dashboard/media/upload" prefetch={false}>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Upload Media
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-48">
                <Select value={mimeTypeFilter} onValueChange={setMimeTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="application">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Media Files</CardTitle>
            <CardDescription>
              {media.length} files found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {media.length > 0 ? (
              <Table striped>
                <TableHead>
                  <TableRow>
                    <TableHeader>Preview</TableHeader>
                    <TableHeader>File</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Size</TableHeader>
                    <TableHeader>Dimensions</TableHeader>
                    <TableHeader>Post</TableHeader>
                    <TableHeader>Created</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {media.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.mimeType?.startsWith('image/') ? (
                            <img
                              src={item.url}
                              alt={item.filename || 'Media file'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                                if (nextElement) nextElement.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className="text-2xl" style={{ display: item.mimeType?.startsWith('image/') ? 'none' : 'flex' }}>
                            {getFileTypeIcon(item.mimeType)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate" title={item.filename || 'Untitled'}>
                            {item.filename || 'Untitled'}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate" title={item.url}>
                            {item.url.split('/').pop()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getFileTypeIcon(item.mimeType)}</span>
                          <span className="text-sm">{getFileTypeLabel(item.mimeType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatFileSize(item.size)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.width && item.height ? (
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {item.width}×{item.height}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400 dark:text-neutral-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.post ? (
                          <div className="max-w-32">
                            <Link 
                              href={`/posts/${item.post.slug}`}
                              className="text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 truncate block"
                              title={item.post.title}
                            >
                              {item.post.title}
                            </Link>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              /{item.post.slug}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-400 dark:text-neutral-500">Unused</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            plain
                            onClick={() => window.open(item.url, '_blank')}
                            className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                            title="View file"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Link href={`/dashboard/media/${item.id}/edit`} prefetch={false}>
                            <Button plain className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            plain
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-neutral-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No media files</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Get started by uploading your first media file.
                </p>
                <div className="mt-6">
                  <Link href="/dashboard/media/upload" prefetch={false}>
                    <Button className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Upload Media
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && media.length > 0 && (
              <div className="mt-6 text-center">
                <Button onClick={() => fetchMedia(false)}>
                  Load More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
