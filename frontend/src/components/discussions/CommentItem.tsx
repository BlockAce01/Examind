import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { type Comment } from '@/types/discussion'; 
import { formatUserName } from '@/utils/userUtils'; 
import { useAuth } from '@/context/AuthContext'; 

interface CommentItemProps { 
  comment: Comment; 
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const [upvotes, setUpvotes] = useState(comment.Upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(comment.hasUpvotedByUser || false); 
  const { token } = useAuth(); // get the token from AuthContext

  const authorName = formatUserName({ Name: comment.authorName ?? 'Unknown User', Role: comment.authorRole ?? '' }); // use comment prop

  // format date
  let timeAgo = 'Unknown time';
  if (comment.Date) { // use comment prop
    try {
      timeAgo = formatDistanceToNow(new Date(comment.Date), { addSuffix: true }); // use comment prop
    } catch (e) {
      console.error("Invalid date format for Comment Date:", comment.Date); // use comment prop
    }
  }

  const handleUpvote = async () => {

    try {
      const response = await fetch(`/api/v1/discussions/${comment.CommentID}/upvote`, { // use comment prop
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.data.upvotes);
        // toggle upvote
        setHasUpvoted(data.data.action === 'upvoted');
      } else {
        console.error('Failed to upvote/unvote comment:', response.status);
      }
    } catch (error) {
      console.error('Error upvoting/unvoting comment:', error);
    }
  };



  return (
    <div className="flex space-x-3 p-4 border-b border-gray-200 last:border-b-0">
      {/* author info */}
      <div className="flex-shrink-0 text-center">
         <UserCircleIcon className="w-10 h-10 text-gray-400 mx-auto"/>
         <span className="block text-xs font-medium text-gray-700 mt-1">
            {authorName}
         </span>
      </div>

      {/* comment content and actions */}
      <div className="flex-grow min-w-0">
        <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap break-words">{comment.Content}</p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{timeAgo}</span>
          <div className="flex space-x-3 items-center">
             <button
                className={`flex items-center space-x-1 group ${hasUpvoted ? 'text-blue-600 hover:text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}
                onClick={handleUpvote}
              >
                <ArrowUpIcon className={`w-4 h-4 ${hasUpvoted ? 'text-blue-600 group-hover:text-blue-700' : 'text-gray-500 group-hover:text-blue-600'}`} />
                <span>{upvotes}</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
