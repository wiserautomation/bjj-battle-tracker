
import { useState } from "react";
import { Plus, Trophy, MessageSquare } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { DashboardStats } from "@/components/school-dashboard/DashboardStats";
import { AthletesList } from "@/components/school-dashboard/AthletesList";
import { ChallengesList } from "@/components/school-dashboard/ChallengesList";
import { JoinRequests } from "@/components/school-dashboard/JoinRequests";
import { ChallengeDialog } from "@/components/school-dashboard/dialogs/ChallengeDialog";
import { NotificationDialog } from "@/components/school-dashboard/dialogs/NotificationDialog";
import { EventDialog } from "@/components/school-dashboard/dialogs/EventDialog";
import { ScheduleTab } from "@/components/school-dashboard/ScheduleTab";

const SchoolDashboardPage = () => {
  const { currentUser, getAthletes, getAthletesBySchool, getChallengesBySchool } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState([
    { id: "req1", name: "John Doe", belt: "purple", stripes: 2, profilePicture: "" },
    { id: "req2", name: "Jane Smith", belt: "blue", stripes: 4, profilePicture: "" },
  ]);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const { toast } = useToast();
  
  if (!currentUser || currentUser.role !== 'school') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Only schools can access the school dashboard.</p>
        </div>
      </MainLayout>
    );
  }
  
  const schoolAthletes = getAthletesBySchool(currentUser.id);
  const schoolChallenges = getChallengesBySchool(currentUser.id);
  const filteredAthletes = schoolAthletes.filter(
    athlete => athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAcceptAthlete = (athleteId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== athleteId));
    toast({
      title: "Athlete accepted",
      description: "The athlete has been added to your school.",
    });
  };
  
  const handleRejectAthlete = (athleteId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== athleteId));
    toast({
      title: "Athlete rejected",
      description: "The athlete request has been rejected.",
    });
  };
  
  const onCreateChallenge = (data: any) => {
    toast({
      title: "Challenge created",
      description: `New challenge "${data.title}" has been created.`,
    });
    setShowChallengeDialog(false);
  };
  
  const onCreateEvent = (data: any) => {
    toast({
      title: "Event added",
      description: `New ${data.eventType} "${data.title}" has been added to the calendar.`,
    });
    setShowEventDialog(false);
  };
  
  const onSendNotification = (data: any) => {
    toast({
      title: "Notification sent",
      description: "Your notification has been sent to all school athletes.",
    });
    setShowNotificationDialog(false);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">School Dashboard</h1>
            <p className="text-muted-foreground">Manage your athletes and school activities</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setShowNotificationDialog(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
            <Button onClick={() => setShowChallengeDialog(true)}>
              <Trophy className="mr-2 h-4 w-4" />
              New Challenge
            </Button>
          </div>
        </div>
        
        <DashboardStats 
          totalAthletes={schoolAthletes.length}
          activeChallenges={schoolChallenges.filter(c => new Date(c.endDate) >= new Date()).length}
          pendingRequests={pendingRequests.length}
        />
        
        <Tabs defaultValue="athletes" className="space-y-4">
          <TabsList className="grid grid-cols-4 max-w-xl">
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="requests">Join Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="athletes">
            <AthletesList
              athletes={filteredAthletes}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </TabsContent>
          
          <TabsContent value="challenges">
            <ChallengesList
              challenges={schoolChallenges}
              onNewChallenge={() => setShowChallengeDialog(true)}
            />
          </TabsContent>
          
          <TabsContent value="schedule">
            <ScheduleTab onAddEvent={() => setShowEventDialog(true)} />
          </TabsContent>
          
          <TabsContent value="requests">
            <JoinRequests
              requests={pendingRequests}
              onAccept={handleAcceptAthlete}
              onReject={handleRejectAthlete}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <ChallengeDialog 
        open={showChallengeDialog}
        onOpenChange={setShowChallengeDialog}
        onSubmit={onCreateChallenge}
      />
      
      <EventDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        onSubmit={onCreateEvent}
      />
      
      <NotificationDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        onSubmit={onSendNotification}
      />
    </MainLayout>
  );
};

export default SchoolDashboardPage;
