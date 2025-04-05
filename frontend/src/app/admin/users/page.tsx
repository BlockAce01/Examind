// src/app/admin/users/page.tsx
'use client'; // To handle state for deletion simulation

import React, { useState } from 'react';
import Link from 'next/link';
import { mockUsers as initialUsers, type User } from '@/data/mockUsers'; // Import user data
import Button from '@/components/ui/Button';
import { PencilSquareIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);

    const handleDelete = (userId: number, userName: string) => {
        // Critical Note: Deleting users has significant implications (data integrity, etc.)
        // This simulation is purely visual. Real implementation needs careful backend logic.
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            console.log('Attempting to delete user ID:', userId);
            setUsers(currentUsers => currentUsers.filter(u => u.userId !== userId));
            alert(`User "${userName}" deleted successfully (simulation).`);
        }
    };

     // Function to get role badge styling
      const getRoleClass = (role: User['role']) => {
        switch (role) {
          case 'admin': return 'bg-red-100 text-red-800';
          case 'teacher': return 'bg-blue-100 text-blue-800';
          case 'student':
          default: return 'bg-green-100 text-green-800';
        }
      };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                {/* Typically no "Add New User" button here, users register or are added differently */}
                {/* <Button variant="primary">+ Add New User</Button> */}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${getRoleClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {/* Edit User Link (e.g., to change role or details) */}
                                        {/* Create /admin/users/edit/[userId]/page.tsx later */}
                                         <Link href={`/admin/users/edit/${user.userId}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit User">
                                            <PencilSquareIcon className="w-4 h-4"/>
                                        </Link>
                                        {/* Prevent deleting the primary admin user? Add logic later */}
                                        <button
                                            onClick={() => handleDelete(user.userId, user.name)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                            title="Delete User"
                                             // disabled={user.role === 'admin'} // Example: Prevent deleting admins via this UI
                                        >
                                            <TrashIcon className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}