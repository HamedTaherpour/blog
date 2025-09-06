import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email: string
      username: string
      role: string
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email: string
    username: string
    role: string
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    username: string
  }
}
