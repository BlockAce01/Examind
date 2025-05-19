'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { type DiscussionForum } from '@/types/discussion';

export default function EditDiscussionTopicPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const forumId = params.forumId as string;

    //form state
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    //loading and error state
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    //fetch existing forum data
    useEffect(() => {
        if (!forumId || !token) {
            if (!token) setError("Authentication required.");
            setIsLoadingData(false);
            return;
        }
        const fetchForum = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Forum topic not found. Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status === 'success' && data.data?.forum) {
                    const fetchedForum: DiscussionForum = data.data.forum;
                    setTopic(fetchedForum.Topic || '');
                    setDescription(fetchedForum.Description || '');
                } else {
                    throw new Error('Invalid data format received.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchForum();
    }, [forumId, token]);

    //handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;

        setIsUpdating(true);
        setError(null);
        setFieldErrors({});

        //validation
        if (!topic.trim()) {
            setFieldErrors({ topic: 'Topic title is required.' });
            setIsUpdating(false);
            return;
        }

        //Prepare payload for backend
        const updatedForumData = {
            Topic: topic, //Matches backend expected 'Topic'
            Description: description || null, //Matches backend 'Description'
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedForumData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            alert('Forum topic updated successfully!');
            router.push('/admin/discussions');
        } catch (err: any) {
            setError(err.message || 'Failed to update forum topic.');
        } finally {
            setIsUpdating(false);
        }
    };

     if (isLoadingData) { /*render spinner*/ }
     if (error && !topic) { /*render fetch error*/ }

    return (
        <div>
            <Link href="/admin/discussions" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Discussion Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Forum Topic (ID: {forumId})</h1>

            {/*form*/}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">

                <Input label="Topic Title" id="topic" name="topic" required value={topic} onChange={(e) => setTopic(e.target.value)} disabled={isUpdating} error={fieldErrors.topic} />

                {/*textarea for description*/}
                <div className="mb-3">
                     <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
                     <textarea
                         id="description" name="description" rows={4}
                         value={description} onChange={(e) => setDescription(e.target.value)}
                         disabled={isUpdating}
                         className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                 </div>

                {/*buttons*/}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/discussions">
                        <Button type="button" variant="secondary" disabled={isUpdating}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isUpdating}>
                        {isUpdating ? <Spinner size="sm" className="mx-auto" /> : 'Update Topic'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
