export interface User {
    UserID: number; 
    Name: string;               
    Email: string;              
    Points?: number | null;  
    Badges?: string | null; 
    SubscriptionStatus?: 'Free' | 'Premium' | 'Pending' | 'Cancelled' | string;
    Role: 'teacher' | 'student' | 'admin'; 
    AvatarURL?: string;
}

export interface Badge {
    BadgeID: number;
    Name: string;
    Description: string;
    IconURL?: string;
    Tier?: 'Bronze' | 'Silver' | 'Gold';
}
