'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import ColorPicker from '@/components/ColorPicker'
import FileUpload from '@/components/FileUpload'

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: 'blue',
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    // Open Graph fields
    ogTitle: '',
    ogDescription: '',
    ogType: 'website',
    ogImage: '',
    // Twitter Card fields
    twitterCard: 'summary',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    // Icon and Media fields
    ogImageMediaId: '',
    twitterImageMediaId: '',
    // Parent category
    parentId: ''
  })

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('slug', formData.slug)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('color', formData.color)
      
      // SEO fields
      formDataToSend.append('metaTitle', formData.metaTitle)
      formDataToSend.append('metaDescription', formData.metaDescription)
      formDataToSend.append('metaKeywords', formData.metaKeywords)
      formDataToSend.append('canonicalUrl', formData.canonicalUrl)
      
      // Open Graph fields
      formDataToSend.append('ogTitle', formData.ogTitle)
      formDataToSend.append('ogDescription', formData.ogDescription)
      formDataToSend.append('ogType', formData.ogType)
      formDataToSend.append('ogImage', formData.ogImage)
      
      // Twitter Card fields
      formDataToSend.append('twitterCard', formData.twitterCard)
      formDataToSend.append('twitterTitle', formData.twitterTitle)
      formDataToSend.append('twitterDescription', formData.twitterDescription)
      formDataToSend.append('twitterImage', formData.twitterImage)
      
      // Icon and Media fields
      formDataToSend.append('ogImageMediaId', formData.ogImageMediaId)
      formDataToSend.append('twitterImageMediaId', formData.twitterImageMediaId)
      
      // Parent category
      formDataToSend.append('parentId', formData.parentId)

      // Add files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('files', file)
      })

      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success('Category created successfully')
        window.location.href = '/dashboard/categories'
      } else {
        const error = await response.json()
        toast.error(error.message || 'Something went wrong')
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
            <Link href="/dashboard/categories">
              <Button plain className="p-2">
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Category</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create a new category for organizing your content
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about your category including name, slug, and description
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="slug" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="category-slug"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the category"
                    rows={4}
                  />
                </div>
                <div>
                  <ColorPicker
                    value={formData.color}
                    onChange={(color) => setFormData({ ...formData, color })}
                    label="Category Color"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Media Settings</CardTitle>
                <CardDescription>
                  Upload images and configure icons for your category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Section */}
                <FileUpload
                  files={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                  maxFiles={10}
                  postType="FILE"
                  label="Upload Media Files"
                  description="Drag and drop files here, or click to select files"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (30%) */}
          <div className="space-y-6">
            {/* SEO Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your category for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta Title
                  </label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta Description
                  </label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Brief description for search results"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="metaKeywords" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta Keywords
                  </label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    placeholder="Keywords separated by commas"
                  />
                </div>
                <div>
                  <label htmlFor="canonicalUrl" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Canonical URL
                  </label>
                  <Input
                    id="canonicalUrl"
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    placeholder="https://example.com/category"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Customize how your category appears when shared
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="ogTitle" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Title
                  </label>
                  <Input
                    id="ogTitle"
                    value={formData.ogTitle}
                    onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                    placeholder="Title for social media sharing"
                  />
                </div>
                <div>
                  <label htmlFor="ogDescription" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Description
                  </label>
                  <Textarea
                    id="ogDescription"
                    value={formData.ogDescription}
                    onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="ogType" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Type
                  </label>
                  <Input
                    id="ogType"
                    value={formData.ogType}
                    onChange={(e) => setFormData({ ...formData, ogType: e.target.value })}
                    placeholder="website"
                  />
                </div>
                <div>
                  <label htmlFor="ogImage" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Image URL
                  </label>
                  <Input
                    id="ogImage"
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
                <div>
                  <label htmlFor="twitterTitle" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Title
                  </label>
                  <Input
                    id="twitterTitle"
                    value={formData.twitterTitle}
                    onChange={(e) => setFormData({ ...formData, twitterTitle: e.target.value })}
                    placeholder="Title for Twitter sharing"
                  />
                </div>
                <div>
                  <label htmlFor="twitterDescription" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Description
                  </label>
                  <Textarea
                    id="twitterDescription"
                    value={formData.twitterDescription}
                    onChange={(e) => setFormData({ ...formData, twitterDescription: e.target.value })}
                    placeholder="Description for Twitter sharing"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="twitterImage" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Image URL
                  </label>
                  <Input
                    id="twitterImage"
                    value={formData.twitterImage}
                    onChange={(e) => setFormData({ ...formData, twitterImage: e.target.value })}
                    placeholder="https://example.com/twitter-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Save your category or cancel the operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" color="dark" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Category'}
                </Button>
                <Link href="/dashboard/categories">
                  <Button type="button" color="light" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
