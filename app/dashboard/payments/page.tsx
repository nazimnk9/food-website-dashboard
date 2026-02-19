'use client'

const payments = [
    { id: '#PAY-9901', orderId: '#ORD-7521', method: 'Credit Card', date: 'Jun 18, 2024', amount: 32.50, status: 'Completed' },
    { id: '#PAY-9902', orderId: '#ORD-7522', method: 'PayPal', date: 'Jun 18, 2024', amount: 18.00, status: 'Completed' },
    { id: '#PAY-9903', orderId: '#ORD-7523', method: 'Cash on Delivery', date: 'Jun 18, 2024', amount: 42.00, status: 'Pending' },
    { id: '#PAY-9904', orderId: '#ORD-7524', method: 'Apple Pay', date: 'Jun 18, 2024', amount: 26.97, status: 'Failed' },
    { id: '#PAY-9905', orderId: '#ORD-7525', method: 'Credit Card', date: 'Jun 17, 2024', amount: 15.50, status: 'Completed' },
]

export default function PaymentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Transactions</h1>
                    <p className="text-sm text-gray-600 mt-1">Monitor and manage all financial transactions across your restaurant.</p>
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <span className="text-xs uppercase opacity-75">Total Revenue:</span>
                    <span>$4,800.00</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Success Payments</p>
                    <h2 className="text-3xl font-black text-green-900">84%</h2>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl">
                    <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Pending Clearance</p>
                    <h2 className="text-3xl font-black text-yellow-900">$240.50</h2>
                </div>
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Refunded Amount</p>
                    <h2 className="text-3xl font-black text-red-900">$45.00</h2>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{payment.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 underline decoration-blue-200 underline-offset-4">{payment.orderId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{payment.method}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{payment.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-blue-600">${payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${payment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {payment.status}
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
