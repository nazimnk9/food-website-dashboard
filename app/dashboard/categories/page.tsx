'use client'

import { useState } from 'react'
import Image from 'next/image'

const categories = [
    {
        id: 1,
        name: 'Italian Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop',
        itemsCount: 12,
        status: 'Active',
        description: 'Authentic stone-baked pizzas with variety of toppings.'
    },
    {
        id: 2,
        name: 'Gourmet Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
        itemsCount: 8,
        status: 'Active',
        description: 'Juicy Angus beef burgers with premium ingredients.'
    },
    {
        id: 3,
        name: 'Fresh Sushi',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop',
        itemsCount: 15,
        status: 'Inactive',
        description: 'Traditional Japanese sushi and sashimi collections.'
    },
    {
        id: 4,
        name: 'Deserts & Sweets',
        image: 'https://images.unsplash.com/photo-1551024601-bec78acc702b?q=80&w=500&auto=format&fit=crop',
        itemsCount: 10,
        status: 'Active',
        description: 'Delicious cakes, pastries and frozen treats.'
    }
]

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Food Categories</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage and organize your food items into categories.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    Add New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-48 w-full group">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {category.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-xs text-blue-600 font-semibold mb-3">{category.itemsCount} Items</p>
                            <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-5">
                                {category.description}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <button className="flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors duration-200" title="View Details">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                                <button className="flex items-center justify-center p-2 text-green-600 hover:bg-green-50 border border-green-200 rounded-lg transition-colors duration-200" title="Edit">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors duration-200" title="Delete">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
