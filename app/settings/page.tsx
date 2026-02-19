'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    restaurantName: 'Dawat Restaurant & Grill',
    email: 'contact@dawat.com',
    phone: '+966 50 123 4567',
    address: 'Downtown District, City Center',
    openingHours: '11:00 AM - 11:00 PM',
    currency: 'SAR',
    language: 'en',
    timezone: 'Asia/Riyadh',
  })

  const [saved, setSaved] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSettingsChange = (field: string, value: string) => {
    setSettings({ ...settings, [field]: value })
    setSaved(false)
  }

  const handleSaveSettings = () => {
    localStorage.setItem('restaurantSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    alert('Password changed successfully')
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="px-0 sm:px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your restaurant settings and preferences</p>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm sm:text-base">
          ✓ Settings saved successfully
        </div>
      )}

      {/* Restaurant Settings */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Restaurant Information</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => handleSettingsChange('restaurantName', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingsChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleSettingsChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleSettingsChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Hours
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) => handleSettingsChange('openingHours', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingsChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>SAR</option>
                <option>AED</option>
                <option>GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingsChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Asia/Riyadh</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
                <option>Asia/Dubai</option>
              </select>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Change Password
          </Button>
        </form>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">System Information</h2>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium text-sm sm:text-base">Version</span>
            <span className="text-gray-600 text-xs sm:text-sm">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium text-sm sm:text-base">Last Updated</span>
            <span className="text-gray-600 text-xs sm:text-sm">June 24, 2024</span>
          </div>
          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium text-sm sm:text-base">Database Status</span>
            <span className="flex items-center gap-2">
              <span className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></span>
              <span className="text-green-600 font-medium text-xs sm:text-sm">Connected</span>
            </span>
          </div>
          <div className="flex justify-between items-center py-2 sm:py-3">
            <span className="text-gray-700 font-medium text-sm sm:text-base">Backup Status</span>
            <span className="flex items-center gap-2">
              <span className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></span>
              <span className="text-green-600 font-medium text-xs sm:text-sm">Up to date</span>
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-4 sm:mb-6">Danger Zone</h2>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-red-700 text-sm sm:text-base">
            Be careful with these actions. They cannot be easily undone.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  )
}
