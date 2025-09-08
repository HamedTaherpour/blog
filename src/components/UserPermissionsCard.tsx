'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/card'
import { usePermissions } from '@/lib/permissions'
import { useAuth } from '@/hooks/useAuth'

export default function UserPermissionsCard() {
  const { user } = useAuth()
  const { getUserPermissions, getRoleDescription, userRole } = usePermissions(user?.role as any)

  const permissions = getUserPermissions()

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'update':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'upload':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getResourceLabel = (resource: string) => {
    switch (resource) {
      case 'posts':
        return 'Posts'
      case 'categories':
        return 'Categories'
      case 'tags':
        return 'Tags'
      case 'media':
        return 'Media'
      case 'users':
        return 'Users'
      case 'settings':
        return 'Site Settings'
      case 'profile':
        return 'Profile'
      default:
        return resource
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create':
        return 'Create'
      case 'read':
        return 'View'
      case 'update':
        return 'Edit'
      case 'delete':
        return 'Delete'
      case 'upload':
        return 'Upload'
      default:
        return action
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Permissions</CardTitle>
        <CardDescription>
          {getRoleDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role:</span>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              userRole === 'AUTHOR' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              userRole === 'EDITOR' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {userRole}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Actions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.map((permission, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h5 className="font-medium text-sm mb-2">
                    {getResourceLabel(permission.resource)}
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {permission.actions.map((action, actionIndex) => (
                      <span
                        key={actionIndex}
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionColor(action)}`}
                      >
                        {getActionLabel(action)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If you need additional permissions, contact your administrator.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
