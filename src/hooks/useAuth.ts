import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

export const useAuth = () => {
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        username: session.user.username,
        role: session.user.role,
        image: session.user.image,
      }
    : null

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success('Signed out successfully')

      window.location.href = '/'
    } catch (error) {
      toast.error('Sign out failed')
    }
  }

  return {
    // User data
    user,
    session,

    // Status
    isAuthenticated,
    isLoading,
    status,

    // Actions
    handleLogout,
  }
}
