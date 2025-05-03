import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Athlete, Badge, Challenge, ChallengeResult, JournalEntry, School, User } from '../types';
import { mockDataService } from '../services/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  logout: () => Promise<void>;
  createChallenge: (challenge: Partial<Challenge>) => void;
  sendNotification: (title: string, message: string, recipientIds: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  // Check for authenticated user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check current auth session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Try to get user data from Supabase
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user) {
            // Extract relevant user information from metadata
            const metadata = userData.user.user_metadata;
            
            // Ensure role is properly set
            const role = metadata?.role || "athlete";
            
            // Create user object with data from Supabase
            const user: User = {
              id: userData.user.id,
              name: metadata?.name || "Unknown User",
              email: userData.user.email || "",
              role: role,
              profilePicture: metadata?.avatar_url || "/placeholder.svg",
              schoolId: metadata?.schoolId || null
            };
            
            console.log("User authenticated:", user);
            setCurrentUser(user);
          }
        } else {
          // No active session
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your login status.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const metadata = userData.user.user_metadata;
            
            const role = metadata?.role || "athlete";
            
            const user: User = {
              id: userData.user.id,
              name: metadata?.name || "Unknown User",
              email: userData.user.email || "",
              role: role,
              profilePicture: metadata?.avatar_url || "/placeholder.svg",
              schoolId: metadata?.schoolId || null
            };
            
            console.log("Auth state changed:", user);
            setCurrentUser(user);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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

        // Update user metadata in Supabase
        const { error } = await supabase.auth.updateUser({
          data: { schoolId }
        });

        if (error) throw error;
        
        toast({
          title: "School joined successfully",
          description: "You are now a member of this school"
        });
        
        return Promise.resolve();
      }
      return Promise.reject("User is not an athlete");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to join school",
        description: error.message || "An error occurred"
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const hasSchool = (athleteId: string) => {
    if (currentUser && currentUser.id === athleteId) {
      return !!currentUser.schoolId;
    }
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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      return Promise.resolve();
    } catch (error) {
      console.error("Error signing out:", error);
      return Promise.reject(error);
    }
  };
  
  const createChallenge = (challenge: Partial<Challenge>) => {
    if (!currentUser || currentUser.role !== 'school') return;
    
    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: challenge.title || 'New Challenge',
      description: challenge.description || '',
      type: challenge.type || 'submission',
      startDate: challenge.startDate || new Date().toISOString(),
      endDate: challenge.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: currentUser.id,
      difficulty: challenge.difficulty || 'medium',
      pointsSystem: challenge.pointsSystem || {
        type: 'fixed',
        scaling: false,
        maxPoints: 100
      },
      participants: challenge.participants || []
    };
    
    setChallenges(prev => [newChallenge, ...prev]);
  };
  
  const sendNotification = (title: string, message: string, recipientIds: string[]) => {
    if (!currentUser || currentUser.role !== 'school') return;
    
    const newNotification = {
      id: `notification-${Date.now()}`,
      title,
      message,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      recipients: recipientIds
    };
    
    setNotifications(prev => [newNotification, ...prev]);
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
    getChallenges: () => {
      // Return mock challenges and any created by schools
      const mockChallenges = mockDataService.getChallenges();
      return [...mockChallenges, ...challenges];
    },
    getChallengeById: (id: string) => {
      // Check both mock challenges and created challenges
      const customChallenge = challenges.find(c => c.id === id);
      if (customChallenge) return customChallenge;
      return mockDataService.getChallengeById(id);
    },
    getChallengesBySchool: (schoolId: string) => {
      // Combine mock challenges and created challenges for a school
      const mockChallenges = mockDataService.getChallengesBySchool(schoolId);
      const createdChallenges = challenges.filter(c => c.createdBy === schoolId);
      return [...mockChallenges, ...createdChallenges];
    },
    getChallengesByAthlete: (athleteId: string) => {
      // Get challenges based on athlete's school
      const athlete = mockDataService.getAthleteById(athleteId);
      if (!athlete || !athlete.schoolId) return [];
      
      const mockChallenges = mockDataService.getChallengesBySchool(athlete.schoolId);
      const createdChallenges = challenges.filter(c => c.createdBy === athlete.schoolId);
      return [...mockChallenges, ...createdChallenges];
    },
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
    addJournalEntry,
    logout,
    createChallenge,
    sendNotification
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
