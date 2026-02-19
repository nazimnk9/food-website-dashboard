'use client'

import { useEffect, useContext, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar, { SidebarContext } from '@/components/sidebar'
import { getCookie } from '@/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isCollapsed } = useContext(SidebarContext)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const hasToken = getCookie('access_token')

    if (!isLoggedIn && !hasToken) {
      router.push('/login')
    }
  }, [router])

  // Get page title and description based on current route
  const getPageHeader = () => {
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          description: "Welcome to your admin panel. Here's an overview of your restaurant.",
        }
      case '/tours':
        return {
          title: 'Tours',
          description: 'Manage all your restaurant tours and experiences',
        }
      case '/bookings':
        return {
          title: 'Bookings',
          description: 'Manage all restaurant bookings and reservations',
        }
      case '/contact-requests':
        return {
          title: 'Contact Requests',
          description: 'Manage customer inquiries and requests',
        }
      case '/dashboard/categories':
        return {
          title: 'Categories',
          description: 'Manage food categories and menu sections',
        }
      case '/dashboard/all-menus':
        return {
          title: 'All Menus',
          description: 'Explore and manage all food menu items',
        }
      case '/dashboard/orders':
        return {
          title: 'Orders',
          description: 'Track and manage customer food orders',
        }
      case '/dashboard/payments':
        return {
          title: 'Payments',
          description: 'View and manage payment transactions',
        }
      case '/dashboard/settings':
        return {
          title: 'Settings',
          description: 'Manage your restaurant settings and preferences',
        }
      default:
        return {
          title: 'Admin Panel',
          description: 'Welcome to your admin panel',
        }
    }
  }

  const pageHeader = getPageHeader()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 w-full">
        {/* Mobile Header - Shows below hamburger menu (Hidden on dashboard as it has custom header) */}
        {pathname !== '/dashboard' && (
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 sm:p-6 sticky top-0 z-30 pt-16 lg:pt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{pageHeader.title}</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{pageHeader.description}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
