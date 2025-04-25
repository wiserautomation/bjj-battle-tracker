
import { Athlete, Badge, Challenge, ChallengeResult, JournalEntry, School, User } from "../types";

export const mockSchools: School[] = [
  {
    id: "school-1",
    name: "Elite BJJ Academy",
    email: "info@elitebjj.com",
    role: "school",
    location: "123 Main St, Anytown, USA",
    contact: "(555) 123-4567",
    description: "A premier BJJ academy focused on technical excellence and competitive success.",
    athletes: ["athlete-1", "athlete-2", "athlete-3"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "school-2",
    name: "Gracie Defense Systems",
    email: "contact@graciedefense.com",
    role: "school",
    location: "456 Oak Ave, Somewhere, USA",
    contact: "(555) 987-6543",
    description: "Traditional Gracie Jiu-Jitsu with a focus on self-defense applications.",
    athletes: ["athlete-4", "athlete-5"],
    profilePicture: "/placeholder.svg"
  }
];

export const mockAthletes: Athlete[] = [
  {
    id: "athlete-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "athlete",
    schoolId: "school-1",
    belt: "blue",
    stripes: 2,
    weight: 175,
    trainingHistory: {
      startDate: "2021-03-15",
      yearsTraining: 2
    },
    achievements: ["badge-1", "badge-3"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-2",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "athlete",
    schoolId: "school-1",
    belt: "purple",
    stripes: 1,
    weight: 155,
    trainingHistory: {
      startDate: "2019-06-22",
      yearsTraining: 4
    },
    achievements: ["badge-1", "badge-2", "badge-4"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-3",
    name: "Taylor Kim",
    email: "taylor@example.com",
    role: "athlete",
    schoolId: "school-1",
    belt: "white",
    stripes: 4,
    weight: 145,
    trainingHistory: {
      startDate: "2022-01-10",
      yearsTraining: 1
    },
    achievements: ["badge-1"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-4",
    name: "Jordan Patel",
    email: "jordan@example.com",
    role: "athlete",
    schoolId: "school-2",
    belt: "brown",
    stripes: 0,
    weight: 185,
    trainingHistory: {
      startDate: "2016-11-05",
      yearsTraining: 6
    },
    achievements: ["badge-1", "badge-2", "badge-3", "badge-4", "badge-5"],
    profilePicture: "/placeholder.svg"
  },
  {
    id: "athlete-5",
    name: "Casey Morgan",
    email: "casey@example.com",
    role: "athlete",
    schoolId: "school-2",
    belt: "black",
    stripes: 1,
    weight: 170,
    trainingHistory: {
      startDate: "2013-08-20",
      yearsTraining: 9
    },
    achievements: ["badge-1", "badge-2", "badge-3", "badge-4", "badge-5", "badge-6"],
    profilePicture: "/placeholder.svg"
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    createdBy: "school-1",
    title: "30-Day Submission Challenge",
    description: "Track and achieve as many submissions as you can in 30 days.",
    type: "submission",
    startDate: "2025-04-01",
    endDate: "2025-05-01",
    difficulty: "all-levels",
    pointsSystem: {
      type: "count",
      scaling: true
    },
    participants: ["athlete-1", "athlete-2", "athlete-3"]
  },
  {
    id: "challenge-2",
    createdBy: "school-1",
    title: "Technique Mastery: Triangle Chokes",
    description: "Practice and refine your triangle choke from multiple positions.",
    type: "technique",
    startDate: "2025-04-15",
    endDate: "2025-05-15",
    difficulty: "intermediate",
    pointsSystem: {
      type: "completion",
      maxPoints: 100
    },
    participants: ["athlete-1", "athlete-2"]
  },
  {
    id: "challenge-3",
    createdBy: "school-2",
    title: "Perfect Attendance Challenge",
    description: "Attend at least 20 classes in one month.",
    type: "attendance",
    startDate: "2025-04-01",
    endDate: "2025-05-01",
    difficulty: "all-levels",
    pointsSystem: {
      type: "count",
      maxPoints: 20
    },
    participants: ["athlete-4", "athlete-5"]
  }
];

export const mockChallengeResults: ChallengeResult[] = [
  {
    id: "result-1",
    challengeId: "challenge-1",
    athleteId: "athlete-1",
    date: "2025-04-15",
    points: 15,
    details: {
      submissions: 15,
      submissionTypes: ["armbar", "triangle", "kimura"]
    }
  },
  {
    id: "result-2",
    challengeId: "challenge-1",
    athleteId: "athlete-2",
    date: "2025-04-15",
    points: 22,
    details: {
      submissions: 22,
      submissionTypes: ["triangle", "rear-naked choke", "guillotine", "omoplata"]
    }
  },
  {
    id: "result-3",
    challengeId: "challenge-3",
    athleteId: "athlete-4",
    date: "2025-04-10",
    points: 8,
    details: {
      notes: "Attended 8 classes so far this month."
    }
  }
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: "journal-1",
    athleteId: "athlete-1",
    date: "2025-04-20",
    title: "Great rolling session today",
    content: "Really felt my guard passing improving. Coach gave good tips on pressure.",
    tags: ["guard passing", "rolling", "improvement"],
    trainingType: "gi",
    submissions: {
      achieved: {
        count: 3,
        types: ["armbar", "triangle"]
      },
      received: {
        count: 2,
        types: ["kimura", "americana"]
      }
    },
    partners: ["athlete-2", "athlete-3"],
    private: true
  },
  {
    id: "journal-2",
    athleteId: "athlete-2",
    date: "2025-04-19",
    title: "Competition prep",
    content: "Focused on takedowns and top pressure. Need to work on conditioning.",
    tags: ["competition", "takedowns", "top pressure"],
    trainingType: "no-gi",
    submissions: {
      achieved: {
        count: 4,
        types: ["guillotine", "rear-naked choke"]
      },
      received: {
        count: 1,
        types: ["heel hook"]
      }
    },
    private: false
  },
  {
    id: "journal-3",
    athleteId: "athlete-4",
    date: "2025-04-18",
    title: "Teaching the basics",
    content: "Helped teach the fundamentals class today. Refreshed my understanding of core principles.",
    tags: ["teaching", "basics", "fundamentals"],
    trainingType: "gi",
    submissions: {
      achieved: {
        count: 5,
        types: ["collar choke", "kimura", "ezekiel"]
      },
      received: {
        count: 0,
        types: []
      }
    },
    private: false
  }
];

export const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "First Blood",
    description: "Achieve your first submission in training",
    imageUrl: "/placeholder.svg",
    criteria: {
      type: "submissions",
      count: 1
    }
  },
  {
    id: "badge-2",
    name: "Submission Hunter",
    description: "Achieve 50 total submissions",
    imageUrl: "/placeholder.svg",
    criteria: {
      type: "submissions",
      count: 50
    }
  },
  {
    id: "badge-3",
    name: "Dedicated Student",
    description: "Attend 30 classes",
    imageUrl: "/placeholder.svg",
    criteria: {
      type: "training-days",
      count: 30
    }
  },
  {
    id: "badge-4",
    name: "Challenge Champion",
    description: "Complete 5 challenges",
    imageUrl: "/placeholder.svg",
    criteria: {
      type: "challenge-completion",
      count: 5
    }
  },
  {
    id: "badge-5",
    name: "Triangle Master",
    description: "Achieve 25 triangle submissions",
    imageUrl: "/placeholder.svg",
    criteria: {
      type: "submissions",
      count: 25,
      specificType: "triangle"
    }
  },
  {
    id: "badge-6",
    name: "Consistency King",
    description: "Train for 30 consecutive days",
    imageUrl: "/placeholder.svg",
    criteria: {
      type: "streak",
      count: 30
    }
  }
];

// Mock service to get data
export const mockDataService = {
  getCurrentUser: (): User => mockAthletes[0],
  
  getSchools: (): School[] => mockSchools,
  getSchoolById: (id: string): School | undefined => 
    mockSchools.find(school => school.id === id),
    
  getAthletes: (): Athlete[] => mockAthletes,
  getAthleteById: (id: string): Athlete | undefined => 
    mockAthletes.find(athlete => athlete.id === id),
  getAthletesBySchool: (schoolId: string): Athlete[] => 
    mockAthletes.filter(athlete => athlete.schoolId === schoolId),
    
  getChallenges: (): Challenge[] => mockChallenges,
  getChallengeById: (id: string): Challenge | undefined => 
    mockChallenges.find(challenge => challenge.id === id),
  getChallengesBySchool: (schoolId: string): Challenge[] => 
    mockChallenges.filter(challenge => challenge.createdBy === schoolId),
  getChallengesByAthlete: (athleteId: string): Challenge[] => {
    const athlete = mockAthletes.find(a => a.id === athleteId);
    if (!athlete) return [];
    return mockChallenges.filter(challenge => 
      challenge.participants.includes(athleteId) || 
      challenge.createdBy === athlete.schoolId
    );
  },
    
  getChallengeResults: (challengeId: string): ChallengeResult[] => 
    mockChallengeResults.filter(result => result.challengeId === challengeId),
  getAthleteResults: (athleteId: string): ChallengeResult[] => 
    mockChallengeResults.filter(result => result.athleteId === athleteId),
    
  getJournalEntriesByAthlete: (athleteId: string): JournalEntry[] => 
    mockJournalEntries.filter(entry => entry.athleteId === athleteId),
    
  getBadges: (): Badge[] => mockBadges,
  getAthleteBadges: (athleteId: string): Badge[] => {
    const athlete = mockAthletes.find(a => a.id === athleteId);
    if (!athlete) return [];
    return mockBadges.filter(badge => athlete.achievements.includes(badge.id));
  }
};
