export interface Resource {
    ResourceID: number;
    Title: string; 
    Type: 'Past Paper' | 'Model Paper' | 'Notes' | 'Video Lecture' | 'Other'; 
    Subject: string; // "Combined Maths", "Physics", "Chemistry", "Biology"
    FileURL: string; // Link to the actual resource 
    Description?: string; 
    UploadedDate: string; 
    year?: number; 
  }
  
  export const mockResources: Resource[] = [
    // {
    //   ResourceID: 1,
    //   title: "Combined Maths 2022 A/L Past Paper",
    //   type: "Past Paper",
    //   subject: "Combined Maths",
    //   year: 2022,
    //   fileURL: "/path/to/dummy-maths-2022.pdf", // Use relative paths or placeholder URLs for now
    //   description: "Official G.C.E Advanced Level examination paper from 2022.",
    //   uploadedDate: "2023-10-26",
    // },
    // {
    //   ResourceID: 2,
    //   title: "Physics Unit 1 - Measurement Notes",
    //   type: "Notes",
    //   subject: "Physics",
    //   fileURL: "/path/to/dummy-physics-notes.pdf",
    //   description: "Comprehensive notes covering the first unit of the Physics syllabus.",
    //   uploadedDate: "2023-09-15",
    // },
    // {
    //   ResourceID: 3,
    //   title: "Chemistry Model Paper Set 1",
    //   type: "Model Paper",
    //   subject: "Chemistry",
    //   year: 2024,
    //   fileURL: "/path/to/dummy-chem-model.pdf",
    //   description: "A challenging model paper simulating exam conditions.",
    //   uploadedDate: "2024-01-20",
    // },
    // {
    //   ResourceID: 4,
    //   title: "Biology 2021 A/L Past Paper",
    //   type: "Past Paper",
    //   subject: "Biology",
    //   year: 2021,
    //   fileURL: "/path/to/dummy-bio-2021.pdf",
    //   description: "Official G.C.E Advanced Level examination paper from 2021.",
    //   uploadedDate: "2023-11-01",
    // },
    //  {
    //   ResourceID: 5,
    //   title: "Introduction to Organic Chemistry Video",
    //   type: "Video Lecture",
    //   subject: "Chemistry",
    //   fileURL: "https://www.youtube.com/watch?v=example", // Example external link
    //   description: "Introductory video lecture on key organic chemistry concepts.",
    //   uploadedDate: "2024-02-10",
    // },
    // Add more resources...
  ];
  
  // Add helper function if needed, e.g., getResourceById
  export const getResourceById = (id: number): Resource | undefined => {
      return mockResources.find(resource => resource.ResourceID === id);
  }