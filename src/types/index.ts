export interface User {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'school' | 'admin';
  schoolId?: string | null;
}

export interface School {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface Athlete {
  id: string;
  name: string;
  profilePicture?: string;
  belt: string;
  stripes: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
}
