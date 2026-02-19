'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Notice {
  id: number
  title: string
  content: string
  date: string
  priority: 'Low' | 'Medium' | 'High'
  author: string
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      content: 'The booking system will be under maintenance on June 25, 2024 from 2:00 AM to 4:00 AM. Please plan accordingly.',
      date: 'Jun 22, 2024',
      priority: 'High',
      author: 'Admin',
    },
    {
      id: 2,
      title: 'New Menu Items Available',
      content: 'We are pleased to announce the addition of 5 new seasonal dishes to our menu. Please check the updated menu section.',
      date: 'Jun 20, 2024',
      priority: 'Medium',
      author: 'Chef Manager',
    },
    {
      id: 3,
      title: 'Staff Training Session',
      content: 'All staff members are required to attend the customer service training on June 28, 2024 at 10:00 AM.',
      date: 'Jun 18, 2024',
      priority: 'Medium',
      author: 'HR Department',
    },
    {
      id: 4,
      title: 'Summer Season Opening',
      content: 'Our new summer season tours are now available for booking. Limited slots available for the first 50 reservations.',
      date: 'Jun 15, 2024',
      priority: 'Low',
      author: 'Marketing Team',
    },
    {
      id: 5,
      title: 'Special Event - Ramadan Celebration',
      content: 'Special Ramadan menus and extended hours will be available. Book your table early for this special occasion.',
      date: 'Jun 10, 2024',
      priority: 'High',
      author: 'Management',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium' as const,
    author: '',
  })

  const handleAddNotice = () => {
    setEditingId(null)
    setFormData({ title: '', content: '', priority: 'Medium', author: '' })
    setShowModal(true)
  }

  const handleEditNotice = (notice: Notice) => {
    setEditingId(notice.id)
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      author: notice.author,
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    if (editingId) {
      setNotices(
        notices.map((notice) =>
          notice.id === editingId
            ? {
                ...notice,
                ...formData,
              }
            : notice
        )
      )
    } else {
      const newNotice: Notice = {
        id: Math.max(...notices.map((n) => n.id), 0) + 1,
        ...formData,
        date: today,
      }
      setNotices([newNotice, ...notices])
    }
    setShowModal(false)
  }

  const handleDeleteNotice = (id: number) => {
    setNotices(notices.filter((n) => n.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-l-4 border-red-500'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500'
      case 'Low':
        return 'bg-green-100 text-green-700 border-l-4 border-green-500'
      default:
        return 'bg-gray-100 text-gray-700 border-l-4 border-gray-500'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Hidden on mobile, shown in layout */}
      <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Notices</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Post and manage important announcements</p>
        </div>
        <Button
          onClick={handleAddNotice}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          + New Notice
        </Button>
      </div>

      {/* Mobile Add Button - Only visible on mobile */}
      <div className="lg:hidden flex gap-3">
        <Button
          onClick={handleAddNotice}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
        >
          + New Notice
        </Button>
      </div>

      {/* Notices List */}
      <div className="space-y-3 sm:space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 transition hover:shadow-xl ${getPriorityColor(notice.priority)}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{notice.title}</h3>
                <p className="text-xs sm:text-sm opacity-75 mb-3">
                  By {notice.author} • {notice.date}
                </p>
              </div>
              <span className="text-xs font-bold px-2 sm:px-3 py-1 rounded-full bg-white/30 whitespace-nowrap">
                {notice.priority} Priority
              </span>
            </div>

            <p className="mb-4 leading-relaxed text-sm sm:text-base">{notice.content}</p>

            <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-white/20">
              <button
                onClick={() => handleEditNotice(notice)}
                className="text-xs sm:text-sm font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteNotice(notice.id)}
                className="text-xs sm:text-sm font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {editingId ? 'Edit Notice' : 'New Notice'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
