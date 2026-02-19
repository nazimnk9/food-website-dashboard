'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface User {
    id: string
    name: string
    email: string
    role: 'Admin' | 'Manager' | 'Staff'
    status: 'Active' | 'Inactive'
}

const initialUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Staff', status: 'Inactive' },
]

export default function SettingsPage() {
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Staff' as User['role'],
        status: 'Active' as User['status'],
    })

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault()
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            ...formData,
        }
        setUsers([...users, newUser])
        setIsAddDialogOpen(false)
        setFormData({ name: '', email: '', role: 'Staff', status: 'Active' })
    }

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentUser) return
        const updatedUsers = users.map((u) =>
            u.id === currentUser.id ? { ...u, ...formData } : u
        )
        setUsers(updatedUsers)
        setIsEditDialogOpen(false)
        setCurrentUser(null)
        setFormData({ name: '', email: '', role: 'Staff', status: 'Active' })
    }

    const handleDeleteUser = () => {
        if (!currentUser) return
        setUsers(users.filter((u) => u.id !== currentUser.id))
        setIsDeleteDialogOpen(false)
        setCurrentUser(null)
    }

    const openEditDialog = (user: User) => {
        setCurrentUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        })
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (user: User) => {
        setCurrentUser(user)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-600">Add, edit, and remove team members.</p>
                </div>
                <Button
                    onClick={() => {
                        setFormData({ name: '', email: '', role: 'Staff', status: 'Active' });
                        setIsAddDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Add User
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-medium text-xs">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                                    >
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditDialog(user)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openDeleteDialog(user)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddUser}>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>Create a new team member account here.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Create User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleUpdateUser}>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Update the details of the team member.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <select
                                    id="edit-role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                    id="edit-status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{currentUser?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
