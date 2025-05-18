'use client';

import React, { useState, useEffect } from 'react';
import ForumListItem from '@/components/discussions/ForumListItem';
// import { mockForums } from '@/data/mockForums';
import CreateTopicButton from '@/components/discussions/CreateTopicButton';
import { type DiscussionForum } from '@/types/discussion';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function DiscussionsPage() {
    const [forums, setForums] = useState<DiscussionForum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchForums = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status === 'success' && Array.isArray(data.data?.forums)) {
                    setForums(data.data.forums);
                } else {
                    throw new Error(data.message || 'Invalid API response format');
                }
            } catch (err: any) {
                setError(err.message || 'Could not load forums.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchForums();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Discussion Forums</h1>
                <CreateTopicButton />
            </div>

            {/* content area */}
            {isLoading ? (
                <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : error ? (
                <div className="text-center p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    Error: {error}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {forums.length > 0 ? (
                        forums.map((forum) => (
                            <ForumListItem key={forum.ForumID} forum={forum} />
                        ))
                    ) : (
                        <EmptyState
                            title="No Forums Yet"
                            message="No discussion forums have been created yet."
                        />
                    )}
                </div>
            )}
        </div>
    );
}
