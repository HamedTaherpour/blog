'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Button } from '@/shared/Button'
import Input from '@/shared/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/Select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  username: string
  email: string
  role: 'AUTHOR' | 'EDITOR' | 'ADMIN'
  bio: string | null
  image: string | null
  createdAt: string
  updatedAt: string
}

interface UpdateUserData {
  name: string
  username: string
  email: string
  password: string
  role: 'AUTHOR' | 'EDITOR' | 'ADMIN'
  bio: string
}

const roleLabels = {
  AUTHOR: 'Author',
  EDITOR: 'Editor',
  ADMIN: 'Admin',
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'AUTHOR',
    bio: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { id } = await params
      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/${id}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setFormData({
            name: userData.name || '',
            username: userData.username,
            email: userData.email,
            password: '',
            role: userData.role,
            bio: userData.bio || '',
          })
        } else {
          toast.error('Failed to load user')
          router.push('/dashboard/users')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Failed to load user')
        router.push('/dashboard/users')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params, router])

  const handleInputChange = (field: keyof UpdateUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('User updated successfully')
        router.push('/dashboard/users')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/users')
  }

  const handleDelete = async () => {
    if (!user) return

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        router.push('/dashboard/users')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold">User not found</h2>
            <p className="text-gray-500 dark:text-gray-400">The user you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/dashboard/users')} className="mt-4">
              Back to Users
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">
            Update user information and permissions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCancel}>
            Back to Users
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update the details for this user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username *
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Leave blank to keep current password"
                  type="password"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to keep current password
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role *
                </label>
                <Select value={formData.role} onValueChange={(value: 'AUTHOR' | 'EDITOR' | 'ADMIN') => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTHOR">Author - Can create and edit posts</SelectItem>
                    <SelectItem value="EDITOR">Editor - Can manage content and users</SelectItem>
                    <SelectItem value="ADMIN">Admin - Full system access</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.role === 'AUTHOR' && 'Cannot access site settings'}
                  {formData.role === 'EDITOR' && 'Cannot access site settings'}
                  {formData.role === 'ADMIN' && 'Full access to all features'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <Input
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Enter user bio (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Updating User...' : 'Update User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}