// src/data/mockPosts.ts
import { type User, getUserById } from './mockUsers'; // Import user data

export interface Post {
  postId: number;
  forumId: number; // Links to Forum
  userId: number; // Links to User
  content: string;
  upvotes: number;
  date: string; // ISO date string (e.g., new Date().toISOString())
  // Optional: Add replies later (could be an array of Post IDs or nested Post objects)
  // replies?: Post[];
}

export const mockPosts: Post[] = [
  // Posts for Forum 1 (Physics)
  { postId: 101, forumId: 1, userId: 1, content: "I'm struggling with question 5 on the 2021 paper regarding electromagnetism. Can someone explain the concept?", upvotes: 5, date: "2024-03-10T09:15:00Z" },
  { postId: 102, forumId: 1, userId: 3, content: "Hi Aisha, the key is to apply Faraday's Law and Lenz's Law. Remember the direction of induced current opposes the change in flux. Which part specifically confuses you?", upvotes: 8, date: "2024-03-10T10:30:00Z" },
  { postId: 103, forumId: 1, userId: 2, content: "Thanks Mr. Silva! That helps. I was getting the direction wrong.", upvotes: 2, date: "2024-03-10T11:00:00Z" },

  // Posts for Forum 2 (Maths)
  { postId: 201, forumId: 2, userId: 5, content: "What's the best way to manage time during the Combined Maths Paper II? I always run out of time.", upvotes: 12, date: "2024-03-11T08:15:00Z" },
  { postId: 202, forumId: 2, userId: 1, content: "I try to allocate specific time slots for each question type (Pure vs Applied) beforehand. Also, don't get stuck on one question for too long!", upvotes: 6, date: "2024-03-11T09:00:00Z" },

  // Posts for Forum 3 (General)
   { postId: 301, forumId: 3, userId: 2, content: "Feeling really burnt out lately. Any tips for staying motivated?", upvotes: 15, date: "2024-03-08T14:00:00Z" },
   { postId: 302, forumId: 3, userId: 3, content: "Remember to take short breaks, Bhanu! The Pomodoro technique can be helpful. Also, setting small, achievable goals each day can make a big difference.", upvotes: 10, date: "2024-03-09T15:00:00Z" },

   // Posts for Forum 4 (Chemistry)
   { postId: 401, forumId: 4, userId: 1, content: "Can someone explain the SN1 reaction mechanism again? I keep mixing it up with SN2.", upvotes: 3, date: "2024-03-11T11:05:00Z"},

  // Add more posts...
];

// Helper to get posts for a specific forum
export const getPostsByForumId = (forumId: number): Post[] => {
  return mockPosts
    .filter(post => post.forumId === forumId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
};

// Helper to get a single post by ID (might be useful later for replies)
export const getPostById = (postId: number): Post | undefined => {
    return mockPosts.find(post => post.postId === postId);
}