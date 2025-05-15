import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { type Post } from '@/types/discussion';
import { formatUserName } from '@/utils/userUtils'; 

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.Upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const authorName = formatUserName({ Name: post.authorName ?? 'Unknown User', Role: post.authorRole ?? '' });

  // Format date
  let timeAgo = 'Unknown time';
  if (post.Date) {
    try {
      timeAgo = formatDistanceToNow(new Date(post.Date), { addSuffix: true });
    } catch (e) {
      console.error("Invalid date format for Post Date:", post.Date);
    }
  }

  const handleUpvote = async () => {
    try {
      const response = await fetch(`/api/v1/discussions/${post.PostID}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.data.upvotes);
        setHasUpvoted(true);
      } else {
        console.error('Failed to upvote post:', response.status);
      }
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };



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
             <button
                className={`flex items-center space-x-1 hover:text-blue-600 group ${hasUpvoted ? 'text-blue-600' : ''}`}
                onClick={handleUpvote}
                disabled={hasUpvoted}
              >
                <ArrowUpIcon className="w-4 h-4 group-hover:text-blue-500" />
                <span>{upvotes}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
