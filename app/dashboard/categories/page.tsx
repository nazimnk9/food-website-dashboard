'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/categoryService'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Update Modal state
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [updateTitle, setUpdateTitle] = useState('')
    const [updateSelectedImage, setUpdateSelectedImage] = useState<File | null>(null)
    const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null)
    const [isImageRemoved, setIsImageRemoved] = useState(false)

    // Delete Modal state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

    // Alert state
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        isSuccess: false,
    })

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getCategories()
            setCategories(data.results)
        } catch (err: any) {
            setError(err.detail || 'Failed to load categories.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    // Cleanup preview URL on unmount or change
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }
            if (updateImagePreview) {
                URL.revokeObjectURL(updateImagePreview)
            }
        }
    }, [imagePreview, updateImagePreview])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isUpdate: boolean = false) => {
        const file = e.target.files?.[0] || null
        if (isUpdate) {
            setUpdateSelectedImage(file)
            setIsImageRemoved(false)
            if (file) {
                const previewUrl = URL.createObjectURL(file)
                setUpdateImagePreview(previewUrl)
            } else {
                setUpdateImagePreview(null)
            }
        } else {
            setSelectedImage(file)
            if (file) {
                const previewUrl = URL.createObjectURL(file)
                setImagePreview(previewUrl)
            } else {
                setImagePreview(null)
            }
        }
    }

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append('title', newTitle)
            if (selectedImage) {
                formData.append('image', selectedImage)
            }

            await createCategory(formData)

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Category created successfully!',
                isSuccess: true,
            })
            setIsDialogOpen(false)
            setNewTitle('')
            setSelectedImage(null)
            setImagePreview(null)
            fetchCategories()
        } catch (err: any) {
            let errorMessage = 'Failed to create category.'
            if (err.title && Array.isArray(err.title)) {
                errorMessage = err.title.join(' ')
            } else if (err.detail) {
                errorMessage = err.detail
            }
            setAlertConfig({
                isOpen: true,
                title: 'Error',
                description: errorMessage,
                isSuccess: false,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setUpdateTitle(category.title)
        setUpdateImagePreview(category.image)
        setUpdateSelectedImage(null)
        setIsImageRemoved(false)
        setIsUpdateDialogOpen(true)
    }

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCategory) return

        try {
            setIsSubmitting(true)
            const formData = new FormData()
            let hasChanges = false

            if (updateTitle !== editingCategory.title) {
                formData.append('title', updateTitle)
                hasChanges = true
            }

            if (updateSelectedImage) {
                formData.append('image', updateSelectedImage)
                hasChanges = true
            } else if (isImageRemoved) {
                // Explicitly send empty string to clear the image field in PATCH
                formData.append('image', '')
                hasChanges = true
            }

            if (!hasChanges) {
                setIsUpdateDialogOpen(false)
                return
            }

            await updateCategory(editingCategory.id, formData)

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Category updated successfully!',
                isSuccess: true,
            })
            setIsUpdateDialogOpen(false)
            setEditingCategory(null)
            setUpdateTitle('')
            setUpdateSelectedImage(null)
            setUpdateImagePreview(null)
            setIsImageRemoved(false)
            fetchCategories()
        } catch (err: any) {
            let errorMessage = 'Failed to update category.'
            if (err.title && Array.isArray(err.title)) {
                errorMessage = `Title: ${err.title.join(' ')}`
            } else if (err.detail) {
                errorMessage = err.detail
            } else if (typeof err === 'object') {
                errorMessage = Object.entries(err)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
                    .join('\n')
            }

            setAlertConfig({
                isOpen: true,
                title: 'Error',
                description: errorMessage,
                isSuccess: false,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return

        try {
            setIsSubmitting(true)
            await deleteCategory(categoryToDelete.id)

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Category deleted successfully!',
                isSuccess: true,
            })
            setIsDeleteDialogOpen(false)
            setCategoryToDelete(null)
            fetchCategories()
        } catch (err: any) {
            let errorMessage = 'Failed to delete category.'
            if (err.detail) {
                errorMessage = err.detail
            }
            setAlertConfig({
                isOpen: true,
                title: 'Error',
                description: errorMessage,
                isSuccess: false,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error && categories.length === 0) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm font-semibold underline hover:text-red-800 cursor-pointer"
                >
                    Try again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Food Categories</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage and organize your food items into categories.</p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                    Add New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-48 w-full group">
                            <Image
                                src={category.image || '/placeholder-food.jpg'}
                                alt={category.title}
                                fill
                                className="object-fixed group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                                    Active
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{category.title}</h3>
                            <p className="text-xs text-blue-600 font-semibold mb-3">Category</p>
                            <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-5">
                                Explore items under {category.title} category.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {/* <button className="flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors duration-200 cursor-pointer" title="View Details">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button> */}
                                <button
                                    onClick={() => handleEditCategory(category)}
                                    className="flex items-center justify-center p-2 text-green-600 hover:bg-green-50 border border-green-200 rounded-lg transition-colors duration-200 cursor-pointer"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setCategoryToDelete(category)
                                        setIsDeleteDialogOpen(true)
                                    }}
                                    className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors duration-200 cursor-pointer"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Create Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                            Create a new food category. Click create when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateCategory} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Italian Pizza"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Category Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="cursor-pointer"
                            />
                        </div>
                        {imagePreview && (
                            <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-contain p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedImage(null)
                                        setImagePreview(null)
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                                    title="Remove image"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer ml-auto"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Category Update Modal */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Category</DialogTitle>
                        <DialogDescription>
                            Modify the food category details. Click update when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCategory} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-title">Title</Label>
                            <Input
                                id="update-title"
                                placeholder="e.g. Italian Pizza"
                                value={updateTitle}
                                onChange={(e) => setUpdateTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="update-image">Category Image</Label>
                            <Input
                                id="update-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, true)}
                                className="cursor-pointer"
                            />
                        </div>
                        {updateImagePreview && (
                            <div className="relative h-40 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <Image
                                    src={updateImagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-contain p-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUpdateSelectedImage(null)
                                        setUpdateImagePreview(null)
                                        setIsImageRemoved(true)
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                                    title="Remove image"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUpdateDialogOpen(false)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer ml-auto"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            <span className="font-bold"> "{categoryToDelete?.title}"</span> category.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="bg-gray-100 text-gray-900 hover:bg-gray-200 border-none cursor-pointer"
                        >
                            Cancel
                        </AlertDialogAction>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert Feedback */}
            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, isOpen: open }))}>
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
