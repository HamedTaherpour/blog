'use client'

import { useState } from 'react'
import { Button } from '@/shared/Button'
import { Dialog, DialogTitle, DialogDescription, DialogBody, DialogActions } from '@/shared/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import Input from '@/shared/Input'

interface LinkOption {
  id: string
  name: string
  href: string
  type: string
  level?: number
  parentId?: string | null
}

interface LinkOptionsData {
  categories: LinkOption[]
  tags: LinkOption[]
  pages: LinkOption[]
}

interface HeaderMenuItem {
  id: string
  label: string
  href: string
  order: number
  level: number
  path: string
  isActive: boolean
  isExternal: boolean
  linkType: string
  linkId: string | null
  createdAt: string
  updatedAt: string
  parentId: string | null
  parent?: HeaderMenuItem | null
  children?: HeaderMenuItem[]
}

interface AddMenuModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  linkOptions: LinkOptionsData
  allMenuItems: HeaderMenuItem[]
  parentId?: string
}

export default function AddMenuModal({
  isOpen,
  onClose,
  onSave,
  linkOptions,
  allMenuItems,
  parentId,
}: AddMenuModalProps) {
  const [formData, setFormData] = useState({
    label: '',
    href: '#',
    linkType: 'custom',
    linkId: '',
    parentId: parentId || '',
    isActive: true,
    isExternal: false,
  })

  // Get available options based on link type
  const getAvailableOptions = (linkType: string): LinkOption[] => {
    switch (linkType) {
      case 'category':
        return linkOptions.categories
      case 'tag':
        return linkOptions.tags
      case 'page':
        return linkOptions.pages
      default:
        return []
    }
  }

  // Get available parents
  const getAvailableParents = (): HeaderMenuItem[] => {
    const flattenMenuItems = (items: HeaderMenuItem[], parent: HeaderMenuItem | null = null): HeaderMenuItem[] => {
      const result: HeaderMenuItem[] = []
      items.forEach(item => {
        const itemWithParent = { ...item, parent }
        result.push(itemWithParent)
        if (item.children) {
          result.push(...flattenMenuItems(item.children, itemWithParent))
        }
      })
      return result
    }

    return flattenMenuItems(allMenuItems)
  }

  const handleLinkTypeChange = (newLinkType: string) => {
    setFormData(prev => ({
      ...prev,
      linkType: newLinkType,
      linkId: '', // Reset link ID when type changes
    }))
  }

  const handleLinkIdChange = (linkId: string) => {
    const options = getAvailableOptions(formData.linkType)
    const selectedOption = options.find(option => option.id === linkId)
    
    setFormData(prev => ({
      ...prev,
      linkId,
      label: selectedOption ? selectedOption.name : prev.label,
      href: selectedOption ? selectedOption.href : prev.href,
    }))
  }

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      linkId: formData.linkId || null,
      parentId: formData.parentId || null,
    }
    onSave(dataToSave)
    onClose()
    
    // Reset form
    setFormData({
      label: '',
      href: '#',
      linkType: 'custom',
      linkId: '',
      parentId: parentId || '',
      isActive: true,
      isExternal: false,
    })
  }

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <DialogTitle>Add New Menu Item</DialogTitle>
      <DialogDescription>
        Create a new menu item for your header navigation
      </DialogDescription>
      
      <DialogBody>
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Menu Label
              </label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Enter menu label"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <Input
                value={formData.href}
                onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                placeholder="Enter URL"
                className="w-full"
              />
            </div>

            {/* Link Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link Type
              </label>
              <Select value={formData.linkType} onValueChange={handleLinkTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select link type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Link</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="tag">Tag</SelectItem>
                  <SelectItem value="page">Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link Selection - only show when not custom */}
            {formData.linkType !== 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select {formData.linkType}
                </label>
                <Select value={formData.linkId} onValueChange={handleLinkIdChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${formData.linkType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableOptions(formData.linkType).map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Parent Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent Menu (Optional)
              </label>
              <Select 
                value={formData.parentId} 
                onValueChange={(parentId) => setFormData(prev => ({ ...prev, parentId: parentId === '-' ? '' : parentId }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select parent menu (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">No Parent (Root Level)</SelectItem>
                  {getAvailableParents().map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: parent.level }, (_, i) => (
                            <div key={i} className="w-2 h-2 border-l border-gray-300 dark:border-gray-600 ml-1" />
                          ))}
                        </div>
                        <span className="font-medium">{parent.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (Level {parent.level})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Hierarchy Preview */}
              {formData.parentId && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Hierarchy Preview:
                  </div>
                  <div className="text-sm">
                    {(() => {
                      const selectedParent = getAvailableParents().find(p => p.id === formData.parentId)
                      if (!selectedParent) return null
                      
                      const buildPath = (item: HeaderMenuItem): string => {
                        if (item.level === 0 || !item.parent) return item.label
                        return `${buildPath(item.parent)} > ${item.label}`
                      }
                      
                      return `${buildPath(selectedParent)} > [New Item]`
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Current Menu Structure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Menu Structure
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                {allMenuItems.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No menu items yet. This will be the first item.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {allMenuItems.map((item) => (
                      <div key={item.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: item.level }, (_, i) => (
                              <div key={i} className="w-3 h-3 border-l-2 border-gray-300 dark:border-gray-600 ml-1" />
                            ))}
                          </div>
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            (Level {item.level})
                          </span>
                        </div>
                        {item.children && item.children.length > 0 && (
                          <div className="ml-4 mt-1">
                            {item.children.map((child) => (
                              <div key={child.id} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 border-l-2 border-gray-300 dark:border-gray-600 ml-1" />
                                <span>{child.label}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  (Level {child.level})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isExternal}
                  onChange={(e) => setFormData(prev => ({ ...prev, isExternal: e.target.checked }))}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">External Link</span>
              </label>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogActions>
        <Button plain onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Add Menu Item
        </Button>
      </DialogActions>
    </Dialog>
  )
}
