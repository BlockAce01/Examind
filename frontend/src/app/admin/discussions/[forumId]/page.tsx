
'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use router if needed
import Link from 'next/link';
// Import Shared Types
import { type ForumTopic, type Post as PostType } from '@/types/discussion';
// Import Components
import PostItem from '@/components/discussions/PostItem';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext'; // Import useAuth for posting

export default function ForumTopicPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token, isAuthenticated } = useAuth(); // Get user and token for posting
    const forumId = parseInt(params.forumId as string);

    
    const [forum, setForum] = useState<ForumTopic | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoadingForum, setIsLoadingForum] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [forumError, setForumError] = useState<string | null>(null);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [isSubmittingPost, setIsSubmittingPost] = useState(false);
    const [postSubmitError, setPostSubmitError] = useState<string | null>(null);

    // Fetch Forum Details
    useEffect(() => {
        const fetchForumDetails = async () => {
            if (!forumId) return;
            setIsLoadingForum(true);
            setForumError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (data.status === 'success' && data.data?.forum) {
                    setForum(data.data.forum);
                } else {
                    throw new Error(data.message || 'Forum not found or invalid format');
                }
            } catch (err: any) {
                setForumError(err.message || 'Could not load forum details.');
            } finally {
                setIsLoadingForum(false);
            }
        };
        fetchForumDetails();
    }, [forumId]); // Re-fetch if forumId changes

    // Fetch Posts for the Forum
    useEffect(() => {
        const fetchPosts = async () => {
             if (!forumId) return;
             setIsLoadingPosts(true);
             setPostsError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}/posts`);
                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                 if (data.status === 'success' && Array.isArray(data.data?.posts)) {
                    setPosts(data.data.posts);
                } else {
                     throw new Error(data.message || 'Invalid posts response format');
                 }
            } catch (err: any) {
                setPostsError(err.message || 'Could not load posts.');
            } finally {
                setIsLoadingPosts(false);
            }
        };
        fetchPosts();
    }, [forumId]); // Re-fetch if forumId changes

    // Handle New Post Submission
    const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPostContent.trim() || !isAuthenticated || !token || !forumId) {
            setPostSubmitError('Cannot submit empty post or user not authenticated.');
            return;
        }

        setIsSubmittingPost(true);
        setPostSubmitError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send auth token
                },
                body: JSON.stringify({ Content: newPostContent }), // Match backend expected key "Content"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            if (data.status === 'success' && data.data?.post) {
                // Add the new post to the beginning of the list (optimistic-like)
                // Use the post data returned from the API
                setPosts(currentPosts => [data.data.post, ...currentPosts]);
                setNewPostContent(''); // Clear the textarea
            } else {
                throw new Error(data.message || 'Failed to submit post in expected format.');
            }

        } catch (err: any) {
            console.error('Post submission failed:', err);
            setPostSubmitError(err.message || 'An error occurred while posting.');
        } finally {
            setIsSubmittingPost(false);
        }
    };

    // Render loading state for forum details
    if (isLoadingForum) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    // Render error state for forum details
    if (forumError) {
        return (
            <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <p><strong>Error loading forum:</strong> {forumError}</p>
                <Link href="/discussions" className="block mt-4">
                    <Button variant="secondary">Back to Forums</Button>
                </Link>
            </div>
        );
    }

    
    if (!forum) {
       return <div className="text-center p-10">Forum data could not be loaded.</div>;
    }

    // Main component render
    return (
        <div>
            {/* Back Link & Forum Header */}
            <div className="mb-6">
                <Link href="/discussions" className="text-sm text-blue-600 hover:underline flex items-center mb-2">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to All Forums
                </Link>
                {/* Use correct casing from fetched forum data */}
                <h1 className="text-3xl font-bold text-gray-800">{forum.Topic}</h1>
                {forum.Description && (
                    <p className="text-gray-600 mt-1">{forum.Description}</p>
                 )}
            </div>

            {/* New Post Form (only if authenticated) */}
            {isAuthenticated ? (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <form onSubmit={handlePostSubmit}>
                        <label htmlFor="new-post" className="block text-sm font-medium text-gray-700 mb-1">
                            Add your contribution:
                        </label>
                        <textarea
                            id="new-post"
                            rows={3}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100"
                            placeholder="Type your question or reply here..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            required
                            disabled={isSubmittingPost} // Disable while submitting
                        />
                         {postSubmitError && <p className="text-xs text-red-600 mt-1">{postSubmitError}</p>}
                        <div className="text-right mt-2">
                            <Button type="submit" variant="primary" disabled={!newPostContent.trim() || isSubmittingPost}>
                                {isSubmittingPost ? <Spinner size="sm" /> : 'Post Reply'}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center text-sm text-yellow-800 mb-6">
                     Please <Link href="/login" className='font-semibold underline'>login</Link> to post a reply.
                 </div>
            )}


            {/* List of Posts Section */}
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Posts</h2>
            {isLoadingPosts ? (
                 <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : postsError ? (
                 <div className="text-center p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                     Error loading posts: {postsError}
                 </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[200px]">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostItem key={post.PostID} post={post} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 p-10">Be the first to post in this forum!</p>
                        // No need for EmptyState component here if the paragraph is sufficient
                    )}
                </div>
            )}
        </div>
    );
}