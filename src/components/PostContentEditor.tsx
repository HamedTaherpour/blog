'use client'

import { Editor } from '@tinymce/tinymce-react'
import * as React from 'react'

interface PostContentEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
  showToolbar?: boolean
  minHeight?: string
  label?: string
  error?: string
}

export function PostContentEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Write your post content here...', 
  className = '',
  showToolbar = true,
  minHeight = '400px',
  label,
  error
}: PostContentEditorProps) {
  const editorRef = React.useRef<any>(null)

  const handleEditorChange = (content: string) => {
    onChange?.(content)
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    // Convert file to base64 for demo purposes
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = () => reject(new Error('File reading error'))
      reader.readAsDataURL(file)
    })
  }

  const tinymceConfig = {
    height: minHeight,
    menubar: showToolbar,
    toolbar: showToolbar ? [
      'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor | removeformat | help',
      'table | link image media | pagebreak | charmap emoticons | insertdatetime | searchreplace | wordcount'
    ] : false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
    ],
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-size: 14px; 
        line-height: 1.6; 
        color: #333; 
        max-width: none; 
        margin: 0; 
        padding: 16px; 
      }
      .mce-content-body { 
        padding: 16px !important; 
      }
      @media (prefers-color-scheme: dark) {
        body { 
          background-color: #1a1a1a; 
          color: #e0e0e0; 
        }
      }
    `,
    placeholder: placeholder,
    branding: false,
    promotion: false,
    resize: true,
    statusbar: false,
    elementpath: false,
    setup: (editor: any) => {
      editor.on('init', () => {
        editorRef.current = editor
      })
    },
    images_upload_handler: async (blobInfo: any, progress: any) => {
      try {
        const file = new File([blobInfo.blob()], blobInfo.filename(), {
          type: blobInfo.blob().type
        })
        const url = await handleImageUpload(file)
        progress(100)
        return url
      } catch (error) {
        console.error('Image upload failed:', error)
        throw error
      }
    },
    automatic_uploads: true,
    file_picker_types: 'image',
    file_picker_callback: (callback: any, value: any, meta: any) => {
      if (meta.filetype === 'image') {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        
        input.onchange = async () => {
          const file = input.files?.[0]
          if (file) {
            try {
              const url = await handleImageUpload(file)
              callback(url, { title: file.name })
            } catch (error) {
              console.error('File upload failed:', error)
            }
          }
        }
        
        input.click()
      }
    },
    table_default_attributes: {
      border: '1',
      class: 'border-collapse border border-gray-300 dark:border-neutral-600 w-full'
    },
    table_default_styles: {
      'border-collapse': 'collapse',
      width: '100%'
    },
    table_class_list: [
      { title: 'Default', value: 'border-collapse border border-gray-300 dark:border-neutral-600 w-full' },
      { title: 'Striped', value: 'border-collapse border border-gray-300 dark:border-neutral-600 w-full striped' }
    ],
    table_cell_class_list: [
      { title: 'Default', value: 'p-2 border-r border-gray-300 dark:border-neutral-600' },
      { title: 'Header', value: 'bg-gray-50 dark:bg-gray-800 font-semibold text-left p-2 border-r border-gray-300 dark:border-neutral-600' }
    ],
    link_context_toolbar: true,
    link_assume_external_targets: true,
    link_default_target: '_blank',
    link_default_protocol: 'https',
    // Dark mode support
    skin: 'oxide-dark',
    content_css: 'dark'
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      
      <div className={`border rounded-lg bg-white dark:bg-neutral-900 ${
        error 
          ? 'border-red-300 dark:border-red-600' 
          : 'border-neutral-200 dark:border-neutral-700'
      } ${className}`}>
        <Editor
          apiKey="" // For self-hosted version, you can use 'no-api-key'
          value={value}
          onEditorChange={handleEditorChange}
          init={tinymceConfig}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}