

const mockUsers = [
  {
    id: '1',
    name: 'Ananto Paul',
    email: 'anantopaul@diu.edu.bd',
    totalUploads: 45,
    averageRating: 4.8,
    studentsHelped: 230,
    badges: ['Best Note Taker', 'Top Contributor']
  },
  {
    id: '2',
    name: 'Md. Amir molla',
    email: 'amir@diu.edu.bd',
    totalUploads: 38,
    averageRating: 4.7,
    studentsHelped: 198,
    badges: ['Best Note Taker']
  },
  {
    id: '3',
    name: 'Anim',
    email: 'Anim@diu.edu.bd',
    totalUploads: 32,
    averageRating: 4.6,
    studentsHelped: 175,
    badges: ['Top Contributor']
  }
];

const mockCourses = [
  { code: 'CSE311', name: 'Database Management', semester: 'Fall 2025', notesCount: 24 },
  { code: 'CSE101', name: 'Introduction to Programming', semester: 'Fall 2025', notesCount: 36 },
  { code: 'CSE215', name: 'Data Structures', semester: 'Fall 2025', notesCount: 28 },
  { code: 'CSE323', name: 'Operating Systems', semester: 'Fall 2025', notesCount: 19 },
  { code: 'CSE425', name: 'Software Engineering', semester: 'Fall 2025', notesCount: 22 },
  { code: 'ENG101', name: 'English Fundamentals', semester: 'Fall 2025', notesCount: 31 },
  { code: 'MAT101', name: 'Calculus I', semester: 'Fall 2025', notesCount: 27 }
];

const mockNotes = [
  {
    id: '1',
    title: 'SQL Queries & Normalization',
    courseCode: 'CSE311',
    courseName: 'Database Management',
    topic: 'SQL & Database Design',
    date: '2025-10-20',
    uploadedBy: mockUsers[0],
    fileUrl: '/mock-pdf-1.pdf',
    fileType: 'pdf',
    rating: 4.8,
    totalRatings: 42,
    reviews: [
      {
        id: 'r1',
        userId: '2',
        userName: 'Fatima Khan',
        rating: 5,
        comment: 'Excellent notes! Very clear explanations.',
        helpful: 12,
        date: '2025-10-21'
      }
    ],
    downloads: 156
  },
  {
    id: '2',
    title: 'Variables & Data Types',
    courseCode: 'CSE101',
    courseName: 'Introduction to Programming',
    topic: 'C Programming Basics',
    date: '2025-10-19',
    uploadedBy: mockUsers[1],
    fileUrl: '/mock-pdf-2.pdf',
    fileType: 'pdf',
    rating: 4.7,
    totalRatings: 38,
    reviews: [],
    downloads: 142
  },
  {
    id: '3',
    title: 'Stack & Queue Implementation',
    courseCode: 'CSE215',
    courseName: 'Data Structures',
    topic: 'Linear Data Structures',
    date: '2025-10-18',
    uploadedBy: mockUsers[2],
    fileUrl: '/mock-pdf-3.pdf',
    fileType: 'pdf',
    rating: 4.9,
    totalRatings: 51,
    reviews: [],
    downloads: 189
  },
  {
    id: '4',
    title: 'Process Scheduling Algorithms',
    courseCode: 'CSE323',
    courseName: 'Operating Systems',
    topic: 'CPU Scheduling',
    date: '2025-10-17',
    uploadedBy: mockUsers[0],
    fileUrl: '/mock-pdf-4.pdf',
    fileType: 'pdf',
    rating: 4.6,
    totalRatings: 29,
    reviews: [],
    downloads: 98
  },
  {
    id: '5',
    title: 'Binary Search Trees',
    courseCode: 'CSE215',
    courseName: 'Data Structures',
    topic: 'Trees',
    date: '2025-10-16',
    uploadedBy: mockUsers[1],
    fileUrl: '/mock-pdf-5.pdf',
    fileType: 'pdf',
    rating: 4.8,
    totalRatings: 45,
    reviews: [],
    downloads: 167
  }
];

const mockRequests = [
  {
    id: 'req1',
    courseCode: 'CSE311',
    courseName: 'Database Management',
    topic: 'Transaction Management & ACID Properties',
    description: 'Looking for detailed notes on transaction management concepts.',
    requestedBy: 'Karim Hasan',
    date: '2025-10-22',
    fulfilled: false
  },
  {
    id: 'req2',
    courseCode: 'CSE425',
    courseName: 'Software Engineering',
    topic: 'Agile Methodology',
    description: 'Need notes covering Scrum and Kanban frameworks.',
    requestedBy: 'Nadia Islam',
    date: '2025-10-21',
    fulfilled: false
  },
  {
    id: 'req3',
    courseCode: 'CSE215',
    courseName: 'Data Structures',
    topic: 'Graph Algorithms - DFS & BFS',
    description: 'Comprehensive notes with examples needed.',
    requestedBy: 'Tanvir Ahmed',
    date: '2025-10-20',
    fulfilled: true
  }
];
