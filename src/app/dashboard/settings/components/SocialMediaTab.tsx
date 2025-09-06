'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import Input from '@/shared/Input'
import { Button } from '@/shared/Button'
import { toast } from 'sonner'

interface SocialMediaData {
  facebook?: string
  twitter?: string
  instagram?: string
  youtube?: string
}

export default function SocialMediaTab() {
  const [formData, setFormData] = useState<SocialMediaData>({
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const settings = await response.json()
          setFormData({
            facebook: settings.facebook || '',
            twitter: settings.twitter || '',
            instagram: settings.instagram || '',
            youtube: settings.youtube || '',
          })
        } else {
          toast.error('Failed to load settings')
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleInputChange = (field: keyof SocialMediaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Social media links updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update social media links')
      }
    } catch (error) {
      console.error('Error updating social media:', error)
      toast.error('Failed to update social media links')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Add your social media profiles to display in your site&apos;s footer and header.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Add your social media profiles to display in your site&apos;s footer and header.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="facebook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Facebook
              </label>
              <Input
                id="facebook-url"
                placeholder="https://facebook.com/yourpage"
                type="url"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="twitter-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter
              </label>
              <Input
                id="twitter-url"
                placeholder="https://twitter.com/yourhandle"
                type="url"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="instagram-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Instagram
              </label>
              <Input
                id="instagram-url"
                placeholder="https://instagram.com/yourhandle"
                type="url"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                YouTube
              </label>
              <Input
                id="youtube-url"
                placeholder="https://youtube.com/channel/yourchannel"
                type="url"
                value={formData.youtube}
                onChange={(e) => handleInputChange('youtube', e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Social Media Links'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
