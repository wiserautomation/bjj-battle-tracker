
import { useState, useEffect } from "react";
import { Plus, Trophy, MessageSquare, Calendar as CalendarIcon, Settings, Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { DashboardStats } from "@/components/school-dashboard/DashboardStats";
import { AthletesList } from "@/components/school-dashboard/AthletesList";
import { ChallengesList } from "@/components/school-dashboard/ChallengesList";
import { JoinRequests } from "@/components/school-dashboard/JoinRequests";
import { ChallengeDialog } from "@/components/school-dashboard/dialogs/ChallengeDialog";
import { NotificationDialog } from "@/components/school-dashboard/dialogs/NotificationDialog";
import { EventDialog } from "@/components/school-dashboard/dialogs/EventDialog";
import { ScheduleTab } from "@/components/school-dashboard/ScheduleTab";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  eventType: "class" | "seminar" | "competition" | "other";
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
}

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
  const [schoolEvents, setSchoolEvents] = useState<SchoolEvent[]>([
    {
      id: "event1",
      title: "No-Gi Training",
      description: "Technical training focused on No-Gi techniques",
      eventType: "class",
      date: "2025-05-10",
      startTime: "18:00",
      endTime: "20:00",
      location: "Main Training Room"
    },
    {
      id: "event2",
      title: "Competition Preparation",
      description: "Training session for upcoming tournament",
      eventType: "class",
      date: "2025-05-15",
      startTime: "19:00",
      endTime: "21:00",
      location: "Main Training Room"
    }
  ]);
  const [sentNotifications, setSentNotifications] = useState([
    {
      id: "notif1",
      title: "New Schedule Changes",
      message: "We've updated our training schedule for next month.",
      createdAt: new Date().toISOString(),
      recipientCount: 45
    },
    {
      id: "notif2",
      title: "Tournament Registration Open",
      message: "Registration for the next in-house tournament is now open.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      recipientCount: 38
    }
  ]);
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
    const newEvent: SchoolEvent = {
      id: `event-${Date.now()}`,
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
    };
    
    setSchoolEvents([...schoolEvents, newEvent]);
    
    toast({
      title: "Event added",
      description: `New ${data.eventType} "${data.title}" has been added to the calendar.`,
    });
    setShowEventDialog(false);
  };
  
  const onSendNotification = (data: any) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: data.title,
      message: data.message,
      createdAt: new Date().toISOString(),
      recipientCount: schoolAthletes.length
    };
    
    setSentNotifications([newNotification, ...sentNotifications]);
    
    toast({
      title: "Notification sent",
      description: "Your notification has been sent to all school athletes.",
    });
    setShowNotificationDialog(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setSchoolEvents(schoolEvents.filter(event => event.id !== eventId));
    toast({
      title: "Event deleted",
      description: "The event has been removed from the calendar."
    });
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
              <Bell className="mr-2 h-4 w-4" />
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
          <TabsList className="grid grid-cols-5 max-w-xl">
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>School Calendar</CardTitle>
                  <CardDescription>Manage your classes, seminars, and events</CardDescription>
                </div>
                <Button onClick={() => setShowEventDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No events scheduled yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => setShowEventDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Event
                      </Button>
                    </div>
                  ) : (
                    schoolEvents
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(event => (
                        <div key={event.id} className="flex justify-between items-start border p-4 rounded-md">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                event.eventType === 'class' ? 'bg-green-100 text-green-800' :
                                event.eventType === 'seminar' ? 'bg-blue-100 text-blue-800' :
                                event.eventType === 'competition' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              {format(new Date(event.date), 'MMM d, yyyy')} • {event.startTime} - {event.endTime}
                            </p>
                            {event.location && (
                              <p className="text-sm mt-1">Location: {event.location}</p>
                            )}
                            {event.description && (
                              <p className="text-sm mt-2">{event.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Sent Notifications</CardTitle>
                  <CardDescription>View notifications sent to your athletes</CardDescription>
                </div>
                <Button onClick={() => setShowNotificationDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Notification
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No notifications sent yet</p>
                      <Button variant="outline" className="mt-4" onClick={() => setShowNotificationDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Send First Notification
                      </Button>
                    </div>
                  ) : (
                    sentNotifications.map(notification => (
                      <div key={notification.id} className="border p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent to {notification.recipientCount} athletes
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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
