import { Badge } from "@/types";
import { mockAthletes } from "./athletes";

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

export const getBadges = (): Badge[] => mockBadges;

export const getAthleteBadges = (athleteId: string): Badge[] => {
  const athlete = mockAthletes.find(a => a.id === athleteId);
  if (!athlete) return [];
  return mockBadges.filter(badge => athlete.achievements.includes(badge.id));
};
