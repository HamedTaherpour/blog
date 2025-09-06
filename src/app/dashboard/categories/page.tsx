'use client'

import { Button } from '@/shared/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  orange: '#F97316',
  teal: '#14B8A6',
  cyan: '#06B6D4',
  lime: '#84CC16',
  emerald: '#059669',
  rose: '#F43F5E',
  violet: '#8B5CF6',
  sky: '#0EA5E9',
  gray: '#6B7280',
}

function getColorHex(colorName: string | null): string {
  return colorMap[colorName || 'blue'] || colorMap.blue
}

interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  image: string | null
  color: string | null
  createdAt: string
  updatedAt: string
  // SEO fields
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  canonicalUrl: string | null
  // Open Graph fields
  ogTitle: string | null
  ogDescription: string | null
  ogType: string | null
  ogImage: string | null
  // Twitter Card fields
  twitterCard: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  // Icon and Media fields
  iconType: string | null
  iconMediaId: string | null
  coverMediaId: string | null
  ogImageMediaId: string | null
  twitterImageMediaId: string | null
  // Parent category
  parentId: string | null
  _count?: {
    posts: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('data', data)

        setCategories(data)
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        toast.error('Failed to delete category')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900">
        <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <Link href="/dashboard/categories/new" prefetch={false}>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading categories...</p>
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize your content with categories
            </p>
          </div>
          <Link href="/dashboard/categories/new" prefetch={false}>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-6">
        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              {categories.length} categories found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {category.name}
                          </div>
                          {category.description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-xs truncate">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {category.image ? (
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={category.image}
                              alt={category.name}
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder-image.png'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                        /{category.slug}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: getColorHex(category.color) }}
                          />
                          <span className="capitalize">{category.color || 'blue'}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {category._count?.posts || 0} posts
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/categories/${category.id}/edit`} prefetch={false}>
                            <Button plain className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            plain 
                            onClick={() => handleDelete(category.id)} 
                            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-neutral-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No categories</h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Get started by creating a new category.
                </p>
                <div className="mt-6">
                  <Link href="/dashboard/categories/new" prefetch={false}>
                    <Button className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Add Category
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
