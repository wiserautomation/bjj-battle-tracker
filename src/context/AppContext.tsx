
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  addJournalEntry: (entry: Partial<JournalEntry>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockDataService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockDataService.getJournalEntriesByAthlete(currentUser?.id || ''));

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
    setLoading(true);
    try {
      // In a real app, this would be a call to the backend
      if (currentUser && currentUser.role === 'athlete') {
        const updatedUser = {
          ...currentUser,
          schoolId
        };
        setCurrentUser(updatedUser);
        return Promise.resolve();
      }
      return Promise.reject("User is not an athlete");
    } finally {
      setLoading(false);
    }
  };

  const hasSchool = (athleteId: string) => {
    const athlete = mockDataService.getAthleteById(athleteId);
    return !!athlete?.schoolId;
  };
  
  const addJournalEntry = (entry: Partial<JournalEntry>) => {
    if (!currentUser || currentUser.role !== 'athlete') return;
    
    const newEntry: JournalEntry = {
      id: entry.id || `journal-${Date.now()}`,
      athleteId: currentUser.id,
      date: entry.date || new Date().toISOString().split('T')[0],
      title: entry.title || '',
      content: entry.content || '',
      tags: entry.tags || [],
      trainingType: entry.trainingType || 'gi',
      submissions: entry.submissions || {
        achieved: {
          count: 0,
          types: []
        },
        received: {
          count: 0,
          types: []
        }
      },
      private: entry.private !== undefined ? entry.private : true,
      partners: entry.partners || []
    };
    
    setJournalEntries(prev => [newEntry, ...prev]);
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
    getJournalEntriesByAthlete: (athleteId: string) => {
      // Return local state for current user, or mock data for other users
      return currentUser && athleteId === currentUser.id 
        ? journalEntries 
        : mockDataService.getJournalEntriesByAthlete(athleteId);
    },
    getBadges: mockDataService.getBadges,
    getAthleteBadges: mockDataService.getAthleteBadges,
    logChallengeAchievement,
    joinSchool,
    hasSchool,
    addJournalEntry
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
