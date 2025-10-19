'use client'; //to handle state
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { type User } from '@/types/user';
import Button from '@/components/ui/Button';
import { PencilSquareIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) return;
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const res = await fetch(`${apiUrl}/api/v1/users`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data.data.users);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    const handleDelete = async (userId: number, userName: string) => {
        if (window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const res = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to delete user');
                setUsers(currentUsers => currentUsers.filter(u => u.UserID !== userId));
                alert(`User "${userName}" deleted successfully.`);
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            }
        }
    };

     //function to get role badge styling
      const getRoleClass = (role: User['Role']) => {
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
                        {isLoading ? (
                            <tr key="loading">
                                <td colSpan={5} className="px-6 py-4 text-center">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr key="error">
                                <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                                    Error: {error}
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.UserID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{user.Name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.Email || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded-full ${getRoleClass(user.Role)}`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {/*edit User link*/}
                                         <Link href={`/admin/users/edit/${user.UserID}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit User">
                                            <PencilSquareIcon className="w-4 h-4"/>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.UserID, user.Name)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                            title="Delete User"
                                        >
                                            <TrashIcon className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr key="no-users">
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
