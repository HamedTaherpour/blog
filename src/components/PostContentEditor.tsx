'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import * as React from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from 'lucide-react'

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
  minHeight = '800px',
  label,
  error
}: PostContentEditorProps) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[200px]',
        placeholder: placeholder,
      },
    },
    immediatelyRender: false,
  }, [isClient])

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run()
  }

  const addColumnBefore = () => {
    editor?.chain().focus().addColumnBefore().run()
  }

  const addColumnAfter = () => {
    editor?.chain().focus().addColumnAfter().run()
  }

  const deleteColumn = () => {
    editor?.chain().focus().deleteColumn().run()
  }

  const addRowBefore = () => {
    editor?.chain().focus().addRowBefore().run()
  }

  const addRowAfter = () => {
    editor?.chain().focus().addRowAfter().run()
  }

  const deleteRow = () => {
    editor?.chain().focus().deleteRow().run()
  }

  if (!isClient || !editor) {
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
          <div 
            style={{ minHeight }} 
            className="flex items-center justify-center p-8 text-neutral-500 dark:text-neutral-400"
          >
            Loading editor...
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
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
        
        {showToolbar && (
          <div className="border-b border-neutral-200 dark:border-neutral-700 p-2 flex flex-wrap gap-1">
            {/* Text Formatting */}
            <div className="flex gap-1 border-r border-neutral-200 dark:border-neutral-700 pr-2 mr-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('bold') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('italic') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('strike') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Headings */}
            <div className="flex gap-1 border-r border-neutral-200 dark:border-neutral-700 pr-2 mr-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('paragraph') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Normal Text"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('heading', { level: 1 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('heading', { level: 3 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('heading', { level: 4 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Heading 4"
              >
                <Heading4 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('heading', { level: 5 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Heading 5"
              >
                <Heading5 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('heading', { level: 6 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Heading 6"
              >
                <Heading6 className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex gap-1 border-r border-neutral-200 dark:border-neutral-700 pr-2 mr-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('bulletList') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('orderedList') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  editor.isActive('blockquote') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* Table Controls */}
            <div className="flex gap-1 border-r border-neutral-200 dark:border-neutral-700 pr-2 mr-2">
              <button
                type="button"
                onClick={addTable}
                className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Insert Table"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              {editor.isActive('table') && (
                <>
                  <button
                    type="button"
                    onClick={addColumnBefore}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Add Column Before"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={addColumnAfter}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Add Column After"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={deleteColumn}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Delete Column"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={addRowBefore}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Add Row Before"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={addRowAfter}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Add Row After"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={deleteRow}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Delete Row"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={deleteTable}
                    className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Delete Table"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div style={{ minHeight }}>
          <EditorContent 
            editor={editor} 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}