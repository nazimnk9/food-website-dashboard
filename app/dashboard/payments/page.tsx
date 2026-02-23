'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getTransactions, Transaction, getTransactionById } from '@/lib/paymentService'
import { getOrderById, Order } from '@/lib/orderService'

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    // Modal States
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(false)

    const fetchTransactions = useCallback(async (page: number) => {
        try {
            setIsLoading(true)
            const data = await getTransactions(page)
            setTransactions(data.results)
            setTotalTransactions(data.count)
            setError(null)
        } catch (err: any) {
            console.error('Fetch transactions error:', err)
            setError(err.detail || 'Failed to fetch transactions. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTransactions(currentPage)
    }, [fetchTransactions, currentPage])

    const handleTransactionClick = async (id: number) => {
        try {
            setIsModalLoading(true)
            setIsTransactionModalOpen(true)
            const data = await getTransactionById(id)
            setSelectedTransaction(data)
        } catch (err) {
            console.error('Error fetching transaction:', err)
        } finally {
            setIsModalLoading(false)
        }
    }

    const handleOrderClick = async (id: number) => {
        try {
            setIsModalLoading(true)
            setIsOrderModalOpen(true)
            const data = await getOrderById(id)
            setSelectedOrder(data)
        } catch (err) {
            console.error('Error fetching order:', err)
        } finally {
            setIsModalLoading(false)
        }
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
        switch (status.toUpperCase()) {
            case 'COMPLETED':
            case 'SUCCESS':
            case 'PAID':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100'
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-100'
            case 'FAILED':
            case 'ERROR':
                return 'bg-rose-50 text-rose-700 border-rose-100'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }

    const getOrderStatusStyles = (status: string) => {
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

    if (isLoading && transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse">Loading transaction data...</p>
            </div>
        )
    }

    if (error && transactions.length === 0) {
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
                    onClick={() => fetchTransactions(currentPage)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Payment Transactions</h1>
                    <p className="text-gray-500 mt-3 font-medium text-lg">
                        Showing <span className="text-blue-600 font-bold">{totalTransactions}</span> total financial transactions.
                    </p>
                </div>
                <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-blue-600/20">
                    <span className="text-xs uppercase tracking-widest opacity-80">Success Rate:</span>
                    <span className="text-xl">~100%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2rem] transition-all hover:shadow-lg hover:shadow-emerald-500/5 group">
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-3 group-hover:translate-x-1 transition-transform">Total Processed</p>
                    <div className="flex items-end gap-2">
                        <h2 className="text-3xl font-black text-emerald-900 leading-none">${transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</h2>
                        <span className="text-emerald-600 font-bold text-sm mb-0.5">USD</span>
                    </div>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[2rem] transition-all hover:shadow-lg hover:shadow-amber-500/5 group">
                    <p className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-3 group-hover:translate-x-1 transition-transform">Pending Amount</p>
                    <div className="flex items-end gap-2">
                        <h2 className="text-3xl font-black text-amber-900 leading-none">${transactions.filter(t => t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</h2>
                        <span className="text-amber-600 font-bold text-sm mb-0.5">USD</span>
                    </div>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 p-8 rounded-[2rem] transition-all hover:shadow-lg hover:shadow-rose-500/5 group">
                    <p className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] mb-3 group-hover:translate-x-1 transition-transform">Failed/Other</p>
                    <div className="flex items-end gap-2">
                        <h2 className="text-3xl font-black text-rose-900 leading-none">0</h2>
                        <span className="text-rose-600 font-bold text-sm mb-0.5">USD</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Order ID</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Stripe Session</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                    <td className="px-8 py-8">
                                        <button
                                            onClick={() => handleTransactionClick(transaction.id)}
                                            className="text-sm font-bold text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-lg border border-gray-200/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 cursor-pointer block"
                                        >
                                            #TRANS-{transaction.id}
                                        </button>
                                    </td>
                                    <td className="px-8 py-8">
                                        {transaction.order ? (
                                            <button
                                                onClick={() => handleOrderClick(transaction.order!)}
                                                className="text-sm font-bold text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-lg border border-gray-200/50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all active:scale-95 cursor-pointer"
                                            >
                                                ORD-{transaction.order}
                                            </button>
                                        ) : (
                                            <span className="text-sm font-bold text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1 max-w-[200px]">
                                            <span className="text-[11px] font-mono text-gray-400 truncate" title={transaction.stripe_session_id}>
                                                {transaction.stripe_session_id}
                                            </span>
                                            <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">Digital Checkout</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-800 tracking-tight">{formatDate(transaction.created_at).split(',')[0]}</span>
                                            <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tight">{formatDate(transaction.created_at).split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-end gap-1">
                                            <span className="text-lg font-black text-gray-900 tracking-tighter">${transaction.amount}</span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{transaction.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className={`inline-flex px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] border ${getStatusStyles(transaction.status)} shadow-sm shadow-black/5`}>
                                            {transaction.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest">No transactions found</p>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsTransactionModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {isModalLoading ? (
                            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                <p className="text-gray-500 font-bold">Fetching details...</p>
                            </div>
                        ) : selectedTransaction && (
                            <div className="p-6 sm:p-8 md:p-12">
                                <div className="flex justify-between items-start mb-6 sm:mb-10 group">
                                    <div>
                                        <div className={`inline-flex px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] border ${getStatusStyles(selectedTransaction.status)} mb-3 sm:mb-4`}>
                                            {selectedTransaction.status}
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Transaction Details</h2>
                                        <p className="text-gray-400 font-bold mt-1 sm:mt-2 uppercase tracking-widest text-[10px] sm:text-xs">Reference: #TRANS-{selectedTransaction.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsTransactionModalOpen(false)}
                                        className="p-2 sm:p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-10 p-6 sm:p-8 bg-gray-50/50 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100">
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Checkout Method</p>
                                        <p className="text-xs sm:text-sm font-black text-gray-900">Stripe Digital Payment</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Stripe Session ID</p>
                                        <p className="text-[10px] sm:text-[11px] font-mono text-blue-600 break-all">{selectedTransaction.stripe_session_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Total Amount</p>
                                        <p className="text-xl sm:text-2xl font-black text-gray-900 leading-none tracking-tighter">
                                            ${selectedTransaction.amount} <span className="text-xs text-gray-400 ml-1">{selectedTransaction.currency.toUpperCase()}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Transaction Date</p>
                                        <p className="text-xs sm:text-sm font-black text-gray-900">{formatDate(selectedTransaction.created_at)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between p-4 sm:p-6 bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Associated User</p>
                                                <p className="text-xs sm:text-sm font-black text-gray-900">{selectedTransaction.user ? `User Account #${selectedTransaction.user}` : selectedTransaction.guest_user ? `Guest User #${selectedTransaction.guest_user}` : 'Anonymous Checkout'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Status</p>
                                            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-tight">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Order Details Modal (Reuse premium design from Orders Dashboard) */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-4xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                        {isModalLoading ? (
                            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                                <p className="text-gray-500 font-bold">Loading Order Details...</p>
                            </div>
                        ) : selectedOrder && (
                            <>
                                <div className="p-6 sm:p-8 md:p-10 border-b border-gray-100 bg-gray-50/30">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] border ${getOrderStatusStyles(selectedOrder.status)}`}>
                                                    {selectedOrder.status}
                                                </div>
                                                <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest italic">ORD-{selectedOrder.id}</span>
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">Order Analysis</h2>
                                            <p className="text-gray-500 font-medium mt-2 sm:mt-3 text-sm sm:text-base">Detailed breakdown of the customer's selection and address.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsOrderModalOpen(false)}
                                            className="p-3 sm:p-4 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-gray-900 rounded-xl sm:rounded-2xl transition-all active:scale-95 cursor-pointer flex-shrink-0"
                                        >
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 md:space-y-10 custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                        <div className="p-6 sm:p-8 bg-blue-50/30 rounded-[1.5rem] sm:rounded-[2rem] border border-blue-100/50">
                                            <h3 className="text-[10px] sm:text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Shipping Address
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-base sm:text-lg font-black text-gray-900 tracking-tight">{selectedOrder.address?.street}</p>
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] sm:text-xs">
                                                    {selectedOrder.address?.city}, {selectedOrder.address?.zip_code}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-6 sm:p-8 bg-indigo-50/30 rounded-[1.5rem] sm:rounded-[2rem] border border-indigo-100/50">
                                            <h3 className="text-[10px] sm:text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Customer Intel
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Active Diner</p>
                                                <p className="text-indigo-600 font-black text-[11px] sm:text-[13px] uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
                                                    Paid via {selectedOrder.payment_type}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Order Items ({selectedOrder.items.length})
                                        </h3>
                                        <div className="space-y-3 sm:space-y-4">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl hover:border-blue-200 transition-all group shadow-sm">
                                                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                                                        {item.product.images?.[0] ? (
                                                            <img src={item.product.images[0].image} alt={item.product.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm sm:text-lg font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors uppercase truncate">{item.product.title}</h4>
                                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] sm:text-[13px] truncate">{item.product.category?.[0]?.title || 'Menu Item'}</p>
                                                    </div>
                                                    <div className="hidden sm:block text-right whitespace-nowrap">
                                                        <p className="text-lg font-black text-gray-900 tracking-tight">${item.price}</p>
                                                        <p className="text-blue-600 font-black text-[13px] tracking-widest">x{item.quantity}</p>
                                                    </div>
                                                    <div className="hidden sm:block h-10 w-[1px] bg-gray-100 mx-2" />
                                                    <div className="text-right whitespace-nowrap min-w-[80px] sm:min-w-[100px]">
                                                        <p className="text-base sm:text-lg font-black text-blue-600 tracking-tight">${item.total_price}</p>
                                                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Subtotal {item.quantity > 1 && <span className="sm:hidden">(x{item.quantity})</span>}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 md:p-10 bg-gray-900/95 border-t border-white/10 backdrop-blur-md">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                                        <div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Financial Settlement</p>
                                            <p className="text-base sm:text-lg font-medium text-blue-400/80">Order #{selectedOrder.id} finalized</p>
                                        </div>
                                        <div className="text-right w-full sm:w-auto">
                                            <p className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Grand Total</p>
                                            <div className="flex items-end justify-end gap-2">
                                                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white leading-none">${selectedOrder.total_amount}</span>
                                                <span className="text-xs sm:text-sm font-black text-blue-500 mb-0.5 sm:mb-1 tracking-widest">USD</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
