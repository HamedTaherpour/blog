'use client'

import { useState } from 'react'

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  label?: string
  required?: boolean
}

const predefinedColors = [
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
  { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Indigo', value: 'indigo', hex: '#6366F1' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
  { name: 'Teal', value: 'teal', hex: '#14B8A6' },
  { name: 'Cyan', value: 'cyan', hex: '#06B6D4' },
  { name: 'Lime', value: 'lime', hex: '#84CC16' },
  { name: 'Emerald', value: 'emerald', hex: '#059669' },
  { name: 'Rose', value: 'rose', hex: '#F43F5E' },
  { name: 'Violet', value: 'violet', hex: '#8B5CF6' },
  { name: 'Sky', value: 'sky', hex: '#0EA5E9' },
  { name: 'Gray', value: 'gray', hex: '#6B7280' },
]

export default function ColorPicker({ value = 'blue', onChange, label, required }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedColor = predefinedColors.find(color => color.value === value) || predefinedColors[0]

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div 
            className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="flex-1 text-left">{selectedColor.name}</span>
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
            <div className="p-3">
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      onChange(color.value)
                      setIsOpen(false)
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      value === color.value ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
