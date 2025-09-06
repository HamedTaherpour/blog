"use client"

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const Page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Successful registration - show toast and redirect to login
      toast.success('Registration successful! Please sign in.')
      router.push("/login")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed"
      setError(message)
      toast.error(message)
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
      <div className="my-16 flex justify-center">
        <Logo />
      </div>

      <div className="mx-auto max-w-md space-y-6 pb-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Join our community and start sharing your stories
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Full Name</Label>
            <Input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name" 
              className="mt-1" 
              required
            />
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Username</Label>
            <Input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username" 
              className="mt-1" 
              required
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Only letters, numbers, and underscores allowed
            </p>
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">Email address</Label>
            <Input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@example.com" 
              className="mt-1" 
              required
            />
          </Field>

          <Field className="block">
            <Label className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
              Password
            </Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 characters"
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </ButtonPrimary>
        </form>

        <div className="text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account? {` `}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
