
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Award, Calendar, Notebook, MessageSquare, Bell } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ChallengesList from "@/components/challenges/ChallengesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentJournalEntries from "@/components/dashboard/RecentJournalEntries";
import AchievementsList from "@/components/dashboard/AchievementsList";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { currentUser, hasSchool } = useApp();
  const navigate = useNavigate();
  
  const isAthlete = currentUser?.role === 'athlete';
  const hasJoinedSchool = isAthlete && currentUser && hasSchool(currentUser.id);
  
  // Metrics should be zero until user joins a school
  const activeChallenges = 0;
  const completedChallenges = 0;
  const totalPoints = 0;
  const unreadMessages = 0;
  const notifications = 0;
  const userRank = 0;
  
  useEffect(() => {
    // For administrators, redirect to the admin panel
    if (currentUser?.role === 'admin') {
      navigate('/admin');
    }
    
    // For schools, redirect to the school dashboard
    if (currentUser?.role === 'school') {
      navigate('/school-dashboard');
    }
  }, [currentUser, navigate]);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome to JU-PLAY{currentUser ? `, ${currentUser.name}` : ''}
          </h1>
          {isAthlete && (
            <p className="text-muted-foreground">
              {hasJoinedSchool
                ? "Track your progress and conquer new challenges"
                : "Join a school to start tracking your progress and participating in challenges"}
            </p>
          )}
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
              description={hasJoinedSchool ? "" : "Join a school to rank"}
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
        
        {isAthlete ? (
          hasJoinedSchool ? (
            <Tabs defaultValue="rankings" className="space-y-4">
              <TabsList>
                <TabsTrigger value="rankings">Rankings</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="progress">Your Progress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rankings">
                <Card>
                  <CardHeader>
                    <CardTitle>School Rankings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-4">
                      Complete challenges to earn points and improve your ranking.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="challenges" className="space-y-4">
                <ChallengesList />
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="grid md:grid-cols-2 gap-4">
                  <RecentJournalEntries />
                  <AchievementsList />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>To access all features like challenges, rankings, and journal tracking, please join a school first.</p>
                <Button asChild variant="default">
                  <Link to="/dashboard">Join a School</Link>
                </Button>
              </CardContent>
            </Card>
          )
        ) : null}
      </div>
    </MainLayout>
  );
};

export default Index;
