'use client'

const orders = [
    {
        id: '#ORD-7521',
        customer: 'Ahmad Hassan',
        items: ['Margherita Pizza x2', 'Coke x1'],
        total: 32.50,
        status: 'Delivered',
        date: 'Jun 18, 2024 12:45 PM',
        type: 'Delivery'
    },
    {
        id: '#ORD-7522',
        customer: 'Fatima Ali',
        items: ['Double Cheeseburger x1', 'French Fries x1'],
        total: 18.00,
        status: 'Processing',
        date: 'Jun 18, 2024 01:15 PM',
        type: 'Takeaway'
    },
    {
        id: '#ORD-7523',
        customer: 'Mohammed Khan',
        items: ['California Roll x2', 'Miso Soup x2'],
        total: 42.00,
        status: 'Pending',
        date: 'Jun 18, 2024 01:30 PM',
        type: 'Delivery'
    },
    {
        id: '#ORD-7524',
        customer: 'Zainab Ibrahim',
        items: ['Chocolate Lava Cake x3'],
        total: 26.97,
        status: 'Cancelled',
        date: 'Jun 18, 2024 10:00 AM',
        type: 'Delivery'
    },
    {
        id: '#ORD-7525',
        customer: 'Omar Ahmed',
        items: ['Garden Salad x1', 'Steam Rice x1'],
        total: 15.50,
        status: 'Delivered',
        date: 'Jun 17, 2024 08:30 PM',
        type: 'Dining'
    }
]

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Keep track of all customer orders and their current status.</p>
                </div>
                <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Active: {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed: {orders.filter(o => o.status === 'Delivered').length}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900">{order.id}</span>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{order.date}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.customer}</td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[150px]">
                                            <p className="text-sm text-gray-600 truncate">{order.items.join(', ')}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-blue-600">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{order.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">Details</button>
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
