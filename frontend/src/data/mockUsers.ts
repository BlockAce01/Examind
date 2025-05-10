export interface User {
  UserID: number;
  Name: string;
  Email: string;
  Password?: string; 
  Points?: string | null;
  Badges?: string | null;
  SubscriptionStatus: 'Free' | 'Premium' | 'Pending' | 'Cancelled';
  Role: 'Teacher' | 'Student' | 'admin' ;
  avatarUrl?: string;
}

export const mockUsers: User[] = [

  // { UserID: 1, Name: "Aisha Perera", Role: "Student", Email: "aisha@example.com", avatarUrl: "/avatars/avatar-female-1.png", SubscriptionStatus: 'Free' },
  // { UserID: 3, Name: "Mr. Silva", Role: "Teacher", Email: "silva.Teacher@example.com", avatarUrl: "/avatars/avatar-male-2.png", SubscriptionStatus: 'Free' },
  
];

export const getUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.UserID === id);
};

export const getMockLoggedInUser = (Role: 'Student' | 'Teacher' | 'admin' = 'Student'): User | undefined => {
    // This function must  find the uncommented user
    if (Role === 'Teacher') return mockUsers.find(u => u.Role === 'Teacher');
    if (Role === 'admin') return mockUsers.find(u => u.Role === 'admin');
    return mockUsers.find(u => u.Role === 'Student');
}