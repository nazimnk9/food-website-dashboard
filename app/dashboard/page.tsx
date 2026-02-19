'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '@/components/stat-card'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const toursData = [
  { month: 'Jan', tours: 4 },
  { month: 'Feb', tours: 3 },
  { month: 'Mar', tours: 8 },
  { month: 'Apr', tours: 6 },
  { month: 'May', tours: 9 },
  { month: 'Jun', tours: 12 },
]

const bookingsData = [
  { month: 'Jan', bookings: 2 },
  { month: 'Feb', bookings: 2 },
  { month: 'Mar', bookings: 5 },
  { month: 'Apr', bookings: 4 },
  { month: 'May', bookings: 7 },
  { month: 'Jun', bookings: 9 },
]

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const [stats, setStats] = useState({
    bookings: 24,
    income: 4800,
    requests: 8,
    clients: 156,
  })

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'Admin'
    setUserEmail(email)
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header - Shown on all devices */}
      <div className="px-0 sm:px-2 pt-12 lg:pt-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome to your admin panel. Here's an overview of your restaurant.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="BOOKINGS"
          value={stats.bookings}
          icon={
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
          }
          bgColor="bg-orange-500"
          textColor="text-white"
          trend="12%"
          trendPositive={true}
        />
        <StatCard
          title="TOTAL INCOME"
          value={`$${stats.income.toLocaleString()}`}
          icon={
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
            </svg>
          }
          bgColor="bg-green-500"
          textColor="text-white"
          trend="8%"
          trendPositive={true}
        />
        <StatCard
          title="CLIENT REQUESTS"
          value={stats.requests}
          icon={
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm13 8H6v-2h13v2zm0-4H6v-2h13v2z" />
            </svg>
          }
          bgColor="bg-blue-600"
          textColor="text-white"
          trend="5%"
          trendPositive={false}
        />
        <StatCard
          title="TOTAL CLIENTS"
          value={stats.clients}
          icon={
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          }
          bgColor="bg-purple-600"
          textColor="text-white"
          trend="15%"
          trendPositive={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Tours Created Chart */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Tours Created</h2>
          <ResponsiveContainer width="100%" height={250} className="!text-xs sm:!text-sm">
            <BarChart data={toursData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="tours" radius={[8, 8, 0, 0]}>
                {toursData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#ff6b35" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Trend Chart */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={250} className="!text-xs sm:!text-sm">
            <LineChart data={bookingsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#ff6b35"
                strokeWidth={3}
                dot={{ fill: '#ff6b35', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Guest Name</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Guests</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Ahmad Hassan', date: 'Jun 15, 2024', guests: 4, status: 'Confirmed' },
                { name: 'Fatima Ali', date: 'Jun 18, 2024', guests: 6, status: 'Pending' },
                { name: 'Mohammed Khan', date: 'Jun 20, 2024', guests: 8, status: 'Confirmed' },
                { name: 'Zainab Ibrahim', date: 'Jun 22, 2024', guests: 2, status: 'Confirmed' },
                { name: 'Omar Ahmed', date: 'Jun 25, 2024', guests: 5, status: 'Pending' },
              ].map((booking, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 sm:py-4 px-2 sm:px-4 text-gray-900 font-medium">{booking.name}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 text-gray-600">{booking.date}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 text-gray-600">{booking.guests}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
