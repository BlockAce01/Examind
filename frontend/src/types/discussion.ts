// src/types/discussion.ts

// Type for Forum data from API list/detail endpoint
export interface ForumTopic {
    ForumID: number;
    Topic: string;
    Description: string | null;
    PostCount?: number; // Often calculated or needs specific query
    LastActivity?: string | null; // ISO Date string or null
    CreatorUserID?: number | null;
    // Add any other fields returned by your API
}

// Type for Post data from API
export interface Post {
    PostID: number;
    ForumID: number;
    UserID: number | null; // Can be null if user deleted
    Content: string;
    Upvotes: number;
    Date: string; // ISO Date string
    authorName?: string; // Optional: Joined from User table in API response
    // Add other fields like authorRole if needed/returned
}