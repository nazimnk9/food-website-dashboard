'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Booking {
  id: number
  guestName: string
  email: string
  phone: string
  date: string
  guests: number
  totalPrice: number
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  notes?: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      guestName: 'Ahmad Hassan',
      email: 'ahmad@example.com',
      phone: '+966 50 123 4567',
      date: 'Jun 15, 2024',
      guests: 4,
      totalPrice: 180,
      status: 'Confirmed',
      notes: 'Window seat requested',
    },
    {
      id: 2,
      guestName: 'Fatima Ali',
      email: 'fatima@example.com',
      phone: '+966 50 234 5678',
      date: 'Jun 18, 2024',
      guests: 6,
      totalPrice: 270,
      status: 'Pending',
      notes: 'Vegetarian menu needed',
    },
    {
      id: 3,
      guestName: 'Mohammed Khan',
      email: 'mohammed@example.com',
      phone: '+966 50 345 6789',
      date: 'Jun 20, 2024',
      guests: 8,
      totalPrice: 360,
      status: 'Confirmed',
      notes: 'Birthday celebration',
    },
    {
      id: 4,
      guestName: 'Zainab Ibrahim',
      email: 'zainab@example.com',
      phone: '+966 50 456 7890',
      date: 'Jun 22, 2024',
      guests: 2,
      totalPrice: 90,
      status: 'Confirmed',
      notes: '',
    },
    {
      id: 5,
      guestName: 'Omar Ahmed',
      email: 'omar@example.com',
      phone: '+966 50 567 8901',
      date: 'Jun 25, 2024',
      guests: 5,
      totalPrice: 225,
      status: 'Pending',
      notes: 'Late dinner preferred',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    totalPrice: '',
    status: 'Pending' as const,
    notes: '',
  })

  const handleAddBooking = () => {
    setEditingId(null)
    setFormData({
      guestName: '',
      email: '',
      phone: '',
      date: '',
      guests: '',
      totalPrice: '',
      status: 'Pending',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingId(booking.id)
    setFormData({
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      guests: booking.guests.toString(),
      totalPrice: booking.totalPrice.toString(),
      status: booking.status,
      notes: booking.notes || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setBookings(
        bookings.map((booking) =>
          booking.id === editingId
            ? {
                ...booking,
                ...formData,
                guests: parseInt(formData.guests),
                totalPrice: parseInt(formData.totalPrice),
              }
            : booking
        )
      )
    } else {
      const newBooking: Booking = {
        id: Math.max(...bookings.map((b) => b.id), 0) + 1,
        ...formData,
        guests: parseInt(formData.guests),
        totalPrice: parseInt(formData.totalPrice),
      }
      setBookings([...bookings, newBooking])
    }
    setShowModal(false)
  }

  const handleDeleteBooking = (id: number) => {
    setBookings(bookings.filter((b) => b.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Hidden on mobile, shown in layout */}
      <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage all restaurant bookings and reservations</p>
        </div>
        <Button
          onClick={handleAddBooking}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          + New Booking
        </Button>
      </div>

      {/* Mobile Add Button - Only visible on mobile */}
      <div className="lg:hidden flex gap-3">
        <Button
          onClick={handleAddBooking}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
        >
          + New Booking
        </Button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Guest Name</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700 hidden lg:table-cell">Phone</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Date</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Guests</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700 hidden md:table-cell">Price</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-2 sm:py-4 px-2 sm:px-6 font-medium text-gray-900">{booking.guestName}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600 text-xs hidden sm:table-cell">{booking.email}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600 text-xs hidden lg:table-cell">{booking.phone}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600">{booking.date}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600">{booking.guests}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-900 hidden md:table-cell">${booking.totalPrice}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6">
                    <div className="flex gap-1 sm:gap-2 flex-col sm:flex-row">
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {editingId ? 'Edit Booking' : 'New Booking'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <input
                  type="number"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price ($)</label>
                <input
                  type="number"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
