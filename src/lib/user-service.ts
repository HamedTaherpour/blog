import { prisma } from '@/lib/prisma'

export interface User {
  id: string
  name: string | null
  username: string
  email: string
  role: 'AUTHOR' | 'EDITOR' | 'ADMIN'
  bio: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  name: string
  username: string
  email: string
  password: string
  role?: 'AUTHOR' | 'EDITOR' | 'ADMIN'
  bio?: string
}

export interface UpdateUserData {
  name?: string
  username?: string
  email?: string
  password?: string
  role?: 'AUTHOR' | 'EDITOR' | 'ADMIN'
  bio?: string
}

export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Get all users with pagination and filtering
export async function getUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  role?: string
): Promise<UsersResponse> {
  try {
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          bio: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    }
  }
}

// Get a single user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Create a new user
export async function createUser(data: CreateUserData): Promise<User> {
  try {
    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUsername) {
      throw new Error('Username already exists')
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingEmail) {
      throw new Error('Email already exists')
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        passwordHash,
        role: data.role || 'AUTHOR',
        bio: data.bio,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Update a user
export async function updateUser(id: string, data: UpdateUserData): Promise<User> {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw new Error('User not found')
    }

    // Check if username already exists (if being updated)
    if (data.username && data.username !== existingUser.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      })

      if (existingUsername) {
        throw new Error('Username already exists')
      }
    }

    // Check if email already exists (if being updated)
    if (data.email && data.email !== existingUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingEmail) {
        throw new Error('Email already exists')
      }
    }

    // Build update data
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.username !== undefined) updateData.username = data.username
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.bio !== undefined) updateData.bio = data.bio

    // Hash password if provided
    if (data.password) {
      const bcrypt = require('bcryptjs')
      updateData.passwordHash = await bcrypt.hash(data.password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        bio: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Delete a user
export async function deleteUser(id: string): Promise<void> {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      throw new Error('User not found')
    }

    // Prevent deleting the last admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })

      if (adminCount <= 1) {
        throw new Error('Cannot delete the last admin user')
      }
    }

    await prisma.user.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Get user statistics
export async function getUserStats(): Promise<{
  total: number
  byRole: Record<string, number>
}> {
  try {
    const [total, roleStats] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      }),
    ])

    const byRole = roleStats.reduce((acc, stat) => {
      acc[stat.role] = stat._count.role
      return acc
    }, {} as Record<string, number>)

    return { total, byRole }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return { total: 0, byRole: {} }
  }
}
