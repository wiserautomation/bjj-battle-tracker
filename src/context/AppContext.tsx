
import { createContext, useContext, useState, ReactNode } from 'react';
import { Athlete, Badge, Challenge, ChallengeResult, JournalEntry, School, User } from '../types';
import { mockDataService } from '../services/mockData';

interface LogAchievementParams {
  challengeId: string;
  count: number;
  notes?: string;
}

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
  logChallengeAchievement: (params: LogAchievementParams) => void;
  joinSchool: (athleteId: string, schoolId: string) => Promise<void>;
  hasSchool: (athleteId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockDataService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const logChallengeAchievement = ({ challengeId, count, notes }: LogAchievementParams) => {
    if (!currentUser || currentUser.role !== 'athlete') return;
    
    return mockDataService.logChallengeAchievement({
      challengeId,
      athleteId: currentUser.id,
      count,
      notes,
    });
  };

  const joinSchool = async (athleteId: string, schoolId: string) => {
    // In a real app, this would be a call to the backend
    // For our mock, we'll update the current user
    if (currentUser && currentUser.role === 'athlete') {
      const updatedUser = {
        ...currentUser,
        schoolId
      };
      setCurrentUser(updatedUser);
      return Promise.resolve();
    }
    return Promise.reject("User is not an athlete");
  };

  const hasSchool = (athleteId: string) => {
    const athlete = mockDataService.getAthleteById(athleteId);
    return !!athlete?.schoolId;
  };

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
    logChallengeAchievement,
    joinSchool,
    hasSchool,
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
