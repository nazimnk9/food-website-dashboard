'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    // Simulate login - in production, this would call an API
    setTimeout(() => {
      if (email && password.length >= 6) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', email)
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative w-16 sm:w-20 h-16 sm:h-20">
            <Image
              src="/logo.png"
              alt="Dawat Restaurant Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-1 sm:mb-2">
          Admin Panel
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Sign in to manage your restaurant
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.604-3.368A9.957 9.957 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.079 10.079 0 01-9.542 7c-4.477 0-8.268-2.943-9.543-7m0 0a3 3 0 117.364 7.364m9.364-7.364l-3.536 3.536" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p className="text-xs mt-2">Email: demo@example.com</p>
          <p className="text-xs">Password: demo123</p>
        </div>
      </div>
    </div>
  )
}
