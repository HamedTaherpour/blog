'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import Input from '@/shared/Input'
import { Button } from '@/shared/Button'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface HeaderMenuItem {
  id?: string
  label: string
  href: string
  order: number
  isActive: boolean
  isExternal: boolean
  children?: HeaderMenuItem[]
}

export default function HeaderMenusTab() {
  const [menus, setMenus] = useState<HeaderMenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch current header menus on component mount
  useEffect(() => {
    const fetchHeaderMenus = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/header-menus')
        if (response.ok) {
          const data = await response.json()
          setMenus(data)
        } else {
          toast.error('Failed to load header menus')
        }
      } catch (error) {
        console.error('Error fetching header menus:', error)
        toast.error('Failed to load header menus')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeaderMenus()
  }, [])

  const addParentMenu = () => {
    const newMenu: HeaderMenuItem = {
      label: '',
      href: '',
      order: menus.length,
      isActive: true,
      isExternal: false,
      children: [],
    }
    setMenus((prev) => [...prev, newMenu])
  }

  const addChildMenu = (parentIndex: number) => {
    const newChild: HeaderMenuItem = {
      label: '',
      href: '',
      order: menus[parentIndex].children?.length || 0,
      isActive: true,
      isExternal: false,
    }

    setMenus((prev) =>
      prev.map((menu, index) =>
        index === parentIndex
          ? { ...menu, children: [...(menu.children || []), newChild] }
          : menu
      )
    )
  }

  const removeParentMenu = (parentIndex: number) => {
    setMenus((prev) => prev.filter((_, index) => index !== parentIndex))
  }

  const removeChildMenu = (parentIndex: number, childIndex: number) => {
    setMenus((prev) =>
      prev.map((menu, index) =>
        index === parentIndex
          ? { ...menu, children: menu.children?.filter((_, i) => i !== childIndex) || [] }
          : menu
      )
    )
  }

  const updateParentMenu = (
    parentIndex: number,
    field: keyof HeaderMenuItem,
    value: string | boolean
  ) => {
    setMenus((prev) =>
      prev.map((menu, index) =>
        index === parentIndex ? { ...menu, [field]: value } : menu
      )
    )
  }

  const updateChildMenu = (
    parentIndex: number,
    childIndex: number,
    field: keyof HeaderMenuItem,
    value: string | boolean
  ) => {
    setMenus((prev) =>
      prev.map((menu, index) =>
        index === parentIndex
          ? {
              ...menu,
              children: menu.children?.map((child, i) =>
                i === childIndex ? { ...child, [field]: value } : child
              ) || [],
            }
          : menu
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/header-menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menus }),
      })

      if (response.ok) {
        toast.success('Header menus updated successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update header menus')
      }
    } catch (error) {
      console.error('Error updating header menus:', error)
      toast.error('Failed to update header menus')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Header Menus</CardTitle>
          <CardDescription>Manage your header navigation menus and links.</CardDescription>
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
        <CardTitle>Header Menus</CardTitle>
        <CardDescription>Manage your header navigation menus and links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Header Navigation</h3>
              <Button 
                type="button"
                outline 
                className="flex items-center gap-2"
                onClick={addParentMenu}
              >
                <PlusIcon className="h-4 w-4" />
                Add Parent Menu
              </Button>
            </div>
            
            {/* Parent Menu Items */}
            <div className="space-y-4">
              {menus.map((menu, parentIndex) => (
                <div key={parentIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Input 
                      placeholder="Menu Text" 
                      value={menu.label}
                      onChange={(e) => updateParentMenu(parentIndex, 'label', e.target.value)}
                      className="flex-1" 
                    />
                    <Input 
                      placeholder="URL" 
                      value={menu.href}
                      onChange={(e) => updateParentMenu(parentIndex, 'href', e.target.value)}
                      className="flex-1" 
                    />
                    <Button 
                      type="button"
                      outline 
                      className="flex items-center gap-1"
                      onClick={() => addChildMenu(parentIndex)}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Child
                    </Button>
                    <Button 
                      type="button"
                      color="red" 
                      className="flex items-center gap-1"
                      onClick={() => removeParentMenu(parentIndex)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Child Menu Items */}
                  {menu.children && menu.children.length > 0 && (
                    <div className="ml-6 space-y-2">
                      {menu.children.map((child, childIndex) => (
                        <div key={childIndex} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <Input 
                            placeholder="Child Menu Text" 
                            value={child.label}
                            onChange={(e) => updateChildMenu(parentIndex, childIndex, 'label', e.target.value)}
                            className="flex-1" 
                          />
                          <Input 
                            placeholder="URL" 
                            value={child.href}
                            onChange={(e) => updateChildMenu(parentIndex, childIndex, 'href', e.target.value)}
                            className="flex-1" 
                          />
                          <Button 
                            type="button"
                            color="red" 
                            className="flex items-center gap-1"
                            onClick={() => removeChildMenu(parentIndex, childIndex)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Header Menus'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
