'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Tour {
  id: number
  name: string
  destination: string
  date: string
  price: number
  capacity: number
  booked: number
  guide: string
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([
    {
      id: 1,
      name: 'City Heritage Tour',
      destination: 'Downtown District',
      date: 'Jun 15, 2024',
      price: 45,
      capacity: 20,
      booked: 16,
      guide: 'Ahmad Hassan',
    },
    {
      id: 2,
      name: 'Traditional Food Tour',
      destination: 'Old Market',
      date: 'Jun 18, 2024',
      price: 55,
      capacity: 15,
      booked: 12,
      guide: 'Fatima Ali',
    },
    {
      id: 3,
      name: 'Desert Adventure',
      destination: 'Desert Valley',
      date: 'Jun 20, 2024',
      price: 75,
      capacity: 10,
      booked: 8,
      guide: 'Mohammed Khan',
    },
    {
      id: 4,
      name: 'Beach & Sunset',
      destination: 'Coastal Beach',
      date: 'Jun 22, 2024',
      price: 50,
      capacity: 25,
      booked: 18,
      guide: 'Zainab Ibrahim',
    },
    {
      id: 5,
      name: 'Mountain Hiking',
      destination: 'Mountain Range',
      date: 'Jun 25, 2024',
      price: 65,
      capacity: 12,
      booked: 10,
      guide: 'Omar Ahmed',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    date: '',
    price: '',
    capacity: '',
    guide: '',
  })

  const handleAddTour = () => {
    setEditingId(null)
    setFormData({ name: '', destination: '', date: '', price: '', capacity: '', guide: '' })
    setShowModal(true)
  }

  const handleEditTour = (tour: Tour) => {
    setEditingId(tour.id)
    setFormData({
      name: tour.name,
      destination: tour.destination,
      date: tour.date,
      price: tour.price.toString(),
      capacity: tour.capacity.toString(),
      guide: tour.guide,
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setTours(
        tours.map((tour) =>
          tour.id === editingId
            ? {
                ...tour,
                ...formData,
                price: parseInt(formData.price),
                capacity: parseInt(formData.capacity),
              }
            : tour
        )
      )
    } else {
      const newTour: Tour = {
        id: Math.max(...tours.map((t) => t.id), 0) + 1,
        ...formData,
        price: parseInt(formData.price),
        capacity: parseInt(formData.capacity),
        booked: 0,
      }
      setTours([...tours, newTour])
    }
    setShowModal(false)
  }

  const handleDeleteTour = (id: number) => {
    setTours(tours.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Hidden on mobile, shown in layout */}
      <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage all your restaurant tours and experiences</p>
        </div>
        <Button
          onClick={handleAddTour}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          + Add New Tour
        </Button>
      </div>

      {/* Mobile Add Button - Only visible on mobile */}
      <div className="lg:hidden flex gap-3">
        <Button
          onClick={handleAddTour}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
        >
          + Add New Tour
        </Button>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Tour Name</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Destination</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Date</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Price</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Capacity</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700 hidden md:table-cell">Guide</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-2 sm:py-4 px-2 sm:px-6 font-medium text-gray-900">{tour.name}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600">{tour.destination}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600 text-xs sm:text-sm">{tour.date}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-900">${tour.price}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6">
                    <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                      {tour.booked}/{tour.capacity}
                    </span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600 hidden md:table-cell">{tour.guide}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6">
                    <div className="flex gap-1 sm:gap-2 flex-col sm:flex-row">
                      <button
                        onClick={() => handleEditTour(tour)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour.id)}
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
              {editingId ? 'Edit Tour' : 'Add New Tour'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Tour Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guide Name</label>
                <input
                  type="text"
                  value={formData.guide}
                  onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
