// src/components/discussions/PostItem.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon } from '@heroicons/react/24/outline';
// Import the shared type
import { type Post } from '@/types/discussion';
// Assuming you might need user role info later, maybe pass author object?
// For now, relying on authorName from API response.

interface PostItemProps {
  post: Post;
  // Optional: Pass author role if available/needed for styling
  // authorRole?: 'student' | 'teacher' | 'admin';
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  // Get author name directly from the post object (assuming API includes it)
  const authorName = post.authorName || 'Unknown User';
  // TODO: Fetch or pass author role for styling if needed

  // Format date
  let timeAgo = 'Unknown time';
  if (post.Date) {
    try {
        timeAgo = formatDistanceToNow(new Date(post.Date), { addSuffix: true });
    } catch(e) {
        console.error("Invalid date format for Post Date:", post.Date);
    }
  }


  return (
    <div className="flex space-x-3 p-4 border-b border-gray-200 last:border-b-0">
      {/* Author Avatar/Info */}
      <div className="flex-shrink-0 text-center">
         <UserCircleIcon className="w-10 h-10 text-gray-400 mx-auto"/>
         <span className="block text-xs font-medium text-gray-700 mt-1">
            {authorName}
         </span>
         {/* Placeholder for role styling - implement later */}
         {/* <span className={`block text-xs ${authorRole === 'teacher' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
             {authorRole || 'Student'}
         </span> */}
      </div>

      {/* Post Content and Actions */}
      <div className="flex-grow">
         {/* Use correct casing: post.Content */}
        <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">{post.Content}</p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{timeAgo}</span>
          <div className="flex space-x-3 items-center">
             {/* Upvote Button Placeholder */}
             {/* Use correct casing: post.Upvotes */}
             <button className="flex items-center space-x-1 hover:text-blue-600 group disabled:opacity-50" disabled>
                <ArrowUpIcon className="w-4 h-4 group-hover:text-blue-500"/>
                <span>{post.Upvotes}</span>
             </button>
             {/* Reply Button Placeholder */}
             <button className="flex items-center space-x-1 hover:text-blue-600 group disabled:opacity-50" disabled>
                 <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 group-hover:text-blue-500"/>
                 <span>Reply</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;