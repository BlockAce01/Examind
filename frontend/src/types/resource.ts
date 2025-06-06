export interface Resource {
    ResourceID: number; 
    Title: string;
    Type: 'Past Paper' | 'Model Paper' | 'Notes' | 'Video Lecture' | 'Other';
    Subject: string;
    Year?: number | null; 
    FileURL: string;
    Description?: string | null; 
    UploadedDate?: string | null; 
}
