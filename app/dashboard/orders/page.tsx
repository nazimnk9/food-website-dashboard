'use client'

import { useState, useEffect, useCallback } from 'react'
import { getOrders, updateOrderStatus, Order, OrderItem } from '@/lib/orderService'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const [error, setError] = useState<string | null>(null)

    // Details Modal
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    // Cancellation Modal
    const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false)
    const [cancellationReason, setCancellationReason] = useState('')
    const [orderToCancel, setOrderToCancel] = useState<number | null>(null)

    // Alert Dialog state
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        isSuccess: false,
    })

    const fetchOrders = useCallback(async (page: number) => {
        try {
            setIsLoading(true)
            const data = await getOrders(page)
            setOrders(data.results)
            setTotalOrders(data.count)
        } catch (err: any) {
            console.error('Fetch orders error:', err)
            setError(err.detail || 'Failed to fetch orders. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOrders(currentPage)
    }, [fetchOrders, currentPage])

    const handleStatusChange = async (orderId: number, newStatus: string, reason: string | null = null) => {
        try {
            setIsUpdatingStatus(orderId)
            await updateOrderStatus(orderId, newStatus, reason)

            // Update local state
            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus, cancelled_reason: reason } : order
            ))

            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, status: newStatus, cancelled_reason: reason } : null)
            }

            // Refresh list from API
            fetchOrders(currentPage)

            setAlertConfig({
                isOpen: true,
                title: 'Status Updated',
                description: `Order #${orderId} status changed to ${newStatus}.`,
                isSuccess: true,
            })
        } catch (err: any) {
            console.error('Update status error:', err)
            setAlertConfig({
                isOpen: true,
                title: 'Update Failed',
                description: err.detail || 'Failed to update order status.',
                isSuccess: false,
            })
        } finally {
            setIsUpdatingStatus(null)
        }
    }

    const openDetails = (order: Order) => {
        setSelectedOrder(order)
        setIsDetailsOpen(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-600 border-amber-100'
            case 'processing':
                return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'shipped':
                return 'bg-indigo-50 text-indigo-600 border-indigo-100'
            case 'delivered':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'cancelled':
                return 'bg-rose-50 text-rose-600 border-rose-100'
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100'
        }
    }

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse">Loading amazing orders...</p>
            </div>
        )
    }

    if (error && orders.length === 0) {
        return (
            <div className="p-8 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center max-w-md mx-auto mt-20">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 font-medium mb-8">{error}</p>
                <button
                    onClick={() => fetchOrders(currentPage)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Order Management</h1>
                    <p className="text-gray-500 mt-3 font-medium text-lg">
                        You have <span className="text-blue-600 font-bold">{totalOrders}</span> total orders in your system.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => fetchOrders(currentPage)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all cursor-pointer group"
                        title="Refresh Data"
                    >
                        <svg className={`w-5 h-5 group-active:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin text-blue-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <div className="h-6 w-[1.5px] bg-gray-100" />
                    <div className="flex gap-1">
                        <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase tracking-wider">
                            Pending: {orders.filter(o => o.status === 'pending').length}
                        </span>
                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-wider">
                            Active: {orders.filter(o => o.status === 'processing').length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Orders Listing */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Order Info</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Items & Summary</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Customer & Address</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Payment</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                                            <p className="text-gray-400 font-medium italic">When customers place orders, they will appear here in real-time.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2 group-hover:text-blue-600 transition-colors">
                                                    #ORD-{order.id}
                                                </span>
                                                <span className="text-xs font-bold text-gray-400 tabular-nums uppercase tracking-wider">
                                                    {formatDate(order.created_at)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex -space-x-2 overflow-hidden mb-1">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                                            <Image
                                                                src={item.product?.images?.[0]?.image || '/placeholder-food.jpg'}
                                                                alt={item.product?.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-blue-600">
                                                            +{order.items.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 font-medium truncate max-w-[200px]">
                                                    {order.items.map(i => i.product?.title || 'Unknown Product').join(', ')}
                                                </p>
                                                <span className="text-blue-600 font-black text-lg tabular-nums">
                                                    ${parseFloat(order.total_amount).toFixed(2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                        </svg>
                                                    </div>
                                                    <span className="font-bold text-gray-700 text-sm">Customer #{order.user || 'Guest'}</span>
                                                </div>
                                                {order.address ? (
                                                    <div className="flex items-start gap-2 max-w-[220px]">
                                                        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                                            {order.address.street}, {order.address.city}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300 italic font-medium">No address provided</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.payment_type === 'online' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {order.payment_type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === 'cancelled') {
                                                            setOrderToCancel(order.id);
                                                            setCancellationReason('');
                                                            setIsCancellationModalOpen(true);
                                                        } else {
                                                            handleStatusChange(order.id, val);
                                                        }
                                                    }}
                                                    disabled={isUpdatingStatus === order.id}
                                                    className={`appearance-none px-4 py-2 pr-10 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all outline-none cursor-pointer disabled:opacity-50 disabled:cursor-wait ${getStatusStyles(order.status)}`}
                                                    style={{
                                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'right 12px center',
                                                        backgroundSize: '12px'
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                {isUpdatingStatus === order.id && (
                                                    <div className="w-4 h-4 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin shrink-0" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <button
                                                onClick={() => openDetails(order)}
                                                className="bg-white hover:bg-blue-600 hover:text-white text-blue-600 px-5 py-2.5 rounded-xl border-2 border-blue-50 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/5 transition-all active:scale-95 cursor-pointer"
                                            >
                                                Order Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                {totalOrders > orders.length && (
                    <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Showing {orders.length} of {totalOrders} orders
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                disabled={orders.length < 10}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-2xl rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0 bg-[#F9FAFB]">
                    {selectedOrder && (
                        <div className="flex flex-col max-h-[90vh]">
                            <div className="p-8 bg-white border-b border-gray-50">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h2>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusStyles(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 font-bold tabular-nums uppercase tracking-widest">
                                            #ORD-{selectedOrder.id} • {formatDate(selectedOrder.created_at)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsDetailsOpen(false)}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all cursor-pointer"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Details</p>
                                        <p className="font-bold text-gray-900">User ID: #{selectedOrder.user || 'Guest'}</p>
                                        <p className="text-sm text-gray-500 font-medium">Payment: {selectedOrder.payment_type.toUpperCase()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Address</p>
                                        {selectedOrder.address ? (
                                            <p className="text-sm text-gray-700 font-bold leading-snug">
                                                {selectedOrder.address.street},<br />
                                                {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip_code}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic font-medium">No address specified</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Order Items ({selectedOrder.items.length})</p>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                                                    <Image
                                                        src={item.product?.images?.[0]?.image || '/placeholder-food.jpg'}
                                                        alt={item.product?.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-gray-900 truncate">{item.product?.title}</h4>
                                                    <p className="text-xs text-blue-600 font-bold">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-gray-900 tracking-tight">${parseFloat(item.total_price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white border-t border-gray-50">
                                <div className="flex justify-between items-center bg-blue-600 p-6 rounded-[2rem] shadow-xl shadow-blue-600/30">
                                    <p className="text-white/60 font-black uppercase tracking-widest text-xs">Total Amount Paid</p>
                                    <p className="text-3xl font-black text-white tracking-tighter tabular-nums">${parseFloat(selectedOrder.total_amount).toFixed(2)}</p>
                                </div>

                                {selectedOrder.status === 'cancelled' && selectedOrder.cancelled_reason && (
                                    <div className="mt-6 p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
                                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Cancellation Reason</p>
                                        <p className="text-rose-600 font-bold text-sm italic">"{selectedOrder.cancelled_reason}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Cancellation Reason Modal */}
            <Dialog open={isCancellationModalOpen} onOpenChange={setIsCancellationModalOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-8 bg-white">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cancel Order</h2>
                            <p className="text-gray-500 font-medium mt-1">Please provide a reason for cancelling order <span className="text-rose-500 font-bold">#ORD-{orderToCancel}</span></p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Reason for cancellation</label>
                            <textarea
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                placeholder="E.g. Customer changed mind, Out of stock..."
                                className="w-full h-32 px-6 py-4 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-rose-100 focus:bg-white transition-all outline-none text-gray-700 font-bold placeholder:text-gray-300 resize-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsCancellationModalOpen(false)}
                                className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                                Nevermind
                            </button>
                            <button
                                onClick={async () => {
                                    if (orderToCancel) {
                                        await handleStatusChange(orderToCancel, 'cancelled', cancellationReason);
                                        setIsCancellationModalOpen(false);
                                    }
                                }}
                                disabled={!cancellationReason.trim() || isUpdatingStatus === orderToCancel}
                                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isUpdatingStatus === orderToCancel ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Alert Feedback Dialog */}
            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-sm text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${alertConfig.isSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                        {alertConfig.isSuccess ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-gray-900 tracking-tight mb-2 leading-none">{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 font-medium">
                            {alertConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8">
                        <AlertDialogAction
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-none shadow-xl transition-all active:scale-95 cursor-pointer ${alertConfig.isSuccess ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"}`}
                        >
                            Got it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
