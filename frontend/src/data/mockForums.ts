export interface Forum {
    forumId: number;
    topic: string;
    description: string; 
    postCount?: number; 
    lastActivity?: string; 
  }
  
  export const mockForums: Forum[] = [
    {
      forumId: 1,
      topic: "Physics - Unit 3 Doubts",
      description: "Discuss questions and concepts related to the third unit of the Physics syllabus.",
      postCount: 15, // Example value
      lastActivity: "2024-03-10T10:30:00Z",
    },
    {
      forumId: 2,
      topic: "Combined Maths - Past Paper Strategies",
      description: "Share tips, tricks, and strategies for tackling Combined Mathematics past papers effectively.",
      postCount: 28, // Example value
      lastActivity: "2024-03-11T08:15:00Z",
    },
    {
      forumId: 3,
      topic: "General Study Tips & Motivation",
      description: "A place to share general advice on studying, time management, and staying motivated for A/Ls.",
      postCount: 42, // Example value
      lastActivity: "2024-03-09T15:00:00Z",
    },
     {
      forumId: 4,
      topic: "Chemistry - Organic Chemistry Reactions",
      description: "Ask questions and discuss specific organic chemistry reaction mechanisms.",
      postCount: 8, // Example value
      lastActivity: "2024-03-11T11:05:00Z",
    },
    // Add more forums
  ];
  
  export const getForumById = (id: number): Forum | undefined => {
      return mockForums.find(forum => forum.forumId === id);
  }