'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/auth'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const hasToken = getCookie('access_token')

    if (isLoggedIn || hasToken) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}
