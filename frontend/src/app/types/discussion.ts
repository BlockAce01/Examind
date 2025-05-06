// Type for Forum data from API list/detail endpoint
export interface ForumTopic {
    ForumID: number;
    Topic: string;
    Description: string | null;
    PostCount?: number; 
    LastActivity?: string | null; 
    CreatorUserID?: number | null;
    CreatorName: string;
    CreatorRole: string;

}

// Type for Post data from API
export interface Post {
    PostID: number;
    ForumID: number;
    UserID: number | null; // Can be null if user deleted
    Content: string;
    Upvotes: number;
    Date: string; 
    authorName: string; 
    authorRole: string;
 
}
