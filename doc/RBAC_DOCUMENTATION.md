# Role-Based Access Control (RBAC) System

This document explains how to use the role-based access control system implemented in the blog application.

## Overview

The RBAC system provides three user roles with different levels of access:

- **AUTHOR**: Can only manage posts (create, read, update, delete their own posts)
- **EDITOR**: Can manage posts, categories, tags, and media (full content management)
- **ADMIN**: Full system access including users and settings

## Permission Structure

### AUTHOR Role
- ✅ **Posts**: Full access (create, read, update, delete)
- ❌ **Categories**: No access
- ❌ **Tags**: No access  
- ❌ **Media**: No access
- ❌ **Users**: No access
- ❌ **Settings**: No access

### EDITOR Role
- ✅ **Posts**: Full access (create, read, update, delete)
- ✅ **Categories**: Full access (create, read, update, delete)
- ✅ **Tags**: Full access (create, read, update, delete)
- ✅ **Media**: Full access (create, read, update, delete)
- ❌ **Users**: No access
- ❌ **Settings**: No access

### ADMIN Role
- ✅ **Posts**: Full access (create, read, update, delete)
- ✅ **Categories**: Full access (create, read, update, delete)
- ✅ **Tags**: Full access (create, read, update, delete)
- ✅ **Media**: Full access (create, read, update, delete)
- ✅ **Users**: Full access (create, read, update, delete)
- ✅ **Settings**: Full access (read, update)

## Implementation Details

### 1. Permission System (`src/lib/permissions.ts`)

The core permission system defines:
- Role permissions matrix
- Permission checking functions
- Navigation filtering
- React hooks for permission management

### 2. API Middleware (`src/lib/api-middleware.ts`)

Provides middleware functions for protecting API routes:
- `withPermission()` - Higher-order function for route protection
- `protectAPI()` - Wrapper for API handlers
- `canAccess()` - Permission checking utility
- Helper functions for role checking

### 3. Permission Guard Components (`src/components/PermissionGuard.tsx`)

React components for protecting UI elements:

#### PermissionGuard
```tsx
<PermissionGuard resource="posts" action="create" redirectTo="/dashboard">
  <CreatePostButton />
</PermissionGuard>
```

#### ShowIfCanAccess
```tsx
<ShowIfCanAccess resource="posts" action="create">
  <Link href="/dashboard/posts/new">
    <Button>Create Post</Button>
  </Link>
</ShowIfCanAccess>
```

#### PermissionButton
```tsx
<PermissionButton resource="posts" action="delete">
  <Button onClick={handleDelete}>Delete</Button>
</PermissionButton>
```

#### useCanAccess Hook
```tsx
const canCreatePosts = useCanAccess('posts', 'create')
```

### 4. API Route Protection

All API routes are protected with permission checks:

```typescript
// Example from posts API
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
  }

  const hasPermission = canAccess(session.user.role as UserRole, 'posts', 'create')
  if (!hasPermission) {
    return NextResponse.json({ 
      message: 'Insufficient permissions to create posts',
      userRole: session.user.role 
    }, { status: 403 })
  }
  
  // ... rest of the handler
}
```

## Usage Examples

### 1. Protecting Dashboard Pages

```tsx
// Wrap entire page components
export default withPermission(PostsPage, 'posts', 'read', '/dashboard')
```

### 2. Conditional UI Elements

```tsx
// Show/hide buttons based on permissions
<ShowIfCanAccess resource="users" action="create">
  <Button>Add User</Button>
</ShowIfCanAccess>

// Hide elements if user has permission
<HideIfCanAccess resource="settings" action="read">
  <div>You don't have access to settings</div>
</HideIfCanAccess>
```

### 3. Dynamic Navigation

The dashboard navigation automatically filters based on user permissions:

```tsx
// In dashboard layout
const navigation = getNavigationItems(user?.role as any)
```

### 4. API Route Protection

```tsx
// Protect individual API routes
export const POST = protectAPI(async (request) => {
  // Handler logic
}, { resource: 'posts', action: 'create' })
```

## Special Considerations

### 1. Author Post Ownership

AUTHOR role users can only access their own posts:
- API routes filter posts by `authorId` for AUTHOR role
- Individual post access is restricted to the post owner

### 2. Admin User Protection

The system prevents deletion of the last admin user to maintain system access.

### 3. Error Handling

All permission checks return appropriate HTTP status codes:
- `401` - Authentication required
- `403` - Insufficient permissions

## Testing Permissions

### 1. Test Different Roles

Create test users with different roles and verify:
- Navigation items shown/hidden correctly
- API endpoints return appropriate responses
- UI elements appear/disappear based on permissions

### 2. Test Edge Cases

- AUTHOR trying to access other users' posts
- Non-admin trying to access user management
- Last admin user deletion prevention

## Adding New Permissions

To add new permissions:

1. **Update Permission Matrix** (`src/lib/permissions.ts`):
```typescript
{
  resource: 'newResource',
  actions: ['create', 'read', 'update', 'delete']
}
```

2. **Protect API Routes**:
```typescript
const hasPermission = canAccess(userRole, 'newResource', 'create')
```

3. **Update UI Components**:
```tsx
<ShowIfCanAccess resource="newResource" action="create">
  <NewResourceButton />
</ShowIfCanAccess>
```

4. **Update Navigation**:
```typescript
// Add to getNavigationItems function
{ name: 'New Resource', href: '/dashboard/new-resource' }
```

## Security Best Practices

1. **Always check permissions on both client and server**
2. **Use the middleware functions for API protection**
3. **Test permission boundaries thoroughly**
4. **Log permission violations for security monitoring**
5. **Keep permission logic centralized in the permissions file**

This RBAC system provides a robust, scalable foundation for managing user access across the entire application.
