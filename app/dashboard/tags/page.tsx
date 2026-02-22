'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTags, createTag, updateTag, deleteTag, Tag } from '@/lib/tagService'
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

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    // Update Modal state
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<Tag | null>(null)
    const [updateTitle, setUpdateTitle] = useState('')

    // Delete Modal state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)

    // Alert state
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        description: '',
        isSuccess: false,
    })

    const fetchTags = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getTags()
            setTags(data.results)
        } catch (err: any) {
            setError(err.detail || 'Failed to load tags.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTags()
    }, [fetchTags])

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            await createTag(newTitle)

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Tag created successfully!',
                isSuccess: true,
            })
            setIsDialogOpen(false)
            setNewTitle('')
            fetchTags()
        } catch (err: any) {
            let errorMessage = 'Failed to create tag.'
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

    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag)
        setUpdateTitle(tag.title)
        setIsUpdateDialogOpen(true)
    }

    const handleUpdateTag = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTag) return

        try {
            setIsSubmitting(true)
            if (updateTitle !== editingTag.title) {
                await updateTag(editingTag.id, updateTitle)
            }

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Tag updated successfully!',
                isSuccess: true,
            })
            setIsUpdateDialogOpen(false)
            setEditingTag(null)
            setUpdateTitle('')
            fetchTags()
        } catch (err: any) {
            let errorMessage = 'Failed to update tag.'
            if (err.title && Array.isArray(err.title)) {
                errorMessage = `Title: ${err.title.join(' ')}`
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

    const handleConfirmDelete = async () => {
        if (!tagToDelete) return

        try {
            setIsSubmitting(true)
            await deleteTag(tagToDelete.id)

            setAlertConfig({
                isOpen: true,
                title: 'Success',
                description: 'Tag deleted successfully!',
                isSuccess: true,
            })
            setIsDeleteDialogOpen(false)
            setTagToDelete(null)
            fetchTags()
        } catch (err: any) {
            let errorMessage = 'Failed to delete tag.'
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

    if (isLoading && tags.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Tags</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage and organize tags for your signature dishes.</p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2 font-bold cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Tag
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tags.map((tag) => (
                    <div key={tag.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8C4.67 8 4 7.33 4 6.5S4.67 5 5.5 5 7 5.67 7 6.5 6.33 8 5.5 8z" />
                                </svg>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditTag(tag)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setTagToDelete(tag)
                                        setIsDeleteDialogOpen(true)
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1 capitalize">{tag.title}</h3>
                        {/* <p className="text-sm text-gray-400 font-medium">Tag ID: #{tag.id}</p> */}
                    </div>
                ))}
            </div>

            {/* Tag Create Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Add New Tag</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium pt-1">
                            Create a new tag for your menu items.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTag} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tag Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Vegetarian, Spicy, Gluten-Free"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                                className="w-full px-5 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200"
                            />
                        </div>
                        <DialogFooter className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1 px-6 py-6 bg-gray-100 hover:bg-gray-200 border-none text-gray-600 font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[1.5] px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : 'Create Tag'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tag Update Modal */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Update Tag</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium pt-1">
                            Modify the details of this tag.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateTag} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-title" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tag Title</Label>
                            <Input
                                id="update-title"
                                placeholder="e.g. Vegetarian, Spicy, Gluten-Free"
                                value={updateTitle}
                                onChange={(e) => setUpdateTitle(e.target.value)}
                                required
                                className="w-full px-5 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 outline-none transition-all duration-200"
                            />
                        </div>
                        <DialogFooter className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUpdateDialogOpen(false)}
                                className="flex-1 px-6 py-6 bg-gray-100 hover:bg-gray-200 border-none text-gray-600 font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[1.5] px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : 'Update Tag'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
                        <p className="text-gray-500 font-medium">This action cannot be undone. This will permanently delete the <span className="text-red-600 font-bold capitalize">"{tagToDelete?.title}"</span> tag.</p>
                    </div>
                    <div className="flex border-t border-gray-100">
                        <button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="flex-1 px-6 py-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors border-r border-gray-100 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 text-red-600 font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alert Feedback Dialog */}
            <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-gray-900 tracking-tight">{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 font-medium">
                            {alertConfig.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs border-none cursor-pointer ${alertConfig.isSuccess ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20" : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"}`}
                        >
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
