export interface User {
    userId: number; 
    name: string;               
    email: string;              
    points?: number | null;  
    badges?: string | null; 
    subscriptionStatus?: 'Free' | 'Premium' | 'Pending' | 'Cancelled' | string;
    role: 'teacher' | 'student' | 'admin'; 
    avatarUrl?: string;
}

export interface Badge {
    BadgeID: number;
    Name: string;
    Description: string;
    IconURL?: string;
    Tier?: 'Bronze' | 'Silver' | 'Gold';
}
