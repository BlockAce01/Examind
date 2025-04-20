// src/types/resource.ts

// Type for Resource data from API
export interface Resource {
    ResourceID: number; // Matches DB schema casing
    Title: string;
    Type: 'Past Paper' | 'Model Paper' | 'Notes' | 'Video Lecture' | 'Other';
    Subject: string;
    Year?: number | null; // Can be null
    FileURL: string;
    Description?: string | null; // Can be null
    UploadedDate?: string | null; // ISO Date string or null
    // Add any other fields returned by your API
}