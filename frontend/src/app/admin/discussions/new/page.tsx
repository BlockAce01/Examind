'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function AddDiscussionTopicPageContent() {
    const router = useRouter();
    const { token } = useAuth();

    //form data
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    //loading/error
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    //handle submit
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            setError("Authentication required.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setFieldErrors({});

        //validation
        if (!topic.trim()) {
            setFieldErrors({ topic: 'Topic title is required.' });
            setIsLoading(false);
            return;
        }

        //prepare payload for backend
        const forumData = {
            Topic: topic,
            Description: description || null,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/discussions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(forumData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            alert('Forum topic created successfully!');
            router.push('/discussions');
        } catch (err: any) {
            setError(err.message || 'Failed to create forum topic.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Link href="/discussions" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Discussion Forums
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Forum Topic</h1>

            {/*form connected to handle submit*/}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                 )}

                <Input label="Topic Title" id="topic" name="topic" required value={topic} onChange={(e) => setTopic(e.target.value)} disabled={isLoading} error={fieldErrors.topic} />

                 {/*textarea for description*/}
                 <div className="mb-3">
                     <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
                     <textarea
                         id="description" name="description" rows={4}
                         value={description} onChange={(e) => setDescription(e.target.value)}
                         disabled={isLoading}
                         className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                 </div>

                {/*buttons*/}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/discussions">
                        <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Save Topic'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default function AddDiscussionTopicPage() {
  return (
    <AddDiscussionTopicPageContent />
  );
}
