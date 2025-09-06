'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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

export default function EditTagPage() {
  const router = useRouter()
  const params = useParams()
  const tagId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [tag, setTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/tags/${tagId}`)
        if (response.ok) {
          const tagData = await response.json()
          setTag(tagData)
          setFormData({
            name: tagData.name,
            slug: tagData.slug
          })
        } else {
          toast.error('Tag not found')
          router.push('/dashboard/tags')
        }
      } catch (error) {
        toast.error('Failed to fetch tag')
        router.push('/dashboard/tags')
      } finally {
        setFetching(false)
      }
    }

    if (tagId) {
      fetchTag()
    }
  }, [tagId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Tag updated successfully')
        window.location.href = '/dashboard/tags'
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update tag')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tag...</p>
        </div>
      </div>
    )
  }

  if (!tag) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/tags">
              <Button plain className="p-2">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Tag</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update your tag information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about your tag including name and slug
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter tag name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="tag-slug"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning Card for tags in use */}
            {tag._count && tag._count.posts > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Warning</CardTitle>
                  <CardDescription>
                    This tag is currently being used in posts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Tag in use
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            This tag is currently used in {tag._count.posts} post{tag._count.posts === 1 ? '' : 's'}.
                            Changing the slug may affect existing links.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Save your changes or cancel the operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" color="dark" disabled={loading} className="w-full">
                  {loading ? 'Updating...' : 'Update Tag'}
                </Button>
                <Link href="/dashboard/tags">
                  <Button type="button" color="light" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
