'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { type DiscussionForum, type Comment as CommentType } from '@/types/discussion';
import CommentItem from '@/components/discussions/CommentItem';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function ForumTopicPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token, isAuthenticated } = useAuth(); // get user and token for commenting
    const forumId = parseInt(params.forumId as string);

    // state for forum details,comments,loading,errors and new comment form
    const [forum, setForum] = useState<DiscussionForum | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]); 
    const [isLoadingForum, setIsLoadingForum] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [forumError, setForumError] = useState<string | null>(null);
    const [commentsError, setCommentsError] = useState<string | null>(null);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentSubmitError, setCommentSubmitError] = useState<string | null>(null);

    // fetch forum details
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
    }, [forumId]);

    // fetch comments for the Forum
    useEffect(() => {
        const fetchComments = async () => {
             if (!forumId) return;
             setIsLoadingComments(true);
             setCommentsError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}/comments`); 
                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                 if (data.status === 'success' && Array.isArray(data.data?.comments)) { 
                    // sort comments by Upvotes descending order
                    const sortedComments = data.data.comments.sort((a: CommentType, b: CommentType) => b.Upvotes - a.Upvotes);
                    setComments(sortedComments);
                } else {
                     throw new Error(data.message || 'Invalid comments response format');
                 }
            } catch (err: any) {
                setCommentsError(err.message || 'Could not load comments.'); 
            } finally {
                setIsLoadingComments(false); 
            }
        };
        fetchComments();
    }, [forumId]);

    // new comment submission
    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        if (!newCommentContent.trim() || !isAuthenticated || !token || !forumId) { 
            setCommentSubmitError('Cannot submit empty comment or user not authenticated.'); 
            return;
        }

        setIsSubmittingComment(true);
        setCommentSubmitError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/discussions/${forumId}/comments`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ Content: newCommentContent }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            if (data.status === 'success' && data.data?.comment) { 
                // comment data returned from the API
                setComments(currentComments => [data.data.comment, ...currentComments]);
                setNewCommentContent('');
            } else {
                throw new Error(data.message || 'Failed to submit comment in expected format.'); 
            }

        } catch (err: any) {
            console.error('Comment submission failed:', err);
            setCommentSubmitError(err.message || 'An error occurred while commenting.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // render loading state for forum details
    if (isLoadingForum) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    // render error state for forum details
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

    // render if forum data is missing after loading
    if (!forum) {
       return <div className="text-center p-10">Forum data could not be loaded.</div>;
    }

    // main component render
    return (
        <div>
            {/* forum header */}
            <div className="mb-6">
                <Link href="/discussions" className="text-sm text-blue-600 hover:underline flex items-center mb-2">
                    <ArrowLeftIcon className="w-4 h-4 mr-1"/> Back to All Forums
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">{forum.Topic}</h1>
                {forum.Description && (
                    <p className="text-gray-600 mt-1">{forum.Description}</p>
                 )}
            </div>

            {/* new comment form */}
            {isAuthenticated ? (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <form onSubmit={handleCommentSubmit}>
                        <label htmlFor="new-comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Add your contribution:
                        </label>
                        <textarea
                            id="new-comment"
                            rows={3}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-100"
                            placeholder="Type your question or reply here..."
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            required
                            disabled={isSubmittingComment}
                        />
                         {commentSubmitError && <p className="text-xs text-red-600 mt-1">{commentSubmitError}</p>}
                        <div className="text-right mt-2">
                            <Button type="submit" variant="primary" disabled={!newCommentContent.trim() || isSubmittingComment}>
                                {isSubmittingComment ? <Spinner size="sm" /> : 'Post Reply'}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center text-sm text-yellow-800 mb-6">
                     Please <Link href="/login" className='font-semibold underline'>login</Link> to post a reply.
                 </div>
            )}


            {/* list of comments */}
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Comments</h2> 
            {isLoadingComments ? (
                 <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : commentsError ? (
                 <div className="text-center p-6 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                     Error loading comments: {commentsError}
                 </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[200px]">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.CommentID}>
                                <CommentItem comment={comment} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 p-10">Be the first to comment in this forum!</p>
                    )}
                </div>
            )}
        </div>
    );
}
