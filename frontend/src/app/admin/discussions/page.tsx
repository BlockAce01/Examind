// src/app/admin/discussions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Remove mock data import
// import { mockForums as initialForums, type Forum } from '@/data/mockForums';
import { type ForumTopic } from '@/types/discussion'; // Use shared type
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function AdminDiscussionsPage() {
    const [forums, setForums] = useState<ForumTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth(); // Get token for delete request

    // --- Fetch Data ---
    const fetchAdminForums = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/discussions`, {
                 headers: { /* Add Auth header if needed */ },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
             if (data.status === 'success' && Array.isArray(data.data?.forums)) {
                 setForums(data.data.forums); // Ensure response matches ForumTopic[]
             } else {
                 throw new Error(data.message || 'Invalid API response format');
             }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch forums.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminForums();
    }, []);

    // --- Handle Delete ---
    const handleDelete = async (ForumID: number, Topic: string) => { // Use correct casing
        if (!token) { /* Handle no token */ return; }
        if (window.confirm(`Are you sure you want to delete the forum topic "${Topic}"? Associated posts may be deleted (if CASCADE set).`)) {
            try {
                setError(null);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions/${ForumID}`, { // Use ForumID
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.status === 204) {
                    setForums(currentForums => currentForums.filter(f => f.ForumID !== ForumID)); // Use ForumID
                    alert(`Forum topic "${Topic}" deleted successfully.`);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to delete. Status: ${response.status}`);
                }
            } catch (err: any) {
                setError(err.message || 'Could not delete forum topic.');
                alert(`Error deleting forum: ${err.message}`);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Forum Topics</h1>
                <Link href="/admin/discussions/new">
                    <Button variant="primary" className="bg-cyan-600 hover:bg-cyan-700">
                        + Add New Topic
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : error ? (
                <div className="text-center p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">Error: {error}</div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {forums.length > 0 ? (
                                forums.map((forum) => {
                                    let lastActivityRelative = 'N/A';
                                    if (forum.LastActivity) { try { lastActivityRelative = formatDistanceToNow(new Date(forum.LastActivity), { addSuffix: true }); } catch(e){}}
                                    return (
                                        <tr key={forum.ForumID} className="hover:bg-gray-50">
                                            {/* Use correct casing from ForumTopic */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{forum.ForumID}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{forum.Topic}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={forum.Description || ''}>{forum.Description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{forum.PostCount ?? 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lastActivityRelative}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link href={`/discussions/${forum.ForumID}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center" title="View Forum">
                                                    <ChatBubbleLeftRightIcon className="w-4 h-4"/>
                                                </Link>
                                                <Link href={`/admin/discussions/edit/${forum.ForumID}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit Topic">
                                                    <PencilSquareIcon className="w-4 h-4"/>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(forum.ForumID, forum.Topic)}
                                                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                    title="Delete Topic"
                                                >
                                                    <TrashIcon className="w-4 h-4"/>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No forum topics found. Add one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}