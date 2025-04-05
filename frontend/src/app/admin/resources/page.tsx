// src/app/admin/resources/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Import shared type
import { type Resource } from '@/types/resource'; // Adjust path if needed
// Import utility components
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { PencilSquareIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';
// Import auth hook
import { useAuth } from '@/context/AuthContext';

export default function AdminResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth(); // Get token for authenticated requests

    // --- Fetch Data ---
    const fetchAdminResources = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/resources`, {
                 headers: { /* Add Auth header if required by backend */ },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
             if (data.status === 'success' && Array.isArray(data.data?.resources)) {
                 setResources(data.data.resources); // Ensure response matches Resource[]
             } else {
                 throw new Error(data.message || 'Invalid API response format');
             }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch resources.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Consider fetching only if token exists if API is protected
        fetchAdminResources();
    }, []); // Re-fetch dependency could be token if needed: [token]

    // --- Handle Delete ---
    const handleDelete = async (resourceId: number, resourceTitle: string) => {
        if (!token) {
             alert('Authentication required.'); // Or handle redirect
             return;
        }
        if (window.confirm(`Are you sure you want to delete the resource "${resourceTitle}"?`)) {
            try {
                setError(null);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/resources/${resourceId}`, { // Use correct ResourceID
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 204) {
                    setResources(currentResources => currentResources.filter(r => r.ResourceID !== resourceId)); // Use ResourceID
                    alert(`Resource "${resourceTitle}" deleted successfully.`); // Use toast later
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to delete. Status: ${response.status}`);
                }

            } catch (err: any) {
                console.error('Deletion failed:', err);
                setError(err.message || 'Could not delete resource.');
                alert(`Error deleting resource: ${err.message}`); // Use toast later
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Resources</h1>
                <Link href="/admin/resources/new">
                    <Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
                        + Add New Resource
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File URL</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {resources.length > 0 ? (
                                resources.map((resource) => (
                                    <tr key={resource.ResourceID} className="hover:bg-gray-50">
                                        {/* Use correct casing from Resource type */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.ResourceID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{resource.Title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.Type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.Subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href={resource.FileURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" title={resource.FileURL}>
                                                <LinkIcon className="w-4 h-4 inline-block mr-1"/> View Link
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link href={`/admin/resources/edit/${resource.ResourceID}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center" title="Edit">
                                                <PencilSquareIcon className="w-4 h-4"/>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(resource.ResourceID, resource.Title || 'this resource')} // Use ResourceID, Title
                                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No resources found. Add one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}