'use client'

import { useState } from 'react'
import Image from 'next/image'

const menuItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        category: 'Italian Pizza',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500&auto=format&fit=crop',
        rating: 4.8,
        status: 'In Stock',
        description: 'Classic tomato sauce, fresh mozzarella, and aromatic basil leaves on a thin, crispy crust.'
    },
    {
        id: 2,
        name: 'Double Cheeseburger',
        category: 'Gourmet Burgers',
        price: 15.50,
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=500&auto=format&fit=crop',
        rating: 4.9,
        status: 'In Stock',
        description: 'Two juicy Angus beef patties topped with melted cheddar, crisp lettuce, and our secret house sauce.'
    },
    {
        id: 3,
        name: 'California Roll',
        category: 'Fresh Sushi',
        price: 14.00,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4111?q=80&w=500&auto=format&fit=crop',
        rating: 4.5,
        status: 'Out of Stock',
        description: 'Delicate crab meat, creamy avocado, and refreshing cucumber rolled in premium vinegared rice.'
    },
    {
        id: 4,
        name: 'Chocolate Lava Cake',
        category: 'Deserts',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=500&auto=format&fit=crop',
        rating: 4.7,
        status: 'In Stock',
        description: 'Decadent warm chocolate cake with a gooey, molten center, served with a side of vanilla ice cream.'
    },
    {
        id: 5,
        name: 'Pesto Pasta',
        category: 'Italian',
        price: 13.50,
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500&auto=format&fit=crop',
        rating: 4.6,
        status: 'In Stock',
        description: 'Al dente linguine tossed in fresh basil pesto with toasted pine nuts and shaved parmesan.'
    },
    {
        id: 6,
        name: 'Chicken Tikka',
        category: 'Indian',
        price: 16.25,
        image: 'https://images.unsplash.com/photo-1567188040759-fbba1883dbde?q=80&w=500&auto=format&fit=crop',
        rating: 4.9,
        status: 'In Stock',
        description: 'Tender pieces of chicken marinated in yogurt and spices, grilled to smoky perfection in a clay oven.'
    }
]

export default function AllMenusPage() {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Signature Dishes</h1>
                    <p className="text-gray-500 mt-1 font-medium">Explore and curate your restaurant's culinary offerings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 w-64 shadow-sm"
                        />
                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Menu
                    </button>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                    >
                        {/* Image Container */}
                        <div className="relative h-64 w-full overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Overlay Blur for Status */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Tags */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {item.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${item.status === 'In Stock'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>

                            {/* Rating Tag */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs font-bold text-gray-900">{item.rating}</span>
                            </div>

                            {/* Price Bottom Label */}
                            <div className="absolute bottom-4 right-4">
                                <span className="text-2xl font-black text-white drop-shadow-lg">
                                    ${item.price.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors duration-200">
                                {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-[40px] mb-6">
                                {item.description}
                            </p>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-3">
                                <button className="flex flex-col items-center justify-center p-3 text-blue-600 hover:bg-blue-600 hover:text-white border-2 border-blue-50 rounded-2xl transition-all duration-300 group/btn" title="View Details">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Details</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 text-green-600 hover:bg-green-600 hover:text-white border-2 border-green-50 rounded-2xl transition-all duration-300 group/btn" title="Edit Item">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Edit</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 text-red-600 hover:bg-red-600 hover:text-white border-2 border-red-50 rounded-2xl transition-all duration-300 group/btn" title="Delete Item">
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
