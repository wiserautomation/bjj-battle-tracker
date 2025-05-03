
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AthletesPage = () => {
  const { currentUser, getAthletesBySchool } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!currentUser || currentUser.role !== 'school') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Only schools can access the athletes management feature.</p>
        </div>
      </MainLayout>
    );
  }
  
  const school = currentUser as School;
  const athletes = getAthletesBySchool(school.id);
  
  // Filter athletes by search term
  const filteredAthletes = athletes.filter(
    athlete => athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               athlete.belt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Athletes</h1>
          <p className="text-muted-foreground">Manage your school's registered athletes</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search athletes..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredAthletes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No athletes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAthletes.map(athlete => (
              <Card key={athlete.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border-2 border-bjj-gold">
                      <AvatarImage src={athlete.profilePicture} alt={athlete.name} />
                      <AvatarFallback className="bg-bjj-navy text-white">
                        {athlete.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{athlete.name}</CardTitle>
                      <CardDescription>
                        {athlete.belt.charAt(0).toUpperCase() + athlete.belt.slice(1)} Belt
                        {athlete.stripes > 0 && ` • ${athlete.stripes} Stripe${athlete.stripes > 1 ? 's' : ''}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium cursor-help">{athlete.email}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Email address</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {athlete.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">{athlete.weight} lbs</span>
                      </div>
                    )}
                    {athlete.trainingHistory && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Training Since</span>
                        <span className="font-medium">
                          {new Date(athlete.trainingHistory.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Achievements</span>
                      <span className="font-medium">{athlete.achievements.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AthletesPage;
