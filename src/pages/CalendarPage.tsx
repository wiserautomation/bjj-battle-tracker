
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'class' | 'competition';
  description?: string;
  location?: string;
  url?: string;
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Fundamentals Class",
      date: new Date(2025, 3, 28),
      startTime: "18:00",
      endTime: "19:30",
      type: "class",
      description: "Focus on basic techniques and positions"
    },
    {
      id: "2",
      title: "Advanced Class",
      date: new Date(2025, 3, 28),
      startTime: "19:30",
      endTime: "21:00",
      type: "class",
      description: "For blue belts and above"
    },
    {
      id: "3",
      title: "Open Mat",
      date: new Date(2025, 3, 29),
      startTime: "10:00",
      endTime: "12:00",
      type: "class"
    },
    {
      id: "4",
      title: "Local Championship",
      date: new Date(2025, 5, 15),
      startTime: "09:00",
      endTime: "17:00",
      type: "competition",
      description: "Annual city championship",
      location: "City Sports Center",
      url: "https://example.com/championship"
    },
    {
      id: "5",
      title: "Fundamentals Class",
      date: new Date(2025, 3, 30),
      startTime: "18:00",
      endTime: "19:30",
      type: "class"
    },
    {
      id: "6",
      title: "National Tournament",
      date: new Date(2025, 7, 22),
      startTime: "08:00",
      endTime: "20:00",
      type: "competition",
      description: "National level tournament",
      location: "National Sports Complex",
      url: "https://example.com/national"
    }
  ];
  
  // Get selected day events
  const selectedDayEvents = selectedDate 
    ? events.filter(event => isSameDay(event.date, selectedDate))
    : [];
  
  // Get dates with events for highlighting in calendar
  const eventDates = events.map(event => event.date);
  
  // Function to combine date with time string
  const combineDateTime = (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Training Calendar</h1>
          <p className="text-muted-foreground">View your upcoming classes and competitions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-bjj-blue" />
                Calendar
              </CardTitle>
              <CardDescription>Select a date to see events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiersStyles={{
                  selected: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))"
                  }
                }}
                modifiers={{
                  eventDay: (date) => eventDates.some(eventDate => isSameDay(eventDate, date)),
                }}
                modifiersClassNames={{
                  eventDay: "border-b-2 border-bjj-gold"
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Events"}
              </CardTitle>
              <CardDescription>
                {selectedDayEvents.length === 0 
                  ? "No events scheduled for this day" 
                  : `${selectedDayEvents.length} event${selectedDayEvents.length > 1 ? 's' : ''} scheduled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No events scheduled for this day.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents
                    .sort((a, b) => {
                      return combineDateTime(a.date, a.startTime).getTime() - combineDateTime(b.date, b.startTime).getTime();
                    })
                    .map(event => (
                      <div key={event.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <Badge variant={event.type === "class" ? "outline" : "default"}>
                                {event.type === "class" ? "Class" : "Competition"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.startTime} - {event.endTime}
                            </p>
                            {event.description && (
                              <p className="mt-2">{event.description}</p>
                            )}
                            {event.location && (
                              <p className="mt-2 flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </p>
                            )}
                            {event.url && (
                              <div className="mt-2">
                                <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                  Event details
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
            <CardDescription>Regular weekly schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="mb-4">
                <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Competitions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="weekly">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="border rounded-md p-3">
                      <h3 className="font-medium">{day}</h3>
                      <div className="mt-2 space-y-2">
                        {day === "Monday" && (
                          <>
                            <div className="bg-muted rounded p-2">
                              <p className="text-sm font-medium">Fundamentals Class</p>
                              <p className="text-xs text-muted-foreground">6:00 PM - 7:30 PM</p>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <p className="text-sm font-medium">Advanced Class</p>
                              <p className="text-xs text-muted-foreground">7:30 PM - 9:00 PM</p>
                            </div>
                          </>
                        )}
                        {day === "Tuesday" && (
                          <div className="bg-muted rounded p-2">
                            <p className="text-sm font-medium">Drilling Session</p>
                            <p className="text-xs text-muted-foreground">6:30 PM - 8:00 PM</p>
                          </div>
                        )}
                        {day === "Wednesday" && (
                          <>
                            <div className="bg-muted rounded p-2">
                              <p className="text-sm font-medium">Fundamentals Class</p>
                              <p className="text-xs text-muted-foreground">6:00 PM - 7:30 PM</p>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <p className="text-sm font-medium">Competition Training</p>
                              <p className="text-xs text-muted-foreground">7:30 PM - 9:00 PM</p>
                            </div>
                          </>
                        )}
                        {day === "Thursday" && (
                          <div className="bg-muted rounded p-2">
                            <p className="text-sm font-medium">Advanced Class</p>
                            <p className="text-xs text-muted-foreground">7:00 PM - 8:30 PM</p>
                          </div>
                        )}
                        {day === "Friday" && (
                          <>
                            <div className="bg-muted rounded p-2">
                              <p className="text-sm font-medium">Fundamentals Class</p>
                              <p className="text-xs text-muted-foreground">6:00 PM - 7:30 PM</p>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <p className="text-sm font-medium">Open Mat</p>
                              <p className="text-xs text-muted-foreground">7:30 PM - 9:00 PM</p>
                            </div>
                          </>
                        )}
                        {day === "Saturday" && (
                          <div className="bg-muted rounded p-2">
                            <p className="text-sm font-medium">Open Mat</p>
                            <p className="text-xs text-muted-foreground">10:00 AM - 12:00 PM</p>
                          </div>
                        )}
                        {day === "Sunday" && (
                          <div className="text-center text-sm text-muted-foreground p-2">
                            No classes
                          </div>
                        )}
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(day) === -1 && (
                          <div className="text-center text-sm text-muted-foreground p-2">
                            No classes
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {events.filter(event => event.type === "competition" && event.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => (
                      <div key={event.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <Badge>Competition</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(event.date, "MMMM d, yyyy")} • {event.startTime} - {event.endTime}
                            </p>
                            {event.description && (
                              <p className="mt-2">{event.description}</p>
                            )}
                            {event.location && (
                              <p className="mt-2 flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </p>
                            )}
                            {event.url && (
                              <div className="mt-2">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                                    Event Details
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
