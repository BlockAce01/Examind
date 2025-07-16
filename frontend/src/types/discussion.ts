export interface DiscussionForum {
  ForumID: number;
  Topic: string;
  Description?: string;
  PostCount: number; 
  LastActivity?: string;
  CreatorUserID?: number;
  CreatorName: string;
  CreatorRole: string;
  SubjectID?: number;
  SubjectName?: string;
}

export interface Comment { 
  CommentID: number; 
  ForumID: number;
  UserID: number;
  Content: string;
  Upvotes: number;
  Date: string;
  ParentCommentID?: number; 
  authorName?: string;
  authorRole?: string;
  hasUpvotedByUser?: boolean;
}
