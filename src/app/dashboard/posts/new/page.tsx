'use client'

import FileUpload from '@/components/FileUpload'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { PostContentEditor } from '@/components/PostContentEditor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Textarea from '@/shared/Textarea'

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState<File[]>([])
  const [optionalMedia, setOptionalMedia] = useState<File[]>([])

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<'IMAGE' | 'AUDIO' | 'VIDEO'>('IMAGE')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'SCHEDULED'>('DRAFT')

  // SEO fields
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [allowIndexing, setAllowIndexing] = useState(true)
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogType, setOgType] = useState('article')
  const [ogImage, setOgImage] = useState('')
  const [twitterTitle, setTwitterTitle] = useState('')
  const [twitterDescription, setTwitterDescription] = useState('')
  const [twitterCardType, setTwitterCardType] = useState('summary')
  const [twitterImage, setTwitterImage] = useState('')

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([fetch('/api/categories'), fetch('/api/tags')])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          setTags(tagsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load categories and tags')
      }
    }

    fetchData()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }, [title])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('slug', slug)
      formData.append('excerpt', excerpt)
      formData.append('content', content)
      formData.append('postType', postType)
      formData.append('categoryId', categoryId)
      formData.append('status', status)
      formData.append('tagIds', JSON.stringify(selectedTags))

      // SEO fields
      formData.append('metaTitle', metaTitle)
      formData.append('metaDescription', metaDescription)
      formData.append('metaKeywords', metaKeywords)
      formData.append('focusKeyword', focusKeyword)
      formData.append('canonicalUrl', canonicalUrl)
      formData.append('allowIndexing', allowIndexing.toString())
      formData.append('ogTitle', ogTitle)
      formData.append('ogDescription', ogDescription)
      formData.append('ogType', ogType)
      formData.append('ogImage', ogImage)
      formData.append('twitterTitle', twitterTitle)
      formData.append('twitterDescription', twitterDescription)
      formData.append('twitterCardType', twitterCardType)
      formData.append('twitterImage', twitterImage)

      // Add featured image (required for all posts)
      if (featuredImage.length > 0) {
        featuredImage.forEach((file) => {
          formData.append('featuredImage', file)
        })
      }

      // Add optional media file (for AUDIO/VIDEO posts)
      if (optionalMedia.length > 0) {
        optionalMedia.forEach((file) => {
          formData.append('optionalMedia', file)
        })
      }


      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create post')
      }

      toast.success('Post created successfully!')
      router.push('/dashboard/posts')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setLoading(false)
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
      default:
        return '📄'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add a new post to your blog with rich content and SEO optimization
            </p>
          </div>
          <Button color="light" onClick={() => router.push('/dashboard/posts')}>
            Cancel
          </Button>
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
                  Essential details about your post including title, excerpt, and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter post title" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <Input 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)} 
                      placeholder="post-url-slug" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Excerpt
                  </label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Post Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>
                  Configure post type, status, category, and tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Post Type
                    </label>
                    <Select value={postType} onValueChange={(value) => setPostType(value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select post type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IMAGE">🖼️ Image</SelectItem>
                        <SelectItem value="AUDIO">🎵 Audio</SelectItem>
                        <SelectItem value="VIDEO">🎬 Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tags
                  </label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !selectedTags.includes(value)) {
                        setSelectedTags((prev) => [...prev, value])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tags to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTags.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId)
                          return tag ? (
                            <div key={tagId} className="flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm">
                              {tag.name}
                              <button
                                type="button"
                                onClick={() => setSelectedTags((prev) => prev.filter((id) => id !== tagId))}
                                className="ml-1 text-xs hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content Card */}
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>
                  Write the main content of your post using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostContentEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (30%) */}
          <div className="space-y-6">
            {/* Featured Image Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image *</CardTitle>
                <CardDescription>All posts must have a featured image</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  files={featuredImage}
                  onFilesChange={setFeaturedImage}
                  postType="IMAGE"
                  maxFiles={1}
                  label="Upload Featured Image"
                  description="Select an image for your post"
                />
              </CardContent>
            </Card>

            {/* Optional Media Upload Card */}
            {(postType === 'AUDIO' || postType === 'VIDEO') && (
              <Card>
                <CardHeader>
                  <CardTitle>Media File</CardTitle>
                  <CardDescription>
                    Upload {postType.toLowerCase()} file for your post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    files={optionalMedia}
                    onFilesChange={setOptionalMedia}
                    postType={postType === 'AUDIO' ? 'AUDIO' : 'VIDEO'}
                    maxFiles={1}
                    label={`Upload ${postType === 'AUDIO' ? 'Audio' : 'Video'} File`}
                    description={`Select a ${postType.toLowerCase()} file`}
                  />
                </CardContent>
              </Card>
            )}

            {/* SEO Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your post for search engines and social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta Title
                  </label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Focus Keyword
                  </label>
                  <Input
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Main keyword for this post"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta Description
                  </label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Brief description for search results (150-160 characters)"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meta Keywords
                  </label>
                  <Input
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="Keywords separated by commas"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Canonical URL
                  </label>
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://example.com/post-url"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowIndexing"
                    checked={allowIndexing}
                    onChange={(e) => setAllowIndexing(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allowIndexing" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow search engines to index this post
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Customize how your post appears when shared on social platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Title
                  </label>
                  <Input
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder="Title for social media sharing"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Type
                  </label>
                  <Select value={ogType} onValueChange={setOgType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OG type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Description
                  </label>
                  <Textarea
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder="Description for social media sharing"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OG Image URL
                  </label>
                  <Input
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Title
                  </label>
                  <Input
                    value={twitterTitle}
                    onChange={(e) => setTwitterTitle(e.target.value)}
                    placeholder="Title for Twitter sharing"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Card Type
                  </label>
                  <Select value={twitterCardType} onValueChange={setTwitterCardType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Twitter card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                      <SelectItem value="app">App</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Description
                  </label>
                  <Textarea
                    value={twitterDescription}
                    onChange={(e) => setTwitterDescription(e.target.value)}
                    placeholder="Description for Twitter sharing"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter Image URL
                  </label>
                  <Input
                    value={twitterImage}
                    onChange={(e) => setTwitterImage(e.target.value)}
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
                  Save your post or cancel the operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" color="dark" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Create Post'}
                </Button>
                <Button 
                  type="button" 
                  color="light" 
                  onClick={() => router.push('/dashboard/posts')} 
                  disabled={loading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
