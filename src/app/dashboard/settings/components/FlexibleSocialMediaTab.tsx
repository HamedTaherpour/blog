'use client'

import { CreateSocialMediaLinkData, SocialMediaLink } from '@/lib/social-media-service'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/shared/dialog'
import { Switch } from '@/shared/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/table'
import { DialogBackdrop, DialogPanel } from '@headlessui/react'
import {
  AiPhoneIcon,
  BehanceIcon,
  DiscordIcon,
  DribbbleIcon,
  Facebook01Icon,
  GithubIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MediumIcon,
  NewTwitterIcon,
  PinterestIcon,
  RedditIcon,
  SkypeIcon,
  SlackIcon,
  SnapchatIcon,
  TelegramIcon,
  TiktokIcon,
  TumblrIcon,
  TwitchIcon,
  VimeoIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Available icons mapping
const availableIcons = [
  { name: 'Facebook', value: 'Facebook01Icon', icon: Facebook01Icon },
  { name: 'Twitter/X', value: 'NewTwitterIcon', icon: NewTwitterIcon },
  { name: 'Instagram', value: 'InstagramIcon', icon: InstagramIcon },
  { name: 'YouTube', value: 'YoutubeIcon', icon: YoutubeIcon },
  { name: 'LinkedIn', value: 'LinkedinIcon', icon: LinkedinIcon },
  { name: 'GitHub', value: 'GithubIcon', icon: GithubIcon },
  { name: 'Discord', value: 'DiscordIcon', icon: DiscordIcon },
  { name: 'TikTok', value: 'TiktokIcon', icon: TiktokIcon },
  { name: 'Telegram', value: 'TelegramIcon', icon: TelegramIcon },
  { name: 'WhatsApp', value: 'WhatsappIcon', icon: WhatsappIcon },
  { name: 'Snapchat', value: 'SnapchatIcon', icon: SnapchatIcon },
  { name: 'Pinterest', value: 'PinterestIcon', icon: PinterestIcon },
  { name: 'Reddit', value: 'RedditIcon', icon: RedditIcon },
  { name: 'Twitch', value: 'TwitchIcon', icon: TwitchIcon },
  { name: 'Vimeo', value: 'VimeoIcon', icon: VimeoIcon },
  { name: 'Behance', value: 'BehanceIcon', icon: BehanceIcon },
  { name: 'Dribbble', value: 'DribbbleIcon', icon: DribbbleIcon },
  { name: 'Medium', value: 'MediumIcon', icon: MediumIcon },
  { name: 'Tumblr', value: 'TumblrIcon', icon: TumblrIcon },
  { name: 'Skype', value: 'SkypeIcon', icon: SkypeIcon },
  { name: 'Slack', value: 'SlackIcon', icon: SlackIcon },
  { name: 'Email', value: 'MailIcon', icon: MailIcon },
  { name: 'Phone', value: 'PhoneIcon', icon: AiPhoneIcon },
  { name: 'Website', value: 'GlobeIcon', icon: GlobeIcon },
]

export default function FlexibleSocialMediaTab() {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialMediaLink | null>(null)
  const [formData, setFormData] = useState<CreateSocialMediaLinkData>({
    name: '',
    url: '',
    iconName: 'Facebook01Icon',
    iconType: 'hugeicons',
    order: 0,
    isActive: true,
  })

  // Fetch social media links
  useEffect(() => {
    const fetchSocialLinks = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/social-media')
        if (response.ok) {
          const links = await response.json()
          setSocialLinks(links)
        } else {
          toast.error('Failed to load social media links')
        }
      } catch (error) {
        console.error('Error fetching social media links:', error)
        toast.error('Failed to load social media links')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSocialLinks()
  }, [])

  const handleInputChange = (field: keyof CreateSocialMediaLinkData, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      iconName: 'Facebook01Icon',
      iconType: 'hugeicons',
      order: socialLinks.length,
      isActive: true,
    })
    setEditingLink(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = editingLink ? `/api/social-media/${editingLink.id}` : '/api/social-media'
      const method = editingLink ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedLink = await response.json()

        if (editingLink) {
          setSocialLinks((prev) => prev.map((link) => (link.id === editingLink.id ? updatedLink : link)))
          toast.success('Social media link updated successfully')
        } else {
          setSocialLinks((prev) => [...prev, updatedLink])
          toast.success('Social media link created successfully')
        }

        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save social media link')
      }
    } catch (error) {
      console.error('Error saving social media link:', error)
      toast.error('Failed to save social media link')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (link: SocialMediaLink) => {
    setEditingLink(link)
    setFormData({
      name: link.name,
      url: link.url,
      iconName: link.iconName,
      iconType: link.iconType,
      order: link.order,
      isActive: link.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) {
      return
    }

    try {
      const response = await fetch(`/api/social-media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSocialLinks((prev) => prev.filter((link) => link.id !== id))
        toast.success('Social media link deleted successfully')
      } else {
        toast.error('Failed to delete social media link')
      }
    } catch (error) {
      console.error('Error deleting social media link:', error)
      toast.error('Failed to delete social media link')
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconMapping = availableIcons.find((icon) => icon.value === iconName)
    return iconMapping?.icon || GlobeIcon
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Manage your social media links that appear in the footer. You can add custom links with custom icons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {socialLinks.length} social media link{socialLinks.length !== 1 ? 's' : ''} configured
            </p>
            <Button
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              Add Social Media Link
            </Button>
          </div>

          {socialLinks.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <HugeiconsIcon icon={GlobeIcon} size={48} className="mx-auto mb-4 opacity-50" />
              <p>No social media links configured yet.</p>
              <p className="text-sm">Click &quot;Add Social Media Link&quot; to get started.</p>
            </div>
          ) : (
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeader>Icon</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>URL</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {socialLinks.map((link) => {
                  const IconComponent = getIconComponent(link.iconName)
                  return (
                    <TableRow key={link.id}>
                      <TableCell>
                        <HugeiconsIcon icon={IconComponent} size={24} />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{link.name}</span>
                      </TableCell>
                      <TableCell>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        {link.isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button outline onClick={() => handleEdit(link)}>
                            Edit
                          </Button>
                          <Button outline onClick={() => handleDelete(link.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogBackdrop />
        <DialogPanel className="max-w-md">
          <DialogTitle>{editingLink ? 'Edit Social Media Link' : 'Add Social Media Link'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogBody className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Facebook, Twitter, Instagram"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                <Input
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  type="url"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                <Select value={formData.iconName} onValueChange={(value) => handleInputChange('iconName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center space-x-2">
                          <HugeiconsIcon icon={icon.icon} size={16} />
                          <span>{icon.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onChange={(checked: boolean) => handleInputChange('isActive', checked)}
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
              </div>
            </DialogBody>
            <DialogActions>
              <Button type="button" color="amber" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingLink ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  )
}
