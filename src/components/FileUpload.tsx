'use client'

import { Button } from '@/shared/Button'
import { Card, CardContent } from '@/shared/card'
import { File, FileAudio, FileImage, FileVideo, Upload, X } from 'lucide-react'
import React, { useCallback, useRef } from 'react'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  postType?: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FILE'
  maxFiles?: number
  className?: string
  label?: string
  description?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  postType = 'IMAGE',
  maxFiles = 1,
  className = '',
  label = 'Upload Files',
  description = 'Drag and drop files here, or click to select files',
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const acceptedTypesList = {
    AUDIO: ['audio/*'],
    VIDEO: ['video/*'],
    IMAGE: ['image/*'],
    FILE: ['image/*', 'audio/*', 'video/*'],
  }

  const acceptedTypes = acceptedTypesList[postType] || acceptedTypesList.IMAGE

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      const validFiles = selectedFiles.filter((file) => {
        return acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1))
          }
          return file.type === type
        })
      })

      if (files.length + validFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      onFilesChange([...files, ...validFiles])
    },
    [files, onFilesChange, maxFiles, acceptedTypes]
  )

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index)
      onFilesChange(newFiles)
    },
    [files, onFilesChange]
  )

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-blue-500" />
    } else if (file.type.startsWith('audio/')) {
      return <FileAudio className="h-4 w-4 text-green-500" />
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-4 w-4 text-purple-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div>
        <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <Card
          className={`transition-colors ${
            false
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
        >
          <CardContent className="!px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                  <Upload className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {postType === 'AUDIO'
                      ? 'Audio files only'
                      : postType === 'VIDEO'
                        ? 'Video files only'
                        : postType === 'IMAGE'
                          ? 'Image files only'
                          : 'All files'}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                color="light"
                onClick={() => inputRef.current?.click()}
                className="px-1.5 py-1 text-xs"
              >
                Select
              </Button>
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={acceptedTypes.join(',')}
                multiple={false}
                onChange={handleFileSelect}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Files ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded border border-gray-200 bg-white p-1.5 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center space-x-1.5">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900 max-w-56 dark:text-gray-100">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  color="light"
                  onClick={() => removeFile(index)}
                  className="p-0.5 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
