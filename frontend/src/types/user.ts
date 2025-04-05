// src/types/user.ts

// Type for User data FROM API and used in CONTEXT
export interface User {
    userId: number;             // Lowercase key
    name: string;               // Lowercase key
    email: string;              // Lowercase key
    // Password should generally not be part of the frontend user object type
    // Password?: string;
    points?: number | null;      // Assuming points are numbers, adjust if string
    badges?: string | null;      // Keeping as string based on previous code
    subscriptionStatus?: 'Free' | 'Premium' | 'Pending' | 'Cancelled' | string; // Use lowercase from DB? Match API response
    role: 'teacher' | 'student' | 'admin'; // Lowercase key, but keep Uppercase VALUES if that's what DB/API sends
    avatarUrl?: string;
}

// You might also need a type for the DB structure if different, but for frontend context use the API structure