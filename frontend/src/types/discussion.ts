//type for forum data from API 
export interface ForumTopic {
    ForumID: number;
    Topic: string;
    Description: string | null;
    PostCount?: number; 
    LastActivity?: string | null;
    CreatorUserID?: number | null;
    CreatorName: string;
    CreatorRole: string;
    //add other fields 
}

//type for post data 
export interface Post {
    PostID: number;
    ForumID: number;
    UserID: number | null; 
    Content: string;
    Upvotes: number;
    Date: string; 
    authorName: string; //joined from User table 
    authorRole: string;
    //add other fields 
}
