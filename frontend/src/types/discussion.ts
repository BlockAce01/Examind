export interface ForumTopic {
    ForumID: number;
    Topic: string;
    Description: string | null;
    PostCount?: number; 
    LastActivity?: string | null; 
    CreatorUserID?: number | null;
    CreatorName: string;
    CreatorRole: string;
    //add any other fields
}

//type for Post data 
export interface Post {
    PostID: number;
    ForumID: number;
    UserID: number | null; //can be null if user deleted
    Content: string;
    Upvotes: number;
    Date: string; 
    authorName: string; // joined from User table 
    authorRole: string;
    //add other fields 
}
