'use client'

import { useState } from 'react'

interface ContactRequest {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  status: 'New' | 'Replied' | 'Resolved'
}

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 555 123 4567',
      subject: 'Catering Inquiry',
      message: 'Interested in catering services for a corporate event',
      date: 'Jun 20, 2024',
      status: 'New',
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
      subject: 'Private Event Booking',
      message: 'Looking to book the restaurant for a wedding celebration',
      date: 'Jun 18, 2024',
      status: 'Replied',
    },
    {
      id: 3,
      name: 'Maria Garcia',
      email: 'maria@example.com',
      phone: '+34 91 123 4567',
      subject: 'Menu Customization',
      message: 'Requesting special menu for dietary restrictions',
      date: 'Jun 15, 2024',
      status: 'Resolved',
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 555 234 5678',
      subject: 'Group Tour Reservation',
      message: 'Need to book a group tour for 30 people',
      date: 'Jun 12, 2024',
      status: 'Replied',
    },
    {
      id: 5,
      name: 'Fatima Al-Rashid',
      email: 'fatima@example.com',
      phone: '+966 50 234 5678',
      subject: 'Special Request',
      message: 'Inquiring about private dining arrangements',
      date: 'Jun 10, 2024',
      status: 'New',
    },
  ])

  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')

  const handleReply = () => {
    if (selectedRequest && replyMessage.trim()) {
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: 'Replied' as const } : req
        )
      )
      setShowReplyModal(false)
      setReplyMessage('')
      setSelectedRequest(null)
    }
  }

  const handleResolve = (id: number) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'Resolved' as const } : req
      )
    )
  }

  const handleDelete = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700'
      case 'Replied':
        return 'bg-purple-100 text-purple-700'
      case 'Resolved':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Hidden on mobile, shown in layout */}
      <div className="hidden lg:block px-0 sm:px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Contact Requests</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage customer inquiries and requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">New Requests</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
            {requests.filter((r) => r.status === 'New').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Replied</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">
            {requests.filter((r) => r.status === 'Replied').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Resolved</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {requests.filter((r) => r.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700 hidden md:table-cell">Date</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-2 sm:py-4 px-2 sm:px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-2 sm:py-4 px-2 sm:px-6 font-medium text-gray-900">{request.name}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600 text-xs hidden sm:table-cell">{request.email}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600">{request.subject}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6 text-gray-600 text-xs hidden md:table-cell">{request.date}</td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-6">
                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowReplyModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm whitespace-nowrap"
                      >
                        Reply
                      </button>
                      {request.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolve(request.id)}
                          className="text-green-600 hover:text-green-800 font-medium text-xs sm:text-sm whitespace-nowrap"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(request.id)}
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

      {/* Request Details Modal */}
      {selectedRequest && showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Request Details</h2>

            {/* Request Info */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-gray-900 font-semibold">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-gray-900">{selectedRequest.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Subject</p>
                <p className="text-gray-900 font-semibold">{selectedRequest.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Message</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.message}</p>
              </div>
            </div>

            {/* Reply Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Reply</h3>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setSelectedRequest(null)
                    setReplyMessage('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
