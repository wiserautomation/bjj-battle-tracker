import { Challenge, ChallengeResult } from "@/types";

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

export const getChallengeById = (id: string): Challenge | undefined => 
  mockChallenges.find(challenge => challenge.id === id);

export const getChallengesBySchool = (schoolId: string): Challenge[] => 
  mockChallenges.filter(challenge => challenge.createdBy === schoolId);

export const getChallengesByAthlete = (athleteId: string, userSchoolId?: string): Challenge[] => 
  mockChallenges.filter(challenge => 
    challenge.participants.includes(athleteId) || 
    challenge.createdBy === userSchoolId
  );

export const getChallengeResults = (challengeId: string): ChallengeResult[] => 
  mockChallengeResults.filter(result => result.challengeId === challengeId);

export const getAthleteResults = (athleteId: string): ChallengeResult[] => 
  mockChallengeResults.filter(result => result.athleteId === athleteId);
