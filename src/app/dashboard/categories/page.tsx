'use client'

import { Button } from '@/shared/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { PencilIcon, PlusIcon, TrashIcon, ChevronRightIcon, ChevronDownIcon, Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  order: number
  level: number
  path: string
  createdAt: string
  updatedAt: string
  parentId: string | null
  parent?: Category | null
  children?: Category[]
  _count?: {
    posts: number
  }
}

interface SortableCategoryItemProps {
  category: Category
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  isExpanded: boolean
  level: number
}

function SortableCategoryItem({ 
  category, 
  onDelete, 
  onToggleExpand, 
  isExpanded, 
  level 
}: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasChildren = category.children && category.children.length > 0
  const indentLevel = level * 24

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
      >
        <Bars3Icon className="h-4 w-4 text-gray-400" />
      </div>

      {/* Indentation */}
      <div style={{ width: indentLevel }} />

      {/* Expand/Collapse Button */}
      <div className="w-6 flex justify-center">
        {hasChildren ? (
          <button
            onClick={() => onToggleExpand(category.id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
      </div>

      {/* Category Image */}
      <div className="flex-shrink-0">
        {category.image ? (
          <img
            className="h-10 w-10 rounded-lg object-cover"
            src={category.image}
            alt={category.name}
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder-image.png'
            }}
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {category.name}
          </h3>
          <div 
            className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0"
            style={{ backgroundColor: getColorHex(category.color) }}
          />
        </div>
        {category.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
            {category.description}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-mono">/{category.slug}</span>
          <span>{category._count?.posts || 0} posts</span>
          <span>Level {category.level}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/dashboard/categories/${category.id}/edit`} prefetch={false}>
          <Button plain className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Link>
        <Button 
          plain 
          onClick={() => onDelete(category.id)} 
          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface CategoryTreeProps {
  categories: Category[]
  onDelete: (id: string) => void
  expandedCategories: Set<string>
  onToggleExpand: (id: string) => void
  level?: number
}

function CategoryTree({ 
  categories, 
  onDelete, 
  expandedCategories, 
  onToggleExpand, 
  level = 0 
}: CategoryTreeProps) {
  return (
    <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
      {categories.map((category) => (
        <div key={category.id}>
          <SortableCategoryItem
            category={category}
            onDelete={onDelete}
            onToggleExpand={onToggleExpand}
            isExpanded={expandedCategories.has(category.id)}
            level={level}
          />
          {category.children && 
           expandedCategories.has(category.id) && 
           category.children.length > 0 && (
            <CategoryTree
              categories={category.children}
              onDelete={onDelete}
              expandedCategories={expandedCategories}
              onToggleExpand={onToggleExpand}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </SortableContext>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?format=hierarchy')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        
        // Auto-expand root categories
        const rootIds = data.map((cat: Category) => cat.id)
        setExpandedCategories(new Set(rootIds))
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
        const error = await response.json()
        toast.error(error.message || 'Failed to delete category')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleResetOrders = async () => {
    if (!confirm('Are you sure you want to reset all category orders? This will reorder all categories by creation date.')) return

    try {
      const response = await fetch('/api/categories/reset-orders', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Category orders reset successfully')
        fetchCategories()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to reset category orders')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleToggleExpand = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) {
      return
    }

    const activeCategory = findCategoryById(categories, active.id as string)
    const overCategory = findCategoryById(categories, over.id as string)

    if (!activeCategory || !overCategory) return

    // Only allow reordering within the same parent level
    if (activeCategory.parentId !== overCategory.parentId) {
      toast.error('Cannot move categories between different parent levels')
      return
    }

    try {
      // Get all siblings at the same level
      const siblings = activeCategory.parentId 
        ? findCategoryById(categories, activeCategory.parentId)?.children || []
        : categories.filter(cat => !cat.parentId)

      // Sort siblings by order
      const sortedSiblings = [...siblings].sort((a, b) => a.order - b.order)
      
      // Find the new order based on position
      const activeIndex = sortedSiblings.findIndex(cat => cat.id === active.id)
      const overIndex = sortedSiblings.findIndex(cat => cat.id === over.id)

      if (activeIndex === -1 || overIndex === -1) return

      let newOrder: number
      
      if (activeIndex < overIndex) {
        // Moving down - place after the target
        newOrder = overIndex
      } else {
        // Moving up - place before the target
        newOrder = overIndex
      }

      const reorderData = [{
        categoryId: active.id as string,
        newOrder: newOrder,
        newParentId: activeCategory.parentId
      }]

      console.log('Reorder data:', reorderData)
      console.log('Siblings:', sortedSiblings.map(s => ({ name: s.name, order: s.order })))

      const response = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reorderData }),
      })

      if (response.ok) {
        toast.success('Categories reordered successfully')
        fetchCategories()
      } else {
        const error = await response.json()
        console.error('Reorder error:', error)
        toast.error(error.message || 'Failed to reorder categories')
      }
    } catch (error) {
      console.error('Reorder error:', error)
      toast.error('Something went wrong')
    }
  }

  const findCategoryById = (cats: Category[], id: string): Category | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat
      if (cat.children) {
        const found = findCategoryById(cat.children, id)
        if (found) return found
      }
    }
    return null
  }

  const getActiveCategory = () => {
    if (!activeId) return null
    return findCategoryById(categories, activeId)
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
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Organize your content with hierarchical categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleResetOrders}
              className="flex items-center gap-2"
              color="light"
            >
              Reset Orders
            </Button>
            <Link href="/dashboard/categories/new" prefetch={false}>
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-6">
        {/* Categories Tree */}
        <Card>
          <CardHeader>
            <CardTitle>Category Hierarchy</CardTitle>
            <CardDescription>
              Drag and drop to reorder categories. Click the arrow to expand/collapse subcategories.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="min-h-[400px]">
                {categories.length > 0 ? (
                  <CategoryTree
                    categories={categories}
                    onDelete={handleDelete}
                    expandedCategories={expandedCategories}
                    onToggleExpand={handleToggleExpand}
                  />
                ) : (
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
              </div>
              
              <DragOverlay>
                {activeId ? (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 opacity-90">
                    <div className="flex items-center gap-3">
                      <Bars3Icon className="h-4 w-4 text-gray-400" />
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getActiveCategory()?.name}
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}