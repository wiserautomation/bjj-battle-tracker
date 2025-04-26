
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Trophy, Clock, CheckCircle2, Search, Calendar, Award, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema for challenges
const challengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
});

// Form schema for events
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required" }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  eventType: z.enum(["class", "competition"]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// Form schema for notifications
const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});

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
  
  // Forms
  const challengeForm = useForm<z.infer<typeof challengeSchema>>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "training",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
    },
  });

  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      startTime: "18:00",
      endTime: "19:30",
      eventType: "class",
      url: "",
    },
  });
  
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });
  
  if (!currentUser || currentUser.role !== 'school') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Only schools can access the school dashboard.</p>
        </div>
      </MainLayout>
    );
  }
  
  // Get school's athletes and challenges
  const schoolAthletes = getAthletesBySchool(currentUser.id);
  const schoolChallenges = getChallengesBySchool(currentUser.id);
  
  // Filter athletes by search term
  const filteredAthletes = schoolAthletes.filter(
    athlete => athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Accept athlete request
  const handleAcceptAthlete = (athleteId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== athleteId));
    toast({
      title: "Athlete accepted",
      description: "The athlete has been added to your school.",
    });
  };
  
  // Reject athlete request
  const handleRejectAthlete = (athleteId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== athleteId));
    toast({
      title: "Athlete rejected",
      description: "The athlete request has been rejected.",
    });
  };
  
  // Handle challenge creation
  const onCreateChallenge = (data: z.infer<typeof challengeSchema>) => {
    toast({
      title: "Challenge created",
      description: `New challenge "${data.title}" has been created.`,
    });
    setShowChallengeDialog(false);
    challengeForm.reset();
  };
  
  // Handle event creation
  const onCreateEvent = (data: z.infer<typeof eventSchema>) => {
    toast({
      title: "Event added",
      description: `New ${data.eventType} "${data.title}" has been added to the calendar.`,
    });
    setShowEventDialog(false);
    eventForm.reset();
  };
  
  // Handle notification creation
  const onSendNotification = (data: z.infer<typeof notificationSchema>) => {
    toast({
      title: "Notification sent",
      description: "Your notification has been sent to all school athletes.",
    });
    setShowNotificationDialog(false);
    notificationForm.reset();
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolAthletes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolChallenges.filter(c => new Date(c.endDate) >= new Date()).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Top Athletes</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schoolAthletes.length > 0 ? 3 : 0}</div>
              <p className="text-xs text-muted-foreground">Athletes with highest points</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="athletes" className="space-y-4">
          <TabsList className="grid grid-cols-4 max-w-xl">
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="requests">Join Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="athletes">
            <Card>
              <CardHeader>
                <CardTitle>Manage Athletes</CardTitle>
                <CardDescription>View and manage athletes in your school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-8"
                      placeholder="Search athletes..."
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {filteredAthletes.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No athletes found</p>
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    {filteredAthletes.map((athlete) => (
                      <div key={athlete.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={athlete.profilePicture} alt={athlete.name} />
                            <AvatarFallback className={`bg-bjj-${athlete.belt}`}>
                              {athlete.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{athlete.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize">
                                {athlete.belt} Belt
                              </Badge>
                              {Array.from({ length: athlete.stripes }).map((_, i) => (
                                <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>School Challenges</CardTitle>
                  <CardDescription>Create and manage training challenges</CardDescription>
                </div>
                <Button onClick={() => setShowChallengeDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Challenge
                </Button>
              </CardHeader>
              <CardContent>
                {schoolChallenges.length === 0 ? (
                  <div className="text-center py-10 border rounded-md">
                    <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No challenges created yet</p>
                    <Button className="mt-4" onClick={() => setShowChallengeDialog(true)}>Create Your First Challenge</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schoolChallenges.map(challenge => (
                      <Card key={challenge.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{challenge.title}</h3>
                              <p className="text-muted-foreground text-sm">{challenge.description}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">
                                  {new Date(challenge.endDate) >= new Date() ? 'Active' : 'Completed'}
                                </Badge>
                                <Badge variant="outline">{challenge.type}</Badge>
                              </div>
                              <p className="text-sm mt-2">
                                {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" size="sm">View Details</Button>
                              <Button variant="outline" size="sm">Edit Challenge</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenge Creation Dialog */}
            <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Challenge</DialogTitle>
                </DialogHeader>
                <form onSubmit={challengeForm.handleSubmit(onCreateChallenge)} className="space-y-4">
                  <FormField
                    control={challengeForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Challenge title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={challengeForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the challenge" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={challengeForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="training">Training</option>
                            <option value="competition">Competition</option>
                            <option value="attendance">Attendance</option>
                            <option value="technique">Technique</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={challengeForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={challengeForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date < challengeForm.getValues().startDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowChallengeDialog(false)}>Cancel</Button>
                    <Button type="submit">Create Challenge</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Class Schedule & Competitions</CardTitle>
                  <CardDescription>Manage your school's training schedule and upcoming competitions</CardDescription>
                </div>
                <Button onClick={() => setShowEventDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="classes">
                  <TabsList className="mb-4">
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="competitions">Competitions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="classes">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Regular Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">Fundamentals Class</h3>
                                  <p className="text-sm text-muted-foreground">Monday, Wednesday, Friday</p>
                                  <p className="text-sm text-muted-foreground">6:00 PM - 7:30 PM</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">Advanced Class</h3>
                                  <p className="text-sm text-muted-foreground">Tuesday, Thursday</p>
                                  <p className="text-sm text-muted-foreground">7:00 PM - 8:30 PM</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">Open Mat</h3>
                                  <p className="text-sm text-muted-foreground">Saturday</p>
                                  <p className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="competitions">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Upcoming Competitions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">Local Championship</h3>
                                  <p className="text-sm text-muted-foreground">June 15, 2025</p>
                                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                                  <a href="https://example.com/event" className="text-sm text-blue-600 hover:underline mt-2 block">
                                    Event Details
                                  </a>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">National Tournament</h3>
                                  <p className="text-sm text-muted-foreground">August 22-23, 2025</p>
                                  <p className="text-sm text-muted-foreground">All day</p>
                                  <a href="https://example.com/national" className="text-sm text-blue-600 hover:underline mt-2 block">
                                    Tournament Website
                                  </a>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Event Creation Dialog */}
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={eventForm.handleSubmit(onCreateEvent)} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Event details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="class">Class</option>
                            <option value="competition">Competition</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={eventForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {eventForm.watch("eventType") === "competition" && (
                    <FormField
                      control={eventForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event URL (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/event" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
                    <Button type="submit">Add Event</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Join Requests</CardTitle>
                <CardDescription>Approve or reject athletes requesting to join your school</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-10 border rounded-md">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map(request => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.profilePicture} alt={request.name} />
                            <AvatarFallback className={`bg-bjj-${request.belt}`}>
                              {request.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize">
                                {request.belt} Belt
                              </Badge>
                              {Array.from({ length: request.stripes }).map((_, i) => (
                                <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleRejectAthlete(request.id)}
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleAcceptAthlete(request.id)}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Notification to Athletes</DialogTitle>
          </DialogHeader>
          <form onSubmit={notificationForm.handleSubmit(onSendNotification)} className="space-y-4">
            <FormField
              control={notificationForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notification title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={notificationForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notification message" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNotificationDialog(false)}>Cancel</Button>
              <Button type="submit">Send Notification</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SchoolDashboardPage;
