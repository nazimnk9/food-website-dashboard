'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getProductById, Product } from '@/lib/productService'

export default function ProductDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeImage, setActiveImage] = useState<string>('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const data = await getProductById(id)
                setProduct(data)
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0].image)
                    setCurrentIndex(0)
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch product details')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!product?.images || product.images.length === 0) return
        const nextIndex = (currentIndex + 1) % product.images.length
        setCurrentIndex(nextIndex)
        setActiveImage(product.images[nextIndex].image)
    }

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (!product?.images || product.images.length === 0) return
        const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length
        setCurrentIndex(prevIndex)
        setActiveImage(product.images[prevIndex].image)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Dish Details...</p>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Dish Not Found</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">{error || 'The dish you are looking for might have been removed.'}</p>
                    <Link href="/dashboard/all-menus" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Menu
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-12">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
                        <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/dashboard/all-menus" className="hover:text-blue-600 transition-colors">All Menus</Link>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-blue-600">Product Details</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
                        {product.title}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/all-menus" className="flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-gray-300 transition-all active:scale-95 shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Image Gallery */}
                <div className="lg:col-span-7 space-y-6">
                    <div
                        className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-2xl group border-8 border-white cursor-zoom-in"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={product.title}
                                fill
                                className="object-fixed transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-300">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-2xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/30"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-2xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/30"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Status Badges on Image */}
                        <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none">
                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-xl border-2 ${product.status === 'active'
                                ? 'bg-green-600/90 text-white border-green-400/50'
                                : 'bg-red-600/90 text-white border-red-400/50'
                                }`}>
                                {product.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            {product.is_popular && (
                                <span className="bg-yellow-500/90 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border-2 border-yellow-300/50 backdrop-blur-xl">
                                    Popular Choice
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex flex-wrap gap-4 px-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => {
                                        setActiveImage(img.image)
                                        setCurrentIndex(index)
                                    }}
                                    className={`relative w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${activeImage === img.image ? 'border-blue-600 shadow-lg scale-105' : 'border-white opacity-60 grayscale-[50%]'
                                        }`}
                                >
                                    <Image
                                        src={img.image}
                                        alt="Dish view"
                                        fill
                                        className="object-fixed"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="lg:col-span-5 space-y-10">
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100 space-y-10">
                        {/* Price & Description */}
                        <div className="space-y-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-blue-600 tracking-tight">
                                    €{parseFloat(product.price).toFixed(2)}
                                </span>
                                <span className="text-sm font-black text-gray-300 uppercase tracking-widest">Euro</span>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 underline decoration-2 decoration-blue-100 underline-offset-8">Description</h4>
                                <p className="text-gray-600 leading-relaxed font-medium text-lg break-all">
                                    {product.description || 'No description available for this dish.'}
                                </p>
                            </div>
                        </div>

                        {/* Categories */}
                        {product.category && product.category.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categories</h4>
                                <div className="flex flex-wrap gap-3">
                                    {product.category.map((cat) => (
                                        <div key={cat.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 pl-2 pr-5 py-2 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 group">
                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-inner group-hover:scale-110 transition-transform">
                                                <Image
                                                    src={cat.image || '/placeholder-category.png'}
                                                    alt={cat.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-700">{cat.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tags & Flavors</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span key={tag.id} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors duration-300">
                                            {tag.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata Footer */}
                        <div className="pt-8 border-t border-gray-50 grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Created</p>
                                <p className="text-xs font-bold text-gray-600">{new Date(product.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Last Updated</p>
                                <p className="text-xs font-bold text-gray-600">{new Date(product.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && product.images && product.images.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-2xl"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative w-full max-w-6xl aspect-[4/3] mx-4" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={product.images[currentIndex].image}
                            alt={product.title}
                            fill
                            className="object-contain"
                        />

                        {product.images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-6 rounded-[2rem] transition-all hover:scale-110 active:scale-95 border border-white/20"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-6 rounded-[2rem] transition-all hover:scale-110 active:scale-95 border border-white/20"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <p className="text-white/80 font-black uppercase tracking-[0.3em] text-[10px]">
                                {currentIndex + 1} / {product.images.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
