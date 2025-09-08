'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/shared/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { Switch, SwitchField } from '@/shared/switch'
import * as Headless from '@headlessui/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface SiteSettings {
  id: number
  siteName: string
  siteDesc?: string | null
  logoUrl?: string | null
  siteAuthor?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  focusKeyword?: string | null
  canonicalUrl?: string | null
  allowIndexing: boolean
  ogTitle?: string | null
  ogDescription?: string | null
  ogType: string
  ogImage?: string | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterCardType: string
  twitterImage?: string | null
  // Contact fields (optional in older schemas)
  contactAddress?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
}

export default function MetaTagsTab() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    siteName: '',
    siteDesc: '',
    logoUrl: '',
    siteAuthor: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    focusKeyword: '',
    canonicalUrl: '',
    allowIndexing: true,
    ogTitle: '',
    ogDescription: '',
    ogType: 'website',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterCardType: 'summary',
    twitterImage: '',
    // Contact fields
    contactAddress: '',
    contactEmail: '',
    contactPhone: '',
  })

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      
      const data = await response.json()
      setSettings(data)
      
      // Update form data with fetched settings
      setFormData({
        siteName: data.siteName || '',
        siteDesc: data.siteDesc || '',
        logoUrl: data.logoUrl || '',
        siteAuthor: data.siteAuthor || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
        focusKeyword: data.focusKeyword || '',
        canonicalUrl: data.canonicalUrl || '',
        allowIndexing: data.allowIndexing ?? true,
        ogTitle: data.ogTitle || '',
        ogDescription: data.ogDescription || '',
        ogType: data.ogType || 'website',
        ogImage: data.ogImage || '',
        twitterTitle: data.twitterTitle || '',
        twitterDescription: data.twitterDescription || '',
        twitterCardType: data.twitterCardType || 'summary',
        twitterImage: data.twitterImage || '',
        contactAddress: data.contactAddress || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Meta Tags</CardTitle>
        <CardDescription>
          Configure your site&apos;s meta tags for better SEO and social media sharing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Site Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Site Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="site-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Title
              </label>
              <Input
                id="site-title"
                placeholder="Your Site Title"
                value={formData.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Description
              </label>
              <Input
                id="site-description"
                placeholder="Brief description of your site"
                value={formData.siteDesc}
                onChange={(e) => handleInputChange('siteDesc', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="site-logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Site Logo URL
            </label>
            <Input
              id="site-logo"
              placeholder="/logo.png"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
            />
            {formData.logoUrl && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Logo Preview:</p>
                <img
                  src={formData.logoUrl}
                  alt="Site Logo"
                  className="h-16 w-auto object-contain border border-gray-200 dark:border-gray-700 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="site-author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Site Author
            </label>
            <Input
              id="site-author"
              placeholder="Site Author"
              value={formData.siteAuthor}
              onChange={(e) => handleInputChange('siteAuthor', e.target.value)}
            />
          </div>
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="contact-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Address
              </label>
              <Input
                id="contact-address"
                placeholder="Address"
                value={formData.contactAddress}
                onChange={(e) => handleInputChange('contactAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Email
              </label>
              <Input
                id="contact-email"
                placeholder="email@example.com"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Phone
              </label>
              <Input
                id="contact-phone"
                placeholder="000-000-0000"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Default Meta Tags */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Default Meta Tags</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Title
              </label>
              <Input
                id="meta-title"
                placeholder="Default meta title for posts"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Description
              </label>
              <Textarea
                id="meta-description"
                placeholder="Default meta description for posts"
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="meta-keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Keywords
              </label>
              <Input
                id="meta-keywords"
                placeholder="keyword1, keyword2, keyword3"
                value={formData.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="focus-keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Focus Keyword
              </label>
              <Input
                id="focus-keyword"
                placeholder="Primary keyword for SEO"
                value={formData.focusKeyword}
                onChange={(e) => handleInputChange('focusKeyword', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Open Graph Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Open Graph Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="og-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OG Title
              </label>
              <Input
                id="og-title"
                placeholder="Default Open Graph title"
                value={formData.ogTitle}
                onChange={(e) => handleInputChange('ogTitle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="og-description" className="block text sm font-medium text-gray-700 dark:text-gray-300">
                OG Description
              </label>
              <Textarea
                id="og-description"
                placeholder="Default Open Graph description"
                rows={3}
                value={formData.ogDescription}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="og-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OG Type
              </label>
              <Select value={formData.ogType} onValueChange={(value) => handleInputChange('ogType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select OG type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="og-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OG Image URL
              </label>
              <Input
                id="og-image"
                placeholder="/og-image.jpg"
                type="url"
                value={formData.ogImage}
                onChange={(e) => handleInputChange('ogImage', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Twitter Card Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Twitter Card Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="twitter-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter Title
              </label>
              <Input
                id="twitter-title"
                placeholder="Default Twitter title"
                value={formData.twitterTitle}
                onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="twitter-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter Description
              </label>
              <Textarea
                id="twitter-description"
                placeholder="Default Twitter description"
                rows={3}
                value={formData.twitterDescription}
                onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="twitter-card-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter Card Type
              </label>
              <Select value={formData.twitterCardType} onValueChange={(value) => handleInputChange('twitterCardType', value)}>
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
            <div className="space-y-2">
              <label htmlFor="twitter-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter Image URL
              </label>
              <Input
                id="twitter-image"
                placeholder="/twitter-image.jpg"
                type="url"
                value={formData.twitterImage}
                onChange={(e) => handleInputChange('twitterImage', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="canonical-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Canonical URL
              </label>
              <Input
                id="canonical-url"
                placeholder="https://yoursite.com"
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
              />
            </div>
            <SwitchField>
              <Headless.Label data-slot="label">Allow indexing by search engines</Headless.Label>
              <Switch 
                checked={formData.allowIndexing}
                onChange={(checked) => handleInputChange('allowIndexing', checked)}
              />
            </SwitchField>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Meta Tags'}
        </Button>
      </CardContent>
    </Card>
  )
}
