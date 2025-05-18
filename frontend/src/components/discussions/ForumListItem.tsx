import React from 'react';
import Link from 'next/link';
import { ChatBubbleLeftRightIcon, ClockIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { type DiscussionForum } from '@/types/discussion';
import { formatUserName } from '@/utils/userUtils'; 

interface ForumListItemProps {
  forum: DiscussionForum & { CreatorName: string; CreatorRole: string }; 
}

const ForumListItem: React.FC<ForumListItemProps> = ({ forum }) => {
  // Calculate time for last activity
  let lastActivityRelative = 'No activity';
  if (forum.LastActivity) {
      try {
          lastActivityRelative = formatDistanceToNow(new Date(forum.LastActivity), { addSuffix: true });
      } catch (e) {
          console.error("Invalid date format for LastActivity:", forum.LastActivity);
      }
  }

  const creatorDisplayName = formatUserName({ Name: forum.CreatorName, Role: forum.CreatorRole });

  return (
    <Link href={`/discussions/${forum.ForumID}`} className="block p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-150">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-blue-700 hover:underline mb-1">{forum.Topic}</h3>
          <p className="text-sm text-gray-600">Created by {creatorDisplayName}</p>
          {forum.Description && (
             <p className="text-sm text-gray-600">{forum.Description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
        <span className="flex items-center">
          <HashtagIcon className="w-3.5 h-3.5 mr-1" />
          {forum.PostCount ?? 0} Posts
        </span>
        <span className="flex items-center">
          <ClockIcon className="w-3.5 h-3.5 mr-1" /> Last activity: {lastActivityRelative}
        </span>
      </div>
    </Link>
  );
};

export default ForumListItem;
