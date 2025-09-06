'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NewTagPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })

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
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Tag created successfully')
        window.location.href = '/dashboard/tags'
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to create tag')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Tag</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create a new tag for categorizing your content
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

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Save your tag or cancel the operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" color="dark" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Tag'}
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
