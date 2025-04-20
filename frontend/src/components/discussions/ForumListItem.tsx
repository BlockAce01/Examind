// src/components/discussions/ForumListItem.tsx
import React from 'react';
import Link from 'next/link';
import { ChatBubbleLeftRightIcon, ClockIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
// Import the shared type
import { type ForumTopic } from '@/types/discussion';

interface ForumListItemProps {
  forum: ForumTopic; // Use the shared type
}

const ForumListItem: React.FC<ForumListItemProps> = ({ forum }) => {
  // Calculate relative time for last activity
  // Handle null or invalid date strings carefully
  let lastActivityRelative = 'No activity';
  if (forum.LastActivity) {
      try {
          lastActivityRelative = formatDistanceToNow(new Date(forum.LastActivity), { addSuffix: true });
      } catch (e) {
          console.error("Invalid date format for LastActivity:", forum.LastActivity);
          // Keep default 'No activity'
      }
  }


  return (
    // Use correct casing for href: forum.ForumID
    <Link href={`/discussions/${forum.ForumID}`} className="block p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-150">
      <div className="flex justify-between items-start">
        <div>
          {/* Use correct casing for data: forum.Topic, forum.Description */}
          <h3 className="text-lg font-semibold text-blue-700 hover:underline mb-1">{forum.Topic}</h3>
          {forum.Description && ( // Check if description exists
             <p className="text-sm text-gray-600">{forum.Description}</p>
          )}
        </div>
         {/* Optional Icon */}
         {/* <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-300 hidden sm:block"/> */}
      </div>
      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
        <span className="flex items-center">
          <HashtagIcon className="w-3.5 h-3.5 mr-1" />
          {/* Use correct casing: forum.PostCount */}
          {forum.PostCount ?? 0} Posts {/* Use ?? 0 for default */}
        </span>
        <span className="flex items-center">
          <ClockIcon className="w-3.5 h-3.5 mr-1" /> Last activity: {lastActivityRelative}
        </span>
      </div>
    </Link>
  );
};

export default ForumListItem;