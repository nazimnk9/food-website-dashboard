'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProducts, createProduct, updateProduct, getProductById, Product, ProductsResponse, CreateProductData, uploadProductImage, deleteProductImage, getProductImages, ImageUploadResponse } from '@/lib/productService'
import { getCategories, Category } from '@/lib/categoryService'
import { getTags, Tag } from '@/lib/tagService'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function AllMenusPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [itemsPerPage] = useState(40) // Based on the API response sample (40 items in results)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState<CreateProductData>({
        title: '',
        price: '',
        description: '',
        is_popular: false,
        status: 'active'
    })

    // Image Upload State
    const [isUploading, setIsUploading] = useState(false)
    const [previewImages, setPreviewImages] = useState<ImageUploadResponse[]>([])
    const [currentImageIds, setCurrentImageIds] = useState<number[]>([])

    // Category State
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

    // Tag State
    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    // Update Modal State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)
    const [isUpdatingImage, setIsUpdatingImage] = useState(false)
    const [editingProductId, setEditingProductId] = useState<number | null>(null)
    const [updateFormData, setUpdateFormData] = useState<CreateProductData>({
        title: '',
        price: '',
        description: '',
        is_popular: false,
        status: 'active'
    })
    const [updateSelectedCategoryIds, setUpdateSelectedCategoryIds] = useState<number[]>([])
    const [updateSelectedTagIds, setUpdateSelectedTagIds] = useState<number[]>([])
    const [updateCurrentImageIds, setUpdateCurrentImageIds] = useState<number[]>([])

    // Alert Dialog State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        isSuccess: false,
    })

    const fetchProducts = async (page: number) => {
        setLoading(true)
        try {
            const data: ProductsResponse = await getProducts(page)
            setProducts(data.results)
            setTotalCount(data.count)
            setError(null)
        } catch (err) {
            setError('Failed to load products. Please try again later.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchPreviewImages = async () => {
        try {
            const data = await getProductImages()
            setPreviewImages(data.results)
        } catch (err) {
            console.error('Error fetching images:', err)
        }
    }

    const fetchCategories = async () => {
        try {
            const data = await getCategories()
            setCategories(data.results)
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    const fetchTags = async () => {
        try {
            const data = await getTags()
            setTags(data.results)
        } catch (err) {
            console.error('Error fetching tags:', err)
        }
    }

    useEffect(() => {
        fetchProducts(currentPage)
        // Load IDs from local storage
        const savedImageIds = localStorage.getItem('pending_image_ids')
        if (savedImageIds) {
            setCurrentImageIds(JSON.parse(savedImageIds))
        }

        const savedCategoryIds = localStorage.getItem('pending_category_ids')
        if (savedCategoryIds) {
            setSelectedCategoryIds(JSON.parse(savedCategoryIds))
        }

        const savedTagIds = localStorage.getItem('pending_tag_ids')
        if (savedTagIds) {
            setSelectedTagIds(JSON.parse(savedTagIds))
        }

        fetchPreviewImages()
        fetchCategories()
        fetchTags()
    }, [currentPage])

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev: number) => prev - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev: number) => prev + 1)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        const newIds = [...currentImageIds]

        try {
            for (let i = 0; i < files.length; i++) {
                const response = await uploadProductImage(files[i])
                newIds.push(response.id)
                setPreviewImages(prev => [...prev, response])
            }

            setCurrentImageIds(newIds)
            localStorage.setItem('pending_image_ids', JSON.stringify(newIds))
        } catch (err: any) {
            console.error('Upload error:', err)
            let errorMessage = 'Failed to upload images.'
            if (err.detail) {
                errorMessage = err.detail
            } else if (err.image && Array.isArray(err.image)) {
                errorMessage = err.image.join(' ')
            }
            setAlertConfig({
                isOpen: true,
                title: 'Upload Error',
                description: errorMessage,
                isSuccess: false,
            })
        } finally {
            setIsUploading(false)
            // Clear input
            e.target.value = ''
        }
    }

    const handleDeleteImage = async (id: number) => {
        try {
            await deleteProductImage(id)
            const newIds = currentImageIds.filter(itemId => itemId !== id)
            setCurrentImageIds(newIds)
            setPreviewImages(prev => prev.filter(img => img.id !== id))
            localStorage.setItem('pending_image_ids', JSON.stringify(newIds))
        } catch (err: any) {
            console.error('Delete error:', err)
            setAlertConfig({
                isOpen: true,
                title: 'Delete Error',
                description: err.detail || 'Failed to delete image.',
                isSuccess: false,
            })
        }
    }

    const handleCreateMenu = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        try {
            await createProduct({
                ...formData,
                price: formData.price ? formData.price.toString() : null,
                images_ids: currentImageIds,
                category_ids: selectedCategoryIds,
                tags_ids: selectedTagIds
            })

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Menu created successfully!',
                isSuccess: true,
            })

            setIsModalOpen(false)
            setFormData({
                title: '',
                price: '',
                description: '',
                is_popular: false,
                status: 'active'
            })
            // Clear IDs
            setCurrentImageIds([])
            setSelectedCategoryIds([])
            setSelectedTagIds([])
            localStorage.removeItem('pending_image_ids')
            localStorage.removeItem('pending_category_ids')
            localStorage.removeItem('pending_tag_ids')
            fetchProducts(currentPage)
        } catch (err: any) {
            console.error('Error creating product:', err)
            let errorMessage = 'Failed to create menu item.\n'
            if (typeof err === 'object' && err !== null) {
                if (err.detail) {
                    errorMessage += `\nError: ${err.detail}`
                } else {
                    Object.entries(err).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            errorMessage += `\n${key}: ${value.join(', ')}`
                        }
                    })
                }
            }

            setAlertConfig({
                isOpen: true,
                title: 'Error',
                description: errorMessage,
                isSuccess: false,
            })
        } finally {
            setIsCreating(false)
        }
    }

    const handleUpdateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUpdatingImage(true)
        const newIds = [...updateCurrentImageIds]

        try {
            for (let i = 0; i < files.length; i++) {
                const response = await uploadProductImage(files[i])
                newIds.push(response.id)
                setPreviewImages(prev => [...prev, response])
            }
            setUpdateCurrentImageIds(newIds)
        } catch (err: any) {
            console.error('Update upload error:', err)
            setAlertConfig({
                isOpen: true,
                title: 'Upload Error',
                description: err.detail || 'Failed to upload images.',
                isSuccess: false,
            })
        } finally {
            setIsUpdatingImage(false)
            e.target.value = ''
        }
    }

    const handleUpdateDeleteImage = async (id: number) => {
        try {
            await deleteProductImage(id)
            setUpdateCurrentImageIds(prev => prev.filter(itemId => itemId !== id))
            setPreviewImages(prev => prev.filter(img => img.id !== id))
        } catch (err: any) {
            console.error('Update delete error:', err)
            setAlertConfig({
                isOpen: true,
                title: 'Delete Error',
                description: err.detail || 'Failed to delete image.',
                isSuccess: false,
            })
        }
    }

    const handleEditClick = async (productId: number) => {
        setEditingProductId(productId)
        try {
            const product = await getProductById(productId)
            setUpdateFormData({
                title: product.title,
                price: product.price,
                description: product.description,
                is_popular: product.is_popular,
                status: product.status
            })
            setUpdateSelectedCategoryIds(product.category.map(cat => cat.id))
            setUpdateSelectedTagIds(product.tags.map(tag => tag.id))
            setUpdateCurrentImageIds(product.images.map(img => img.id))

            // First ensure global images are loaded for selection
            await fetchPreviewImages()

            // Then ensure product's specific images are merged into the preview state
            // so they definitely show up even if they aren't in the initial page of global images
            setPreviewImages(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newImages = product.images
                    .filter(img => !existingIds.has(img.id))
                    .map(img => ({
                        id: img.id,
                        image: img.image,
                        created_at: img.created_at,
                        updated_at: img.updated_at
                    }));
                return [...prev, ...newImages];
            });

            setIsUpdateModalOpen(true)
        } catch (err) {
            console.error('Error fetching product for edit:', err)
            setAlertConfig({
                isOpen: true,
                title: 'Error',
                description: 'Failed to fetch product details for editing.',
                isSuccess: false,
            })
        }
    }

    const handleUpdateMenu = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingProductId) return
        setIsUpdatingProduct(true)

        try {
            await updateProduct(editingProductId, {
                ...updateFormData,
                price: updateFormData.price ? updateFormData.price.toString() : null,
                images_ids: updateCurrentImageIds,
                category_ids: updateSelectedCategoryIds,
                tags_ids: updateSelectedTagIds,
                status: updateFormData.status
            })

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Menu item updated successfully!',
                isSuccess: true,
            })

            setIsUpdateModalOpen(false)
            fetchProducts(currentPage)
        } catch (err: any) {
            console.error('Update error:', err)
            let errorMessage = 'Failed to update menu item.'
            if (typeof err === 'object' && err !== null) {
                if (err.detail) {
                    errorMessage = err.detail
                } else {
                    const errors = []
                    for (const [key, value] of Object.entries(err)) {
                        errors.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    }
                    if (errors.length > 0) errorMessage = errors.join('\n')
                }
            }
            setAlertConfig({
                isOpen: true,
                title: 'Error',
                description: errorMessage,
                isSuccess: false,
            })
        } finally {
            setIsUpdatingProduct(false)
        }
    }

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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Menu
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium">
                    {error}
                </div>
            ) : (
                <>
                    {/* Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                                    {item.images && item.images.length > 0 ? (
                                        <Image
                                            src={item.images[0].image}
                                            alt={item.title}
                                            fill
                                            className="object-fixed group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    {/* Overlay Blur for Status */}
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                        {/* Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-md transition-all duration-300 ${item.status === 'active'
                                            ? 'bg-green-500/90 text-white border border-green-400/50'
                                            : 'bg-red-500/90 text-white border border-red-400/50'
                                            }`}>
                                            {item.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>

                                        {/* Popular Badge */}
                                        {item.is_popular && (
                                            <span className="bg-yellow-500/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-yellow-400/50 backdrop-blur-md">
                                                Popular
                                            </span>
                                        )}
                                    </div>

                                    {/* Categories & Tags Grid (Overlay on Image Hover) */}
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-6 space-y-4">
                                        {item.category && item.category.length > 0 && (
                                            <div className='mt-8'>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Categories</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.category.map(cat => (
                                                        <span key={cat.id} className="bg-white/20 text-white px-2 py-1 rounded-lg text-[10px] font-bold border border-white/10">
                                                            {cat.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {item.tags && item.tags.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tags</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tags.map(tag => (
                                                        <span key={tag.id} className="bg-blue-500/40 text-blue-100 px-2 py-1 rounded-lg text-[10px] font-bold border border-blue-400/20">
                                                            {tag.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Price Bottom Label */}
                                    <div className="absolute bottom-4 right-4">
                                        <span className="text-2xl font-black text-white drop-shadow-lg">
                                            ${parseFloat(item.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors duration-200">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate leading-relaxed h-[40px] mb-6">
                                        {item.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <Link href={`/dashboard/all-menus/${item.id}`}>
                                            <button className="flex flex-col items-center justify-center p-3 text-blue-600 hover:bg-blue-600 hover:text-white border-2 border-blue-50 rounded-2xl transition-all duration-300 group/btn w-full" title="View Details">
                                                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity">Details</span>
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleEditClick(item.id)}
                                            className="flex flex-col items-center justify-center p-3 text-green-600 hover:bg-green-600 hover:text-white border-2 border-green-50 rounded-2xl transition-all duration-300 group/btn"
                                            title="Edit Item"
                                        >
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

                    {/* Pagination Controls */}
                    <div className="flex flex-col items-center gap-6 mt-12 pb-8">
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-xl border-2 transition-all duration-200 ${currentPage === 1
                                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'border-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first, last, current, and pages around current
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                    : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-blue-200'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === currentPage - 2 ||
                                        pageNum === currentPage + 2
                                    ) {
                                        return <span key={pageNum} className="text-gray-400">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-xl border-2 transition-all duration-200 ${currentPage === totalPages
                                    ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'border-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="text-sm font-medium text-gray-500">
                            Page <span className="text-blue-600 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            Total <span className="text-gray-900 font-bold">{totalCount}</span> items
                        </div>
                    </div>
                </>
            )}

            {/* Create Menu Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-transparent">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Create New Menu</h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Add a new signature dish to your collection.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white rounded-2xl transition-colors shadow-sm border border-gray-100 group"
                            >
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreateMenu} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Dish Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Traditional Beef Biryani"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Popular Choice?</label>
                                    <div className="flex items-center gap-3 ml-1">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, is_popular: !formData.is_popular })}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.is_popular ? 'bg-blue-600' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${formData.is_popular ? 'translate-x-[1.65rem]' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className={`text-sm font-black uppercase tracking-wider ${formData.is_popular ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {formData.is_popular ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Stock status (On/Off)</label>
                                    <div className="flex items-center gap-3 ml-1">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.status === 'active' ? 'bg-green-600' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${formData.status === 'active' ? 'translate-x-[1.65rem]' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className={`text-sm font-black uppercase tracking-wider ${formData.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                                            {formData.status === 'active' ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Categories (Select Multiple)</label>
                                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-2xl custom-scrollbar border-2 border-transparent focus-within:border-blue-500 transition-all duration-200">
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-all duration-200 group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedCategoryIds.includes(category.id)}
                                                onChange={(e) => {
                                                    let newIds;
                                                    if (e.target.checked) {
                                                        newIds = [...selectedCategoryIds, category.id];
                                                    } else {
                                                        newIds = selectedCategoryIds.filter(id => id !== category.id);
                                                    }
                                                    setSelectedCategoryIds(newIds);
                                                    localStorage.setItem('pending_category_ids', JSON.stringify(newIds));
                                                }}
                                            />
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{category.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tags (Select Multiple)</label>
                                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-2xl custom-scrollbar border-2 border-transparent focus-within:border-blue-500 transition-all duration-200">
                                    {tags.map((tag) => (
                                        <label key={tag.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-all duration-200 group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedTagIds.includes(tag.id)}
                                                onChange={(e) => {
                                                    let newIds;
                                                    if (e.target.checked) {
                                                        newIds = [...selectedTagIds, tag.id];
                                                    } else {
                                                        newIds = selectedTagIds.filter(id => id !== tag.id);
                                                    }
                                                    setSelectedTagIds(newIds);
                                                    localStorage.setItem('pending_tag_ids', JSON.stringify(newIds));
                                                }}
                                            />
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{tag.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Dish Images</label>
                                <div className="mt-2 flex flex-wrap gap-4">
                                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {isUploading ? (
                                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                    </label>

                                    {previewImages
                                        .filter(img => currentImageIds.includes(img.id))
                                        .map((img) => (
                                            <div key={img.id} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                                                <Image
                                                    src={img.image}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteImage(img.id)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-100 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Describe the flavors, ingredients, and soul of the dish..."
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200 resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-200"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {isCreating ? 'Creating...' : 'Create Menu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Update Menu Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-gradient-to-r from-green-50/50 to-transparent">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Update Menu</h2>
                                <p className="text-gray-500 text-sm font-medium mt-1">Refine your dish details and presentation.</p>
                            </div>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="p-2 hover:bg-white rounded-2xl transition-colors shadow-sm border border-gray-100 group"
                            >
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdateMenu} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Dish Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Traditional Beef Biryani"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200"
                                    value={updateFormData.title}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200"
                                        value={updateFormData.price || ''}
                                        onChange={(e) => setUpdateFormData({ ...updateFormData, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Popular Choice?</label>
                                    <div className="flex items-center gap-3 ml-1">
                                        <button
                                            type="button"
                                            onClick={() => setUpdateFormData({ ...updateFormData, is_popular: !updateFormData.is_popular })}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${updateFormData.is_popular ? 'bg-blue-600' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${updateFormData.is_popular ? 'translate-x-[1.65rem]' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className={`text-sm font-black uppercase tracking-wider ${updateFormData.is_popular ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {updateFormData.is_popular ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Stock status (On/Off)</label>
                                    <div className="flex items-center gap-3 ml-1">
                                        <button
                                            type="button"
                                            onClick={() => setUpdateFormData({ ...updateFormData, status: updateFormData.status === 'active' ? 'inactive' : 'active' })}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${updateFormData.status === 'active' ? 'bg-green-600' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${updateFormData.status === 'active' ? 'translate-x-[1.65rem]' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className={`text-sm font-black uppercase tracking-wider ${updateFormData.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                                            {updateFormData.status === 'active' ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Categories (Select Multiple)</label>
                                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-2xl custom-scrollbar border-2 border-transparent focus-within:border-green-500 transition-all duration-200">
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-all duration-200 group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={updateSelectedCategoryIds.includes(category.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUpdateSelectedCategoryIds([...updateSelectedCategoryIds, category.id]);
                                                    } else {
                                                        setUpdateSelectedCategoryIds(updateSelectedCategoryIds.filter(id => id !== category.id));
                                                    }
                                                }}
                                            />
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{category.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tags (Select Multiple)</label>
                                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-2xl custom-scrollbar border-2 border-transparent focus-within:border-green-500 transition-all duration-200">
                                    {tags.map((tag) => (
                                        <label key={tag.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-all duration-200 group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={updateSelectedTagIds.includes(tag.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUpdateSelectedTagIds([...updateSelectedTagIds, tag.id]);
                                                    } else {
                                                        setUpdateSelectedTagIds(updateSelectedTagIds.filter(id => id !== tag.id));
                                                    }
                                                }}
                                            />
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{tag.title}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Dish Images</label>
                                <div className="mt-2 flex flex-wrap gap-4">
                                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {isUpdatingImage ? (
                                                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleUpdateImageUpload}
                                            disabled={isUpdatingImage}
                                        />
                                    </label>

                                    {previewImages
                                        .filter(img => updateCurrentImageIds.includes(img.id))
                                        .map((img) => (
                                            <div key={img.id} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                                                <Image
                                                    src={img.image}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateDeleteImage(img.id)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-100 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Describe the flavors, ingredients, and soul of the dish..."
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200 resize-none"
                                    value={updateFormData.description}
                                    onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-200"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingProduct}
                                    className="flex-[2] px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-green-600/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdatingProduct && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {isUpdatingProduct ? 'Updating...' : 'Update Menu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Alert Feedback Dialog */}
            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open: boolean) => setAlertConfig(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className={alertConfig.isSuccess ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
