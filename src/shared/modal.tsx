import React from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
}

export function Modal({ open, onOpenChange, children, title }: ModalProps) {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white dark:bg-neutral-900 rounded-lg shadow-xl">
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              <button
                onClick={() => onOpenChange(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
