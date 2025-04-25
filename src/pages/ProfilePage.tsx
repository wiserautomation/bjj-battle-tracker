
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Athlete, School } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Calendar, Edit, Trophy, User } from "lucide-react";

const ProfilePage = () => {
  const { currentUser, getAthleteBadges } = useApp();
  
  if (!currentUser) {
    return <MainLayout />;
  }
  
  const isAthlete = currentUser.role === 'athlete';
  const user = currentUser as (Athlete | School);
  
  const badges = isAthlete ? getAthleteBadges(user.id) : [];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">Profile</h1>
            <p className="text-muted-foreground">View and manage your personal information</p>
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        
        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center pb-4">
                <Avatar className="h-24 w-24 mx-auto mb-2 border-2 border-bjj-gold">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-bjj-navy text-white text-2xl">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                {isAthlete && (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className={`px-6 py-2 rounded belt-${(user as Athlete).belt}`}>
                        {`${(user as Athlete).belt.charAt(0).toUpperCase() + (user as Athlete).belt.slice(1)} Belt`}
                        <div className="flex justify-center mt-1 gap-1">
                          {Array.from({ length: (user as Athlete).stripes }).map((_, i) => (
                            <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {(user as Athlete).weight && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight</span>
                          <span className="font-medium">{(user as Athlete).weight} lbs</span>
                        </div>
                      )}
                      {(user as Athlete).trainingHistory && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Started Training</span>
                            <span className="font-medium">
                              {new Date((user as Athlete).trainingHistory!.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Years Training</span>
                            <span className="font-medium">{(user as Athlete).trainingHistory!.yearsTraining}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
                
                {!isAthlete && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{(user as School).location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact</span>
                      <span className="font-medium">{(user as School).contact}</span>
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground">Description</span>
                      <p className="mt-1">{(user as School).description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {isAthlete && badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-bjj-gold" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {badges.map(badge => (
                      <div key={badge.id} className="flex flex-col items-center text-center">
                        <Avatar className="h-14 w-14 mb-2">
                          <AvatarImage src={badge.imageUrl} alt={badge.name} />
                          <AvatarFallback className="bg-bjj-gold text-white">
                            {badge.name.substring(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-medium">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Tabs defaultValue="stats">
              <TabsList>
                <TabsTrigger value="stats" className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  Stats
                </TabsTrigger>
                {isAthlete && (
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Training History
                  </TabsTrigger>
                )}
                {!isAthlete && (
                  <TabsTrigger value="athletes" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Athletes
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="stats" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Statistics</CardTitle>
                    <CardDescription>Your performance in school challenges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-muted-foreground text-sm">Active Challenges</p>
                        <p className="text-3xl font-bold mt-1">1</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-muted-foreground text-sm">Completed Challenges</p>
                        <p className="text-3xl font-bold mt-1">2</p>
                      </div>
                      <div className="border rounded-lg p-4 text-center">
                        <p className="text-muted-foreground text-sm">Total Points</p>
                        <p className="text-3xl font-bold mt-1">37</p>
                      </div>
                    </div>
                    
                    {isAthlete && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Submission Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">Submissions Achieved</p>
                            <p className="text-xl font-bold mt-1">7</p>
                            <div className="space-y-2 mt-2">
                              <div className="flex justify-between text-sm">
                                <span>Armbar</span>
                                <span className="font-medium">3</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Triangle</span>
                                <span className="font-medium">2</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Kimura</span>
                                <span className="font-medium">2</span>
                              </div>
                            </div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">Submissions Received</p>
                            <p className="text-xl font-bold mt-1">3</p>
                            <div className="space-y-2 mt-2">
                              <div className="flex justify-between text-sm">
                                <span>Kimura</span>
                                <span className="font-medium">1</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Americana</span>
                                <span className="font-medium">2</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isAthlete && (
                <TabsContent value="history" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Training History</CardTitle>
                      <CardDescription>Your BJJ journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative pl-8 pb-4 border-l-2 border-bjj-navy">
                          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-bjj-navy"></div>
                          <h3 className="font-medium">{(user as Athlete).belt.charAt(0).toUpperCase() + (user as Athlete).belt.slice(1)} Belt Achievement</h3>
                          <p className="text-sm text-muted-foreground">Current rank</p>
                        </div>
                        
                        <div className="relative pl-8 pb-4 border-l-2 border-bjj-blue">
                          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-bjj-blue"></div>
                          <h3 className="font-medium">First Competition</h3>
                          <p className="text-sm text-muted-foreground">October 15, 2022</p>
                        </div>
                        
                        <div className="relative pl-8">
                          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-bjj-white border-2 border-gray-300"></div>
                          <h3 className="font-medium">Started Training</h3>
                          <p className="text-sm text-muted-foreground">
                            {(user as Athlete).trainingHistory ? new Date((user as Athlete).trainingHistory.startDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {!isAthlete && (
                <TabsContent value="athletes" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>School Athletes</CardTitle>
                      <CardDescription>Athletes registered with your school</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(user as School).athletes.length === 0 ? (
                          <p className="text-center text-muted-foreground py-4">
                            No athletes have joined your school yet.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* We would render athlete cards here */}
                            <Card className="bg-secondary/50">
                              <CardHeader className="pb-2 text-center">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                  <AvatarFallback className="bg-bjj-navy text-white">AJ</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-base">Alex Johnson</CardTitle>
                                <CardDescription>Blue Belt • 2 Stripes</CardDescription>
                              </CardHeader>
                            </Card>
                            <Card className="bg-secondary/50">
                              <CardHeader className="pb-2 text-center">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                  <AvatarFallback className="bg-bjj-navy text-white">SR</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-base">Sam Rivera</CardTitle>
                                <CardDescription>Purple Belt • 1 Stripe</CardDescription>
                              </CardHeader>
                            </Card>
                            <Card className="bg-secondary/50">
                              <CardHeader className="pb-2 text-center">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                  <AvatarFallback className="bg-bjj-navy text-white">TK</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-base">Taylor Kim</CardTitle>
                                <CardDescription>White Belt • 4 Stripes</CardDescription>
                              </CardHeader>
                            </Card>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
