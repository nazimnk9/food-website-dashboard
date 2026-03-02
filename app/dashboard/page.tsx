'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  ResponsiveContainer,
  Cell,
} from 'recharts'
import Image from 'next/image'
import { getCookie } from '@/lib/auth'
import { getDashboardStats, getMe, getRecentOrders, Order } from '@/lib/services/dashboardService'
import { Skeleton } from '@/components/ui/skeleton'

// const revenueData = [
//   { month: 'Jan', revenue: 4500 },
//   { month: 'Feb', revenue: 5200 },
//   { month: 'Mar', revenue: 4800 },
//   { month: 'Apr', revenue: 6100 },
//   { month: 'May', revenue: 5900 },
//   { month: 'Jun', revenue: 7230 },
// ]

// const orderTrendData = [
//   { day: 'Mon', orders: 45 },
//   { day: 'Tue', orders: 52 },
//   { day: 'Wed', orders: 38 },
//   { day: 'Thu', orders: 65 },
//   { day: 'Fri', orders: 85 },
//   { day: 'Sat', orders: 110 },
//   { day: 'Sun', orders: 95 },
// ]

// const recentOrders = [
//   { id: '#ORD-001', customer: 'Ahmad Hassan', item: 'Margherita Pizza', price: 24.99, status: 'Delivered', time: '10 mins ago' },
//   { id: '#ORD-002', customer: 'Fatima Ali', item: 'Double Cheeseburger', price: 15.50, status: 'Cooking', time: '15 mins ago' },
//   { id: '#ORD-003', customer: 'Mohammed Khan', item: 'California Roll', price: 28.00, status: 'Pending', time: '20 mins ago' },
//   { id: '#ORD-004', customer: 'Zainab Ibrahim', item: 'Pesto Pasta', price: 18.50, status: 'Delivered', time: '25 mins ago' },
//   { id: '#ORD-005', customer: 'Omar Ahmed', item: 'Chicken Tikka', price: 22.00, status: 'Cancelled', time: '30 mins ago' },
// ]

// const topProducts = [
//   { name: 'Margherita Pizza', sales: 450, growth: '+12%', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=100&auto=format&fit=crop' },
//   { name: 'Double Cheeseburger', sales: 380, growth: '+8%', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=100&auto=format&fit=crop' },
//   { name: 'California Roll', sales: 320, growth: '+5%', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4111?q=80&w=100&auto=format&fit=crop' },
// ]

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState<{
    total_revenue: number;
    total_orders: number;
    active_menu: number;
  } | null>(null)
  const [recentOrdersData, setRecentOrdersData] = useState<Order[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'Admin'
    setUserEmail(email)

    const fetchData = async () => {
      try {
        // Fetch User Info using service
        const userData = await getMe()
        if (userData) {
          // Use first_name + last_name as the user name
          setUserName(userData.first_name + " " + userData.last_name || userData.username.split('@')[0])
        }

        // Fetch Dashboard Stats using service
        const statsData = await getDashboardStats()
        if (statsData) {
          setStats({
            total_revenue: statsData.total_revenue,
            total_orders: statsData.total_orders,
            active_menu: statsData.active_menu
          })
        }

        // Fetch Recent Orders using service
        setIsOrdersLoading(true)
        const ordersResponse = await getRecentOrders(1)
        if (ordersResponse && ordersResponse.results) {
          // Only show first 5 data
          setRecentOrdersData(ordersResponse.results.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsOrdersLoading(false)
      }
    }

    fetchData()
  }, [])


  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1 font-medium flex items-center whitespace-nowrap gap-1">
            Welcome back, <span className="text-blue-600 font-bold inline-flex items-center">
              {userName ? userName : (userEmail ? userEmail.split('@')[0] : <span className="h-4 w-24 bg-accent animate-pulse rounded-md" />)}
            </span>! Here&apos;s what&apos;s happening today.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="TOTAL REVENUE"
          value={stats ? `$${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : <Skeleton className="h-8 w-24 bg-white/20" />}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V7" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
          textColor="text-white"
          trendPositive={true}
          onClick={() => router.push('/dashboard/payments')}
        />
        <StatCard
          title="TOTAL ORDERS"
          value={stats ? stats.total_orders.toLocaleString() : <Skeleton className="h-8 w-24 bg-white/20" />}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-indigo-600 to-indigo-700"
          textColor="text-white"
          trendPositive={true}
          onClick={() => router.push('/dashboard/orders')}
        />
        <StatCard
          title="ACTIVE MENUS"
          value={stats ? stats.active_menu.toLocaleString() : <Skeleton className="h-8 w-24 bg-white/20" />}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-emerald-600 to-emerald-700"
          textColor="text-white"
          trendPositive={true}
          onClick={() => router.push('/dashboard/all-menus')}
        />
      </div>
      {/* <StatCard
          title="HAPPY CUSTOMERS"
          value="8.5k"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          bgColor="bg-gradient-to-br from-rose-600 to-rose-700"
          textColor="text-white"
          //trend="15%"
          trendPositive={true}
        /> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        {/* <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-400 font-medium">Monthly earnings from orders</p>
            </div>
            <select className="bg-gray-50 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="revenue" radius={[10, 10, 0, 0]} barSize={40}>
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? '#2563eb' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Orders Trend Chart */}
        {/* <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-gray-900">Weekly Orders</h2>
              <p className="text-sm text-gray-400 font-medium">Daily order volume trend</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                ACTIVE
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#2563eb"
                  strokeWidth={4}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 6, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <div>
              <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-400 font-medium">Monitor latest incoming orders</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/orders')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isOrdersLoading && recentOrdersData.length === 0 ? (
                  // Skeleton loader rows
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`}>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-12" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    </tr>
                  ))
                ) : (
                  recentOrdersData.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-gray-900">#ORD-{order.id}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-gray-900">User ID: {order.user || 'Guest'}</div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                        {order.items.length > 0 ? order.items[0].product.title : 'No Items'}
                        {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'processing' || order.status === 'cooking' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        {/* <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-black text-gray-900 mb-6">Top Selling Items</h2>
          <div className="space-y-6">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 group-hover:border-blue-100 transition-colors">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{product.sales} Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">{product.growth}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-sm font-black text-gray-400 hover:border-blue-200 hover:text-blue-600 transition-all">
            View Analytics
          </button>
        </div> */}
      </div>
    </div >
  )
}
