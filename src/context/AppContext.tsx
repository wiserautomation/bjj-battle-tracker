
import { createContext, useContext, useState, ReactNode } from 'react';
import { Athlete, Badge, Challenge, ChallengeResult, JournalEntry, School, User } from '../types';
import { mockDataService } from '../services/mockData';

interface AppContextType {
  currentUser: User | null;
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  getSchools: () => School[];
  getSchoolById: (id: string) => School | undefined;
  getAthletes: () => Athlete[];
  getAthleteById: (id: string) => Athlete | undefined;
  getAthletesBySchool: (schoolId: string) => Athlete[];
  getChallenges: () => Challenge[];
  getChallengeById: (id: string) => Challenge | undefined;
  getChallengesBySchool: (schoolId: string) => Challenge[];
  getChallengesByAthlete: (athleteId: string) => Challenge[];
  getChallengeResults: (challengeId: string) => ChallengeResult[];
  getAthleteResults: (athleteId: string) => ChallengeResult[];
  getJournalEntriesByAthlete: (athleteId: string) => JournalEntry[];
  getBadges: () => Badge[];
  getAthleteBadges: (athleteId: string) => Badge[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockDataService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const value = {
    currentUser,
    loading,
    setCurrentUser,
    getSchools: mockDataService.getSchools,
    getSchoolById: mockDataService.getSchoolById,
    getAthletes: mockDataService.getAthletes,
    getAthleteById: mockDataService.getAthleteById,
    getAthletesBySchool: mockDataService.getAthletesBySchool,
    getChallenges: mockDataService.getChallenges,
    getChallengeById: mockDataService.getChallengeById,
    getChallengesBySchool: mockDataService.getChallengesBySchool,
    getChallengesByAthlete: mockDataService.getChallengesByAthlete,
    getChallengeResults: mockDataService.getChallengeResults,
    getAthleteResults: mockDataService.getAthleteResults,
    getJournalEntriesByAthlete: mockDataService.getJournalEntriesByAthlete,
    getBadges: mockDataService.getBadges,
    getAthleteBadges: mockDataService.getAthleteBadges,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
