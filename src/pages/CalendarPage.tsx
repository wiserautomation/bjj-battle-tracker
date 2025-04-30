import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parse, addDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'class' | 'seminar' | 'competition' | 'private' | 'other';
  description?: string;
  location?: string;
}

const CalendarPage = () => {
  const { currentUser, hasSchool } = useApp();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isAthlete = currentUser?.role === 'athlete';
  const hasJoinedSchool = isAthlete && currentUser && hasSchool(currentUser.id);

  // Mock calendar events
  const events: CalendarEvent[] = hasJoinedSchool ? [
    {
      id: "event1",
      title: "Gi Training",
      date: new Date(),
      startTime: "18:00",
      endTime: "20:00",
      type: "class",
      description: "Regular gi training with focus on guard passing",
      location: "Main Training Room"
    },
    {
      id: "event2",
      title: "No-Gi Fundamentals",
      date: addDays(new Date(), 1),
      startTime: "17:30",
      endTime: "19:00",
      type: "class",
      description: "No-gi class focusing on basic techniques",
      location: "Main Training Room"
    },
    {
      id: "event3",
      title: "Competition Training",
      date: addDays(new Date(), 2),
      startTime: "19:00",
      endTime: "21:00",
      type: "class",
      description: "Preparation for upcoming tournaments",
      location: "Main Training Room"
    },
    {
      id: "event4",
      title: "John Danaher Seminar",
      date: addDays(new Date(), 5),
      startTime: "10:00",
      endTime: "14:00",
      type: "seminar",
      description: "Special seminar with John Danaher focusing on leg locks",
      location: "Main Training Room"
    },
    {
      id: "event5",
      title: "In-House Tournament",
      date: addDays(new Date(), 14),
      startTime: "09:00",
      endTime: "17:00",
      type: "competition",
      description: "Friendly competition among school members",
      location: "Main Training Room"
    }
  ] : [];

  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => 
        event.date.getFullYear() === selectedDate.getFullYear() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getDate() === selectedDate.getDate()
      )
    : [];

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Function to determine if a day has an event
  const getDateClassNames = (day: Date) => {
    const hasEvent = events.some(event => 
      event.date.getFullYear() === day.getFullYear() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getDate() === day.getDate()
    );
    
    return hasEvent ? "bg-primary/10 font-medium text-primary" : "";
  };

  if (isAthlete && !hasJoinedSchool) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">School Calendar</h1>
            <p className="text-muted-foreground">View upcoming classes, events, and competitions</p>
          </div>
          <SchoolEnrollment />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">School Calendar</h1>
          <p className="text-muted-foreground">View upcoming classes, events, and competitions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Training Schedule</CardTitle>
              <CardDescription>Select a day to view events</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate || undefined}
                onSelect={handleDateClick}
                className="border rounded-md p-4"
                classNames={{
                  day_today: "bg-muted font-bold text-primary",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary",
                  day: "day-base"
                }}
                modifiers={{
                  hasEvent: events.map(event => new Date(
                    event.date.getFullYear(),
                    event.date.getMonth(),
                    event.date.getDate()
                  ))
                }}
                modifiersClassNames={{
                  hasEvent: "bg-primary/10 font-medium text-primary"
                }}
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Legend:</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/10"></div>
                  <span className="text-sm">Event scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted"></div>
                  <span className="text-sm">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span className="text-sm">Selected day</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Upcoming Events"}
              </CardTitle>
              <CardDescription>
                {selectedDate ? "Classes and events scheduled for this day" : "Select a day to see detailed schedule"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                eventsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {eventsForSelectedDate
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(event => (
                        <div key={event.id} className="border p-4 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant="outline" className={`
                              ${event.type === "class" ? "bg-green-100 text-green-800 border-green-200" :
                                event.type === "seminar" ? "bg-blue-100 text-blue-800 border-blue-200" :
                                event.type === "competition" ? "bg-red-100 text-red-800 border-red-200" :
                                event.type === "private" ? "bg-purple-100 text-purple-800 border-purple-200" :
                                "bg-gray-100 text-gray-800 border-gray-200"}
                            `}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm">{event.startTime} - {event.endTime}</p>
                          {event.location && (
                            <p className="text-sm text-muted-foreground mt-1">Location: {event.location}</p>
                          )}
                          {event.description && (
                            <p className="text-sm mt-2">{event.description}</p>
                          )}
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p>No events scheduled for this day</p>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-2">Next 3 upcoming events:</p>
                  {events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="border p-4 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge variant="outline" className={`
                            ${event.type === "class" ? "bg-green-100 text-green-800 border-green-200" :
                              event.type === "seminar" ? "bg-blue-100 text-blue-800 border-blue-200" :
                              event.type === "competition" ? "bg-red-100 text-red-800 border-red-200" :
                              event.type === "private" ? "bg-purple-100 text-purple-800 border-purple-200" :
                              "bg-gray-100 text-gray-800 border-gray-200"}
                          `}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(event.date, "EEE, MMM d")} • {event.startTime} - {event.endTime}
                        </p>
                        {event.description && (
                          <p className="text-sm mt-2">{event.description}</p>
                        )}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="px-0 mt-1" 
                          onClick={() => handleDateClick(event.date)}
                        >
                          View day
                        </Button>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
