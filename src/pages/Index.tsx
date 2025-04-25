import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Calendar, Notebook } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ChallengesList from "@/components/challenges/ChallengesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentJournalEntries from "@/components/dashboard/RecentJournalEntries";
import AchievementsList from "@/components/dashboard/AchievementsList";

const Index = () => {
  const { currentUser, getChallengesByAthlete, getAthleteResults } = useApp();
  
  const isAthlete = currentUser?.role === 'athlete';
  
  // Calculate stats for athlete
  let activeChallenges = 0;
  let completedChallenges = 0;
  let totalPoints = 0;
  
  if (isAthlete) {
    const challenges = getChallengesByAthlete(currentUser!.id);
    const now = new Date();
    
    activeChallenges = challenges.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      return now >= startDate && now <= endDate;
    }).length;
    
    completedChallenges = challenges.filter(challenge => {
      return new Date() > new Date(challenge.endDate);
    }).length;
    
    const results = getAthleteResults(currentUser!.id);
    totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome{currentUser ? `, ${currentUser.name}` : ''}</h1>
          <p className="text-muted-foreground">Track your progress and conquer new challenges</p>
        </div>
        
        {isAthlete && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Active Challenges" 
              value={activeChallenges} 
              icon={<Trophy className="h-4 w-4" />} 
            />
            <StatCard 
              title="Points Earned" 
              value={totalPoints} 
              icon={<Award className="h-4 w-4" />} 
            />
            <StatCard 
              title="Challenges Completed" 
              value={completedChallenges} 
              icon={<Calendar className="h-4 w-4" />} 
            />
            <StatCard 
              title="Journal Entries" 
              value={3} 
              icon={<Notebook className="h-4 w-4" />} 
            />
          </div>
        )}
        
        <Tabs defaultValue="challenges" className="space-y-4">
          <TabsList>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            {isAthlete && (
              <TabsTrigger value="progress">Your Progress</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="challenges" className="space-y-4">
            <ChallengesList />
          </TabsContent>
          
          {isAthlete && (
            <TabsContent value="progress">
              <div className="grid md:grid-cols-2 gap-4">
                <RecentJournalEntries />
                <AchievementsList />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Index;
