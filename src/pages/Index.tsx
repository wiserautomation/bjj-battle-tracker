
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Calendar, Notebook, MessageSquare, Bell } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ChallengesList from "@/components/challenges/ChallengesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentJournalEntries from "@/components/dashboard/RecentJournalEntries";
import AchievementsList from "@/components/dashboard/AchievementsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RankedAthlete {
  id: string;
  name: string;
  belt: string;
  stripes: number;
  points: number;
  profilePicture?: string;
}

const Index = () => {
  const { currentUser, getChallengesByAthlete, getAthleteResults, hasSchool } = useApp();
  const navigate = useNavigate();
  
  const isAthlete = currentUser?.role === 'athlete';
  const hasJoinedSchool = isAthlete && hasSchool(currentUser.id);
  
  // Calculate stats for athlete
  let activeChallenges = 0;
  let completedChallenges = 0;
  let totalPoints = 0;
  let unreadMessages = 0;
  let notifications = 0;
  
  useEffect(() => {
    // For administrators, redirect to the admin panel
    if (currentUser?.role === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);
  
  if (isAthlete && hasJoinedSchool) {
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

    // These would come from real messaging and notification systems in a production app
    unreadMessages = 0;
    notifications = 0;
  }
  
  // Mock ranked athletes data only if user has joined a school
  const rankedAthletes: RankedAthlete[] = hasJoinedSchool ? [
    { id: '1', name: 'Alex Johnson', belt: 'purple', stripes: 2, points: 840, profilePicture: "" },
    { id: '2', name: 'Sarah Williams', belt: 'blue', stripes: 4, points: 720, profilePicture: "" },
    { id: currentUser?.id || '3', name: currentUser?.name || 'You', belt: (currentUser as any)?.belt || 'white', stripes: (currentUser as any)?.stripes || 0, points: totalPoints, profilePicture: currentUser?.profilePicture },
    { id: '4', name: 'Mike Brown', belt: 'blue', stripes: 3, points: 580, profilePicture: "" },
    { id: '5', name: 'Emma Davis', belt: 'white', stripes: 4, points: 520, profilePicture: "" },
    { id: '6', name: 'Ryan Clark', belt: 'white', stripes: 3, points: 460, profilePicture: "" },
  ].sort((a, b) => b.points - a.points) : [];
  
  // Find user rank
  const userRank = hasJoinedSchool ? rankedAthletes.findIndex(athlete => athlete.id === currentUser?.id) + 1 : 0;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome to JU-PLAY{currentUser ? `, ${currentUser.name}` : ''}</h1>
          <p className="text-muted-foreground">Track your progress and conquer new challenges</p>
        </div>
        
        {isAthlete && !hasJoinedSchool && (
          <SchoolEnrollment />
        )}
        
        {(isAthlete && hasJoinedSchool) && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <StatCard 
              title="Active Challenges" 
              value={activeChallenges} 
              icon={<Trophy className="h-4 w-4" />} 
              className="col-span-1"
            />
            <StatCard 
              title="Points Earned" 
              value={totalPoints} 
              icon={<Award className="h-4 w-4" />} 
              className="col-span-1"
            />
            <StatCard 
              title="Your Rank" 
              value={`#${userRank}`} 
              description={`of ${rankedAthletes.length} athletes`}
              icon={<Trophy className="h-4 w-4" />} 
              className="col-span-1"
            />
            <StatCard 
              title="Challenges Done" 
              value={completedChallenges} 
              icon={<Calendar className="h-4 w-4" />} 
              className="col-span-1"
            />
            <StatCard 
              title="Unread Messages" 
              value={unreadMessages} 
              icon={<MessageSquare className="h-4 w-4" />} 
              className="col-span-1"
            />
            <StatCard 
              title="Notifications" 
              value={notifications} 
              icon={<Bell className="h-4 w-4" />} 
              className="col-span-1"
            />
          </div>
        )}
        
        {(!isAthlete || hasJoinedSchool) ? (
          <Tabs defaultValue={isAthlete ? "rankings" : "challenges"} className="space-y-4">
            <TabsList>
              {isAthlete && (
                <TabsTrigger value="rankings">Rankings</TabsTrigger>
              )}
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              {isAthlete && (
                <TabsTrigger value="progress">Your Progress</TabsTrigger>
              )}
            </TabsList>
            
            {isAthlete && (
              <TabsContent value="rankings">
                <Card>
                  <CardHeader>
                    <CardTitle>School Rankings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {rankedAthletes.map((athlete, index) => {
                        const isCurrentUser = athlete.id === currentUser?.id;
                        return (
                          <div 
                            key={athlete.id}
                            className={`flex items-center justify-between p-3 rounded-md ${
                              isCurrentUser ? "bg-muted" : "hover:bg-accent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center h-7 w-7 rounded-full ${
                                index < 3 ? "bg-bjj-gold text-white" : "bg-muted-foreground/20"
                              } font-bold text-sm`}>
                                {index + 1}
                              </div>
                              <Avatar>
                                <AvatarImage src={athlete.profilePicture} alt={athlete.name} />
                                <AvatarFallback className={`bg-bjj-${athlete.belt}`}>
                                  {athlete.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {athlete.name} {isCurrentUser && "(You)"}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge variant="outline" className="capitalize">
                                    {athlete.belt} Belt
                                  </Badge>
                                  {Array.from({ length: athlete.stripes }).map((_, i) => (
                                    <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl">{athlete.points}</p>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p>To access all features like challenges, rankings, and journal tracking, please join a school first.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
