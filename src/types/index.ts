
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'school' | 'admin';
  schoolId?: string | null;
  profilePicture?: string;
}

export interface School extends User {
  logo?: string;
  description?: string;
  location?: string;
  contact?: string;
  athletes?: string[];
  pricing?: {
    pricePerStudent: number; // in cents
    commission?: number;
  };
}

export interface Athlete extends User {
  belt: string;
  stripes: number;
  weight?: number;
  trainingHistory?: {
    startDate: string;
    yearsTraining: number;
  };
  achievements?: string[];
  schoolId?: string;
  subscriptionStatus?: 'trial' | 'active' | 'cancelled' | 'none';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  difficulty: string;
  pointsSystem: {
    type: string;
    scaling?: boolean;
    maxPoints?: number;
  };
  participants: string[];
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
  trainingType: 'gi' | 'no-gi';
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
  partners?: string[];
  private: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  criteria: {
    type: string;
    count: number;
    specificType?: string;
  };
}

export interface PricingConfig {
  id: string;
  minPrice: number; // in cents
  maxPrice: number; // in cents
  commissionRate: number; // percentage
  commissionThreshold: number; // in cents
}

export interface SchoolSubscription {
  id: string;
  schoolId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  pricePerStudent: number; // in cents
  commissionRate: number; // percentage
  commissionAmount: number; // in cents
  status: 'pending' | 'active' | 'cancelled' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
