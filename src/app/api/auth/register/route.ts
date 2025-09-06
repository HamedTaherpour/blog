import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, username, email, password } = registerSchema.parse(body)

    // Check if email and username are not already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'This email is already registered' }, { status: 400 })
      }
      if (existingUser.username === username) {
        return NextResponse.json({ error: 'This username is already taken' }, { status: 400 })
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        image: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Registration successful',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 })
    }

    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
