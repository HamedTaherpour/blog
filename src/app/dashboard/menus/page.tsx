'use client'

import { Button } from '@/shared/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { Card } from '@/shared/card'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronRight, Edit, ExternalLink, Eye, EyeOff, Menu, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AddMenuModal from './components/AddMenuModal'
import EditMenuModal from './components/EditMenuModal'

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

interface MenuTreeItemProps {
  item: HeaderMenuItem
  allItems: HeaderMenuItem[]
  onEdit: (item: HeaderMenuItem) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  onAddChild: (parentId: string) => void
  level?: number
}

function MenuTreeItem({ item, allItems, onEdit, onDelete, onToggleActive, onAddChild, level = 0 }: MenuTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasChildren = item.children && item.children.length > 0
  const indentLevel = level * 24

  // Render children recursively
  const renderChildren = () => {
    if (!hasChildren || !isExpanded) return null

    return item.children?.map((child) => (
      <MenuTreeItem
        key={child.id}
        item={child}
        allItems={allItems}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
        onAddChild={onAddChild}
        level={level + 1}
      />
    ))
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-3 border-b border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${
          isDragging ? 'shadow-lg' : ''
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab rounded p-1 hover:bg-gray-200 active:cursor-grabbing dark:hover:bg-gray-700"
        >
          <Menu size={16} className="text-gray-400" />
        </div>

        {/* Indentation */}
        <div style={{ width: indentLevel }} />

        {/* Expand/Collapse Button */}
        <div className="flex w-6 justify-center">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Menu Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
            {item.linkType === 'category' ? (
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            ) : item.linkType === 'tag' ? (
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            ) : item.linkType === 'page' ? (
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Menu Item Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-gray-900 dark:text-white">{item.label}</h3>
            {item.linkType !== 'custom' && (
              <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {item.linkType}
              </span>
            )}
          </div>
          <div className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">{item.href}</div>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">{item.href}</span>
            <span>Level {item.level}</span>
            <div className="flex items-center gap-1">
              {item.isExternal && <ExternalLink size={12} className="text-gray-400" />}
              {item.isActive ? (
                <Eye size={12} className="text-green-500" />
              ) : (
                <EyeOff size={12} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            plain
            onClick={() => onEdit(item)}
            className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
            title="Edit"
          >
            <Edit size={16} />
          </Button>
          <Button
            plain
            onClick={() => onToggleActive(item.id)}
            className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
            title={item.isActive ? 'Deactivate' : 'Activate'}
          >
            {item.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button
            plain
            onClick={() => onDelete(item.id)}
            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Render children */}
      {renderChildren()}
    </>
  )
}

export default function MenusPage() {
  const [menuItems, setMenuItems] = useState<HeaderMenuItem[]>([])
  const [linkOptions, setLinkOptions] = useState<LinkOptionsData>({
    categories: [],
    tags: [],
    pages: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<HeaderMenuItem | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/header-menus?format=hierarchy')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error('Failed to fetch menu items')
    }
  }

  // Fetch link options
  const fetchLinkOptions = async () => {
    try {
      const response = await fetch('/api/header-menus/link-options')
      if (response.ok) {
        const data = await response.json()
        setLinkOptions(data)
      }
    } catch (error) {
      console.error('Error fetching link options:', error)
      toast.error('Failed to fetch link options')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchMenuItems(), fetchLinkOptions()])
      setLoading(false)
    }
    loadData()
  }, [])

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id)
      const newIndex = menuItems.findIndex((item) => item.id === over.id)

      const newOrder = arrayMove(menuItems, oldIndex, newIndex)
      setMenuItems(newOrder)

      // Update order in database
      try {
        setSaving(true)

        // Prepare reorder data for root level items only
        const rootLevelItems = newOrder.filter((item) => !item.parentId)
        const reorderData = rootLevelItems.map((item, index) => ({
          menuItemId: item.id,
          newOrder: index,
        }))

        const response = await fetch('/api/header-menus/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reorderData }),
        })

        if (response.ok) {
          toast.success('Menu order updated successfully')
        } else {
          toast.error('Failed to update menu order')
          // Revert on error
          setMenuItems(menuItems)
        }
      } catch (error) {
        console.error('Error updating menu order:', error)
        toast.error('Failed to update menu order')
        setMenuItems(menuItems)
      } finally {
        setSaving(false)
      }
    }
  }

  // Handle edit
  const handleEdit = (item: HeaderMenuItem) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`/api/header-menus/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast.success('Menu item deleted successfully')
          fetchMenuItems()
        } else {
          toast.error('Failed to delete menu item')
        }
      } catch (error) {
        console.error('Error deleting menu item:', error)
        toast.error('Failed to delete menu item')
      }
    }
  }

  // Handle toggle active
  const handleToggleActive = async (id: string) => {
    try {
      const response = await fetch(`/api/header-menus/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !menuItems.find((item) => item.id === id)?.isActive }),
      })

      if (response.ok) {
        toast.success('Menu item status updated')
        fetchMenuItems()
      } else {
        toast.error('Failed to update menu item status')
      }
    } catch (error) {
      console.error('Error updating menu item status:', error)
      toast.error('Failed to update menu item status')
    }
  }

  // Handle add child
  const handleAddChild = (parentId: string) => {
    // This will be handled by the AddMenuModal
    setShowAddModal(true)
  }

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return

    try {
      setSaving(true)
      const response = await fetch('/api/header-menus/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: bulkAction,
          itemIds: selectedItems,
        }),
      })

      if (response.ok) {
        toast.success(`Bulk ${bulkAction} completed successfully`)
        setSelectedItems([])
        setBulkAction('')
        fetchMenuItems()
      } else {
        toast.error(`Failed to ${bulkAction} menu items`)
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      toast.error(`Failed to ${bulkAction} menu items`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menu Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your website header navigation menus</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">{selectedItems.length} item(s) selected</span>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">Activate</SelectItem>
                <SelectItem value="deactivate">Deactivate</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleBulkAction} disabled={!bulkAction || saving}>
              Apply
            </Button>
            <Button onClick={() => setSelectedItems([])} plain>
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {/* Menu Tree */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu Structure</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">{menuItems.length} item(s)</div>
        </div>
        {menuItems.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400 dark:text-gray-600">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">No menu items yet</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">Get started by adding your first menu item</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={16} className="mr-2" />
              Add First Menu Item
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={menuItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {menuItems
                  .filter((item) => !item.parentId) // Only show root level items
                  .map((item) => (
                    <MenuTreeItem
                      key={item.id}
                      item={item}
                      allItems={menuItems}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                      onAddChild={handleAddChild}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </Card>

      {/* Add Menu Modal */}
      {showAddModal && (
        <AddMenuModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            try {
              const response = await fetch('/api/header-menus/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })

              if (response.ok) {
                toast.success('Menu item created successfully')
                fetchMenuItems()
              } else {
                toast.error('Failed to create menu item')
              }
            } catch (error) {
              console.error('Error creating menu item:', error)
              toast.error('Failed to create menu item')
            }
          }}
          linkOptions={linkOptions}
          allMenuItems={menuItems}
        />
      )}

      {/* Edit Menu Modal */}
      {showEditModal && editingItem && (
        <EditMenuModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingItem(null)
          }}
          onSave={async (data) => {
            try {
              const response = await fetch(`/api/header-menus/${editingItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              })

              if (response.ok) {
                toast.success('Menu item updated successfully')
                fetchMenuItems()
              } else {
                toast.error('Failed to update menu item')
              }
            } catch (error) {
              console.error('Error updating menu item:', error)
              toast.error('Failed to update menu item')
            }
          }}
          linkOptions={linkOptions}
          allMenuItems={menuItems}
          editingItem={editingItem}
        />
      )}
    </div>
  )
}
