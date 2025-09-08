'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PermissionButton, ShowIfCanAccess } from '@/components/PermissionGuard'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  postType: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FILE'
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  createdAt: string
  author: {
    id: string
    name: string | null
    username: string
    image: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  } | null
  tags: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
  media: Array<{
    id: string
    url: string
    type: string
  }>
  _count: {
    views: number
  }
}

interface PostsResponse {
  posts: Post[]
  total: number
  hasMore: boolean
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [postTypeFilter, setPostTypeFilter] = useState('all')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async (reset = false) => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
      if (postTypeFilter && postTypeFilter !== 'all') params.append('postType', postTypeFilter)
      params.append('limit', '20')
      params.append('offset', reset ? '0' : offset.toString())

      const response = await fetch(`/api/posts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch posts')

      const data: PostsResponse = await response.json()

      if (reset) {
        setPosts(data.posts)
        setOffset(20)
      } else {
        setPosts((prev) => [...prev, ...data.posts])
        setOffset((prev) => prev + 20)
      }

      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(true)
  }, [searchTerm, statusFilter, postTypeFilter])

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      toast.success('Post deleted successfully')
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return '🖼️'
      case 'AUDIO':
        return '🎵'
      case 'VIDEO':
        return '🎬'
      case 'FILE':
        return '📄'
      default:
        return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="border-b bg-white px-6 py-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
            <ShowIfCanAccess resource="posts" action="create">
              <Link href="/dashboard/posts/new">
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add New Post
                </Button>
              </Link>
            </ShowIfCanAccess>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your blog posts and content</p>
          </div>
          <ShowIfCanAccess resource="posts" action="create">
            <Link href="/dashboard/posts/new">
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Add New Post
              </Button>
            </Link>
          </ShowIfCanAccess>
        </div>
      </div>

      <div className="py-6">
        {/* Filters Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={postTypeFilter} onValueChange={setPostTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IMAGE">🖼️ Image</SelectItem>
                  <SelectItem value="AUDIO">🎵 Audio</SelectItem>
                  <SelectItem value="VIDEO">🎬 Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>{posts.length} posts found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeader>Post</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Author</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Views</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className='max-w-80 truncate'>
                        <div className="font-medium truncate text-neutral-900 dark:text-neutral-100" title={post.title}>{post.title}</div>
                        <div className="text-sm truncate text-neutral-500 dark:text-neutral-400" title={post.slug}>/{post.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{getPostTypeIcon(post.postType)}</span>
                        <span className="text-sm">{post.postType}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.author.image && (
                          <img
                            src={post.author.image}
                            alt={post.author.name || post.author.username}
                            className="h-6 w-6 rounded-full"
                          />
                        )}
                        <span className="text-sm">{post.author.name || post.author.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {post._count.views}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <PermissionButton resource="posts" action="update">
                          <Link href={`/dashboard/posts/${post.id}/edit`}>
                            <Button
                              plain
                              className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </PermissionButton>
                        <PermissionButton resource="posts" action="delete">
                          <Button
                            plain
                            onClick={() => handleDelete(post.id)}
                            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </PermissionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {posts.length === 0 && !loading && (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 text-neutral-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No posts found</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Get started by creating your first post.
                </p>
                <div className="mt-6">
                  <ShowIfCanAccess resource="posts" action="create">
                    <Link href="/dashboard/posts/new">
                      <Button className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        Create your first post
                      </Button>
                    </Link>
                  </ShowIfCanAccess>
                </div>
              </div>
            )}

            {hasMore && posts.length > 0 && (
              <div className="mt-6 text-center">
                <Button color="light" onClick={() => fetchPosts()} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
