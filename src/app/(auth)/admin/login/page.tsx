"use client"

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

const Page = () => {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Μη έγκυρο email ή κωδικός πρόσβασης')
        toast.error('Μη έγκυρο email ή κωδικός πρόσβασης')
      } else {
        toast.success('Συνδέθηκε επιτυχώς')
        router.push('/dashboard')
      }
    } catch {
      setError('Η σύνδεση απέτυχε. Παρακαλώ δοκιμάστε ξανά.')
      toast.error('Η σύνδεση απέτυχε. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="container">

      <div className="mx-auto max-w-md space-y-6 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Σύνδεση Διαχειριστή
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Συνδεθείτε για να αποκτήσετε πρόσβαση στον πίνακα διαχείρισης
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">
              Διεύθυνση Email
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              className="mt-1"
              required
            />
          </Field>

        <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Κωδικός Πρόσβασης</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Εισάγετε τον κωδικό πρόσβασής σας"
                className="mt-1 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </Field>

          <ButtonPrimary
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Συνδέομαι...
              </>
            ) : (
              'Σύνδεση'
            )}
          </ButtonPrimary>
        </form>

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Μόνο πρόσβαση διαχειριστή. Επικοινωνήστε με τον διαχειριστή συστήματος για τη δημιουργία λογαριασμού.
        </div>
      </div>
    </div>
  )
}
export default Page

