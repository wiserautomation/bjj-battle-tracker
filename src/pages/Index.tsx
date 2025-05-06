
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Trophy, Award, Calendar, Notebook, MessageSquare, Bell, Search, School } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ChallengesList from "@/components/challenges/ChallengesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentJournalEntries from "@/components/dashboard/RecentJournalEntries";
import AchievementsList from "@/components/dashboard/AchievementsList";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { currentUser, hasSchool } = useApp();
  const navigate = useNavigate();
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  
  const isAthlete = currentUser?.role === 'athlete';
  const isSchool = currentUser?.role === 'school';
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
      return;
    }
    
    // For schools, redirect to the school dashboard
    if (currentUser?.role === 'school') {
      console.log("Redirecting school user to school dashboard");
      navigate('/school-dashboard', { replace: true });
      return;
    }
  }, [currentUser, navigate]);
  
  // Return null during redirecting to prevent flash of content
  if (isSchool) {
    return null;
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Welcome to JU-PLAY{currentUser?.name ? `, ${currentUser.name}` : ''}
          </h1>
          {isAthlete && (
            <p className="text-muted-foreground">
              {hasJoinedSchool
                ? "Track your progress and conquer new challenges"
                : "Join a school to start tracking your progress and participating in challenges"}
            </p>
          )}
        </div>
        
        {isAthlete && !hasJoinedSchool && !showSchoolSearch && (
          <div className="space-y-4">
            <Card className="border-2 border-dashed border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Find Your School
                </CardTitle>
                <CardDescription>
                  You need to join a Brazilian Jiu-Jitsu school to access all features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Search for your school to access features like challenges, progress tracking, and rankings.
                  </p>
                  <Button 
                    onClick={() => setShowSchoolSearch(true)}
                    size="lg"
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Find and Join a School
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {isAthlete && !hasJoinedSchool && showSchoolSearch && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5" />
                      Find Your School
                    </CardTitle>
                    <CardDescription>
                      Search for your Brazilian Jiu-Jitsu school to access all features
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSchoolSearch(false)}
                  >
                    Hide Search
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2">Important</Badge>
                  <p className="text-sm text-muted-foreground mb-2">
                    You need to join a school to access features like:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>Challenges and competitions</li>
                    <li>Progress tracking</li>
                    <li>Rankings and achievements</li>
                  </ul>
                </div>
                <SchoolEnrollment />
              </CardContent>
            </Card>
          </div>
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
            <Tabs defaultValue="challenges" className="space-y-4">
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
                    {hasJoinedSchool ? (
                      <p>Ranking information will display here after you complete challenges.</p>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Join a school to see rankings.
                      </p>
                    )}
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
          ) : null
        ) : null}
      </div>
    </MainLayout>
  );
};

export default Index;
