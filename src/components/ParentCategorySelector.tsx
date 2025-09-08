'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  level: number
  children?: Category[]
}

interface ParentCategorySelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

export default function ParentCategorySelector({ 
  value, 
  onChange, 
  label = "Γονική Κατηγορία",
  required = false 
}: ParentCategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCategories()
  }, [])

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
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id: string) => {
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

  const getCategoryPath = (cats: Category[], id: string): string[] => {
    const path: string[] = []
    
    const findPath = (categoryList: Category[], targetId: string, currentPath: string[]): boolean => {
      for (const cat of categoryList) {
        const newPath = [...currentPath, cat.name]
        if (cat.id === targetId) {
          path.push(...newPath)
          return true
        }
        if (cat.children && findPath(cat.children, targetId, newPath)) {
          return true
        }
      }
      return false
    }
    
    findPath(cats, id, [])
    return path
  }

  const selectedCategory = value ? findCategoryById(categories, value) : null
  const selectedPath = selectedCategory ? getCategoryPath(categories, value) : []

  const renderCategoryItem = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const indentLevel = level * 20

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
            value === category.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          style={{ paddingLeft: `${12 + indentLevel}px` }}
          onClick={() => {
            onChange(category.id)
            setIsOpen(false)
          }}
        >
          <div className="w-4 flex justify-center">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(category.id)
                }}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-3 w-3 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-3 w-3 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-3" />
            )}
          </div>
          <span className="text-sm text-gray-900 dark:text-white truncate">
            {category.name}
          </span>
        </div>
        {hasChildren && isExpanded && category.children && (
          <div>
            {category.children.map(child => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && '*'}
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && '*'}
      </label>
      
      {/* Selected Category Display */}
      <div
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategory ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900 dark:text-white">
                {selectedPath.join(' › ')}
              </span>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Επιλέξτε γονική κατηγορία (προαιρετικό)</span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>

      {/* Clear Selection Button */}
      {selectedCategory && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-8 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Root Option */}
          <div
            className={`flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              value === '' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
            onClick={() => {
              onChange('')
              setIsOpen(false)
            }}
          >
            <div className="w-4" />
            <span className="text-sm text-gray-900 dark:text-white">
              No parent (Root category)
            </span>
          </div>
          
          {/* Categories Tree */}
          {categories.map(category => renderCategoryItem(category))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
