'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useContext, createContext, ReactNode } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  subItems?: { name: string; href: string; icon: React.ReactNode }[]
}

export const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}>({
  isCollapsed: false,
  setIsCollapsed: () => { },
})

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z" />
      </svg>
    ),
  },
  {
    name: 'Menu Items',
    href: '/dashboard/menu-items',
    icon: (
      <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
      </svg>
    ),
    subItems: [
      {
        name: 'Categories',
        href: '/dashboard/categories',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        )
      },
      {
        name: 'All Menus',
        href: '/dashboard/all-menus',
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
          </svg>
        )
      },
    ],
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: (
      <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: (
      <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Menu Items'])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    router.push('/login')
  }

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    )
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-lg"
        >
          {isMobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Sidebar Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-40 lg:z-0 border-r border-gray-800 ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
            } lg:translate-x-0 ${isCollapsed ? 'lg:w-24' : 'lg:w-64'}`}
        >
          {/* Logo Section */}
          <div className={`p-6 border-b border-white/50 flex items-center justify-center lg:justify-between ${isCollapsed && 'lg:justify-center'}`}>
            <Link href="/dashboard" className={`flex items-center flex-col lg:flex-row ${isCollapsed && 'lg:w-full lg:justify-center'} gap-3`}>
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Dawat Logo"
                  fill
                  className="object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="lg:block">
                  <h1 className="text-lg font-bold text-white uppercase tracking-wider">Dawat</h1>
                  <p className="text-[10px] text-gray-400 font-medium">Food Admin Panel</p>
                </div>
              )}
            </Link>

            {/* Collapse Button - Desktop/Tablet only */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors duration-200"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <svg className="w-5 h-5 ml-2 text-white font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const hasSubItems = item.subItems && item.subItems.length > 0
              const isExpanded = expandedMenus.includes(item.name)

              return (
                <div key={item.name} className="space-y-1">
                  {hasSubItems ? (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${isActive || isExpanded ? 'bg-gray-800/50 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        } ${isCollapsed && 'lg:justify-center'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex-shrink-0 ${isActive || isExpanded ? 'text-blue-500' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                        {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        } ${isCollapsed && 'lg:justify-center'}`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                      {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubItems && isExpanded && (
                    <div className={`${isCollapsed ? 'flex flex-col items-center gap-2 mt-2' : 'ml-9 space-y-1'}`}>
                      {item.subItems?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${pathname === subItem.href
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            } ${isCollapsed && 'justify-center p-2'}`}
                          title={isCollapsed ? subItem.name : ''}
                        >
                          <span className="flex-shrink-0">{subItem.icon}</span>
                          {!isCollapsed && <span>{subItem.name}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 space-y-2 border-t border-white/50">
            {/* Settings */}
            <Link
              href="/dashboard/settings"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${pathname === '/dashboard/settings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } ${isCollapsed && 'lg:justify-center'}`}
            >
              <span className={`flex-shrink-0 ${pathname === '/dashboard/settings' ? 'text-white' : 'group-hover:text-blue-400'}`}>
                <svg className="w-5 h-5 font-bold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94 0 .33.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </span>
              {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/10 hover:text-red-500 transition-all duration-200 ${isCollapsed && 'lg:justify-center'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Offset */}
        <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-64'}`} />
      </>
    </SidebarContext.Provider>
  )
}
