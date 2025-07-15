'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { type Resource } from '@/types/resource'; 

const resourceTypes = ['Notes', 'Past Paper', 'Model Paper', 'Video Lecture', 'Other'] as const;
type ResourceType = typeof resourceTypes[number];

export default function EditResourcePage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const resourceId = params.resourceId as string; 

  
    const [title, setTitle] = useState('');
    const [type, setType] = useState<ResourceType | ''>('');
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [fileURL, setFileURL] = useState('');
    const [description, setDescription] = useState('');

    // Loading and Error State
    const [isLoadingData, setIsLoadingData] = useState(true); 
    const [isUpdating, setIsUpdating] = useState(false); // For update submission
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Fetch Existing Resource Data 
    useEffect(() => {
        if (!resourceId || !token) {
            // Handle missing ID or token 
             if (!token) setError("Authentication required to edit.");
             setIsLoadingData(false);
            return;
        }

        const fetchResource = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/resources/${resourceId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Resource not found or permission denied. Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success' && data.data?.resource) {
                    const fetchedResource: Resource = data.data.resource;
                    // Populate form state with fetched data
                    setTitle(fetchedResource.Title || '');
                    setType(fetchedResource.Type || '');
                    setSubject(fetchedResource.Subject || '');
                    setYear(fetchedResource.Year ?? ''); 
                    setFileURL(fetchedResource.FileURL || '');
                    setDescription(fetchedResource.Description || '');
                } else {
                    throw new Error('Invalid data format received from API.');
                }

            } catch (err: any) {
                console.error("Failed to fetch resource:", err);
                setError(err.message);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchResource();
    }, [resourceId, token]); // Fetch when ID or token changes

    //Handle Form Submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            setError("Authentication token not found.");
            return;
        }
        setIsUpdating(true);
        setError(null);
        setFieldErrors({});

        // Basic Frontend Validation
        let currentErrors: { [key: string]: string } = {};
        if (!title.trim()) currentErrors.title = 'Title is required.';
        if (!type) currentErrors.type = 'Resource type is required.';
        if (!subject.trim()) currentErrors.subject = 'Subject is required.';
        if (!fileURL.trim()) currentErrors.fileURL = 'File URL or path is required.';

        if (Object.keys(currentErrors).length > 0) {
            setFieldErrors(currentErrors);
            setIsUpdating(false);
            return;
        }

        // Prepare data 
        const updatedResourceData = {
            title,
            type,
            subject,
            year: year || null,
            fileURL,
            description: description || null,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/resources/${resourceId}`, { 
                method: 'PUT', // Use PUT for updates
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedResourceData), // Send the updated data object
            });

            const data = await response.json(); // Try to parse response even on error

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            alert('Resource updated successfully!'); // Replace  toast notification
            router.push('/admin/resources'); // Redirect back to list

        } catch (err: any) {
            console.error("Failed to update resource:", err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Loading state , fetching initial data
    if (isLoadingData) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    // Display error, if fetching failed
     if (error && !title) { 
         return (
             <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                 <p><strong>Error loading resource:</strong> {error}</p>
                 <Link href="/admin/resources" className="block mt-4">
                     <Button variant="secondary">Back to Resources</Button>
                 </Link>
             </div>
         );
     }

    // Render the form
    return (
        <div>
            <Link href="/admin/resources" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Resource Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Resource (ID: {resourceId})</h1>

          
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                
                 <Input
                    label="Title" id="title" name="title" required
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    disabled={isUpdating} error={fieldErrors.title}
                />
                 
                 <div className="mb-3">
                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                    <select
                        id="type" name="type" required
                        value={type} onChange={(e) => setType(e.target.value as ResourceType)}
                        disabled={isUpdating}
                        className={`shadow border ${fieldErrors.type ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${fieldErrors.type ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                        aria-describedby={fieldErrors.type ? `type-error` : undefined}
                    >
                        <option value="" disabled>Select resource type...</option>
                        {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="h-4 mt-1">
                        {fieldErrors.type && <p id="type-error" className="text-xs text-red-600">{fieldErrors.type}</p>}
                    </div>
                </div>

                <Input
                    label="Subject" id="subject" name="subject" required
                    value={subject} onChange={(e) => setSubject(e.target.value)}
                    disabled={isUpdating} error={fieldErrors.subject}
                />
                <Input
                    label="Year (Optional)" id="year" name="year" type="number"
                    value={year} onChange={(e) => setYear(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    disabled={isUpdating}
                />
                <Input
                    label="File URL / Path" id="fileURL" name="fileURL" type="text"
                    placeholder="e.g., /uploads/paper.pdf or https://example.com/doc.pdf" required
                    value={fileURL} onChange={(e) => setFileURL(e.target.value)}
                    disabled={isUpdating} error={fieldErrors.fileURL}
                />
              
                 <div className="mb-3">
                     <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
                     <textarea
                         id="description" name="description" rows={3}
                         value={description} onChange={(e) => setDescription(e.target.value)}
                         disabled={isUpdating}
                         className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                 </div>


            
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/resources">
                        <Button type="button" variant="secondary" disabled={isUpdating}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isUpdating}>
                         {isUpdating ? <Spinner size="sm" className="mx-auto" /> : 'Update Resource'}
                    </Button>
                </div>
            </form>
        </div>
    );
}