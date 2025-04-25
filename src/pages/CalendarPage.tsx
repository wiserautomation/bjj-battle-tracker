
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

const CalendarPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Training Calendar</h1>
          <p className="text-muted-foreground">Schedule and track your training sessions</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-bjj-blue" />
              Calendar
            </CardTitle>
            <CardDescription>Coming soon in a future update!</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">
              The calendar feature will allow you to schedule classes, track attendance, and manage your training sessions.
              Stay tuned for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
