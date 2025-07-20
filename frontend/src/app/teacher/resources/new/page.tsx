'use client';
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input'; 
import Spinner from '@/components/ui/Spinner'; 
import { useAuth } from '@/context/AuthContext'; 

// Define resource types 
const resourceTypes = ['Notes', 'Past Paper', 'Model Paper', 'Video Lecture', 'Other'] as const;
type ResourceType = typeof resourceTypes[number];

export default function AddResourcePage() {
    const router = useRouter();
    const { token } = useAuth(); 

    const [title, setTitle] = useState('');
    const [type, setType] = useState<ResourceType | ''>(''); 
    const [subject, setSubject] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [fileURL, setFileURL] = useState('');
    const [description, setDescription] = useState('');

    // Loading and Error State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({}); 

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            setError("Authentication token not found. Please log in again.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setFieldErrors({}); 
        
        let currentErrors: { [key: string]: string } = {};
        if (!title.trim()) currentErrors.title = 'Title is required.';
        if (!type) currentErrors.type = 'Resource type is required.';
        if (!subject.trim()) currentErrors.subject = 'Subject is required.';
        if (!fileURL.trim()) currentErrors.fileURL = 'File URL or path is required.';
        

        if (Object.keys(currentErrors).length > 0) {
            setFieldErrors(currentErrors);
            setIsLoading(false);
            return;
        }

        const resourceData = {
            title, 
            type, 
            subject, 
            year: year || null, 
            fileURL, 
            description: description || null, 
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send authentication 
                },
                body: JSON.stringify(resourceData), 
            });

            const data = await response.json();

            if (!response.ok) {
                
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            alert('Resource created successfully!'); // Replace with toast notification later
            router.push('/teacher/resources');

        } catch (err: any) {
            console.error("Failed to create resource:", err);
            // Display error message 
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Link href="/teacher/resources" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Resource Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Resource</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                {/* Display general API error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* Reusable Input components */}
                <Input
                    label="Title" id="title" name="title" required
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading} error={fieldErrors.title}
                />
                 <div className="mb-3">
                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                    <select
                        id="type" name="type" required
                        value={type} onChange={(e) => setType(e.target.value as ResourceType)}
                        disabled={isLoading}
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
                    disabled={isLoading} error={fieldErrors.subject}
                />
                <Input
                    label="Year (Optional)" id="year" name="year" type="number" // Use number type
                    value={year} onChange={(e) => setYear(e.target.value === '' ? '' : parseInt(e.target.value, 10))} // Handle empty string vs number
                    disabled={isLoading}
                />
                <Input
                    label="File URL / Path" id="fileURL" name="fileURL" type="text" // Use text for now, could be URL
                    placeholder="e.g., /uploads/paper.pdf or https://example.com/doc.pdf" required
                    value={fileURL} onChange={(e) => setFileURL(e.target.value)}
                    disabled={isLoading} error={fieldErrors.fileURL}
                />
                 {/* Textarea for Description */}
                 <div className="mb-3">
                     <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
                     <textarea
                         id="description" name="description" rows={3}
                         value={description} onChange={(e) => setDescription(e.target.value)}
                         disabled={isLoading}
                         className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                 </div>


                {/* Submit/Cancel Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/teacher/resources">
                        <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Save Resource'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
