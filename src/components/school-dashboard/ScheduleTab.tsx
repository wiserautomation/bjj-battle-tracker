import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScheduleTabProps {
  onAddEvent: () => void;
}

export const ScheduleTab = ({ onAddEvent }: ScheduleTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Class Schedule & Competitions</CardTitle>
          <CardDescription>Manage your school's training schedule and upcoming competitions</CardDescription>
        </div>
        <Button onClick={onAddEvent}>
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
  );
};
