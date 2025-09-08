'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { Button } from '@/shared/Button'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/lib/permissions'
import { useRouter } from 'next/navigation'
import UserPermissionsCard from '@/components/UserPermissionsCard'

export default function DashboardPage() {
  const { user } = useAuth()
  const { canAccessRoute } = usePermissions(user?.role as any)
  const router = useRouter()

  const quickActions = [
    {
      title: 'Create New Post',
      description: 'Write and publish a new blog post',
      href: '/dashboard/posts/new',
      icon: '📝',
      resource: 'posts',
      action: 'create'
    },
    {
      title: 'Manage Posts',
      description: 'View and edit existing posts',
      href: '/dashboard/posts',
      icon: '📄',
      resource: 'posts',
      action: 'read'
    },
    {
      title: 'Manage Categories',
      description: 'Organize content with categories',
      href: '/dashboard/categories',
      icon: '📁',
      resource: 'categories',
      action: 'read'
    },
    {
      title: 'Manage Tags',
      description: 'Add and organize tags',
      href: '/dashboard/tags',
      icon: '🏷️',
      resource: 'tags',
      action: 'read'
    },
    {
      title: 'Media Library',
      description: 'Upload and manage media files',
      href: '/dashboard/media',
      icon: '🖼️',
      resource: 'media',
      action: 'read'
    },
    {
      title: 'Manage Users',
      description: 'Add and manage user accounts',
      href: '/dashboard/users',
      icon: '👥',
      resource: 'users',
      action: 'read'
    },
    {
      title: 'Site Settings',
      description: 'Configure site-wide settings',
      href: '/dashboard/settings',
      icon: '⚙️',
      resource: 'settings',
      action: 'read'
    }
  ]

  const handleQuickAction = (href: string) => {
    router.push(href)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || user?.email}! Here's what you can do.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you can perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const hasPermission = canAccessRoute(action.href)
                  
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 transition-colors ${
                        hasPermission 
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => hasPermission && handleQuickAction(action.href)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{action.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {action.description}
                          </p>
                          {!hasPermission && (
                            <p className="text-xs text-red-500 mt-1">
                              No permission
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Permissions */}
        <div>
          <UserPermissionsCard />
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
              <p className="text-sm">{user?.name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
              <p className="text-sm">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
              <p className="text-sm">@{user?.username || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
              <p className="text-sm">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}