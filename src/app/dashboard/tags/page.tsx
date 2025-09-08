'use client'

import { Button } from '@/shared/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Tag {
  id: string
  slug: string
  name: string
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
  }
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      }
    } catch (error) {
      toast.error('Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Tag deleted successfully')
        fetchTags()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete tag')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="border-b bg-white px-6 py-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tags</h1>
            <Link href="/dashboard/tags/new" prefetch={false}>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Tag
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tags...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tags</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Organize your content with tags</p>
          </div>
          <Link href="/dashboard/tags/new" prefetch={false}>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Tag
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-6">
        {/* Tags Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tags</CardTitle>
            <CardDescription>{tags.length} tags found</CardDescription>
          </CardHeader>
          <CardContent>
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Slug</TableHeader>
                  <TableHeader>Posts</TableHeader>
                  <TableHeader>Usage</TableHeader>
                  <TableHeader>Created</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{tag.name}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                        /{tag.slug}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {tag._count?.posts || 0} posts
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, ((tag._count?.posts || 0) / Math.max(...tags.map(t => t._count?.posts || 0))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {Math.round(((tag._count?.posts || 0) / Math.max(...tags.map(t => t._count?.posts || 0))) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(tag.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link href={`/dashboard/tags/${tag.id}/edit`} prefetch={false}>
                          <Button
                            plain
                            className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          plain
                          onClick={() => handleDelete(tag.id)}
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

            {tags.length === 0 && (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 text-neutral-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No tags</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Get started by creating a new tag.
                </p>
                <div className="mt-6">
                  <Link href="/dashboard/tags/new" prefetch={false}>
                    <Button className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Add Tag
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
