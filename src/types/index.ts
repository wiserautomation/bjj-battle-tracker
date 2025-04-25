
export type UserRole = 'athlete' | 'school';

export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

export interface School extends User {
  role: 'school';
  location: string;
  contact: string;
  description?: string;
  athletes: string[]; // IDs of associated athletes
}

export interface Athlete extends User {
  role: 'athlete';
  schoolId?: string;
  belt: Belt;
  stripes: number;
  weight?: number;
  trainingHistory?: {
    startDate: string;
    yearsTraining: number;
  };
  achievements: string[]; // IDs of achieved badges
}

export interface Challenge {
  id: string;
  createdBy: string; // School ID
  title: string;
  description: string;
  type: 'submission' | 'sparring' | 'technique' | 'attendance' | 'other';
  startDate: string;
  endDate: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  pointsSystem: {
    type: 'count' | 'completion' | 'custom';
    maxPoints?: number;
    scaling?: boolean;
  };
  participants: string[]; // Athlete IDs
}

export interface ChallengeResult {
  id: string;
  challengeId: string;
  athleteId: string;
  date: string;
  points: number;
  details?: {
    submissions?: number;
    submissionTypes?: string[];
    rounds?: number;
    notes?: string;
  };
}

export interface JournalEntry {
  id: string;
  athleteId: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  trainingType?: 'gi' | 'no-gi' | 'open-mat' | 'competition' | 'other';
  submissions: {
    achieved: {
      count: number;
      types: string[];
    };
    received: {
      count: number;
      types: string[];
    };
  };
  partners?: string[]; // Names or IDs of training partners
  private: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: {
    type: 'submissions' | 'training-days' | 'challenge-completion' | 'streak';
    count: number;
    specificType?: string; // For specific submission types, etc.
  };
}
