import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Return user data (password will be handled by NextAuth)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 })
    }

    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
