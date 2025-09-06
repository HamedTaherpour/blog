'use client'

import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface FooterMenuItem {
  id?: string
  label: string
  href: string
  order: number
  isActive: boolean
}

interface FooterMenuGroup {
  id?: string
  title: string
  order: number
  isActive: boolean
  menuItems: FooterMenuItem[]
}

export default function FooterMenusTab() {
  const [groups, setGroups] = useState<FooterMenuGroup[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch current footer menus on component mount
  useEffect(() => {
    const fetchFooterMenus = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/footer-menus')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setGroups(data)
          }
        } else {
          toast.error('Failed to load footer menus')
        }
      } catch (error) {
        console.error('Error fetching footer menus:', error)
        toast.error('Failed to load footer menus')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterMenus()
  }, [])

  const addMenuItem = (groupIndex: number) => {
    const newItem: FooterMenuItem = {
      label: '',
      href: '',
      order: groups[groupIndex].menuItems.length,
      isActive: true,
    }

    setGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? { ...group, menuItems: [...group.menuItems, newItem] } : group
      )
    )
  }

  const removeMenuItem = (groupIndex: number, itemIndex: number) => {
    setGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? { ...group, menuItems: group.menuItems.filter((_, i) => i !== itemIndex) } : group
      )
    )
  }

  const updateMenuItem = (
    groupIndex: number,
    itemIndex: number,
    field: keyof FooterMenuItem,
    value: string | boolean
  ) => {
    setGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              menuItems: group.menuItems.map((item, i) => (i === itemIndex ? { ...item, [field]: value } : item)),
            }
          : group
      )
    )
  }

  const updateGroupTitle = (groupIndex: number, title: string) => {
    setGroups((prev) => prev.map((group, index) => (index === groupIndex ? { ...group, title } : group)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/footer-menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groups }),
      })

      if (response.ok) {
        toast.success('Footer menus updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update footer menus')
      }
    } catch (error) {
      console.error('Error updating footer menus:', error)
      toast.error('Failed to update footer menus')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Menus</CardTitle>
          <CardDescription>Manage your footer navigation menus and links.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Menus</CardTitle>
        <CardDescription>Manage your footer navigation menus and links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  value={group.title}
                  onChange={(e) => updateGroupTitle(groupIndex, e.target.value)}
                  className="border-none bg-transparent p-0 text-lg font-semibold focus:ring-0"
                  placeholder="Group Title"
                />
                <Button
                  type="button"
                  outline
                  className="flex items-center gap-2"
                  onClick={() => addMenuItem(groupIndex)}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Link
                </Button>
              </div>
              <div className="space-y-3">
                {group.menuItems.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center space-x-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <Input
                      placeholder="Link Text"
                      value={item.label}
                      onChange={(e) => updateMenuItem(groupIndex, itemIndex, 'label', e.target.value)}
                      className="flex-1"
                    />
                     <Input
                       placeholder="URL"
                       value={item.href}
                       onChange={(e) => updateMenuItem(groupIndex, itemIndex, 'href', e.target.value)}
                       className="flex-1"
                     />
                    <Button
                      type="button"
                      color="red"
                      className="flex items-center gap-1"
                      onClick={() => removeMenuItem(groupIndex, itemIndex)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {groupIndex < groups.length - 1 && (
                <div className="border-t border-gray-200 pt-6 dark:border-gray-700"></div>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Footer Menus'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
