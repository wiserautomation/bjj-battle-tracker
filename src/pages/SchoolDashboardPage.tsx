
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Trophy, Clock, CheckCircle2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SchoolDashboardPage = () => {
  const { currentUser, getAthletes, getAthletesBySchool, getChallengesBySchool } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRequests, setPendingRequests] = useState([
    { id: "req1", name: "John Doe", belt: "purple", stripes: 2, profilePicture: "" },
    { id: "req2", name: "Jane Smith", belt: "blue", stripes: 4, profilePicture: "" },
  ]);
  
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
  
  // Accept athlete request (mock function)
  const handleAcceptAthlete = (athleteId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== athleteId));
    // In a real app, this would make an API call to update the database
  };
  
  // Reject athlete request (mock function)
  const handleRejectAthlete = (athleteId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== athleteId));
    // In a real app, this would make an API call to update the database
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">School Dashboard</h1>
          <p className="text-muted-foreground">Manage your athletes and challenges</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
        
        <Tabs defaultValue="athletes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
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
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Challenge
                </Button>
              </CardHeader>
              <CardContent>
                {schoolChallenges.length === 0 ? (
                  <div className="text-center py-10 border rounded-md">
                    <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No challenges created yet</p>
                    <Button className="mt-4">Create Your First Challenge</Button>
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
    </MainLayout>
  );
};

export default SchoolDashboardPage;
