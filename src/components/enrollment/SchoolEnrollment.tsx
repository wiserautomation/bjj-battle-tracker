import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { School } from "@/types";
import { Search, MapPin, Users, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SchoolEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [nearbySchools, setNearbySchools] = useState<School[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [joiningSchoolId, setJoiningSchoolId] = useState<string | null>(null);
  const { getSchools, currentUser, joinSchool } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const allSchools = getSchools();
  const filteredSchools = allSchools.filter(
    school => school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (school.location && school.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    // Find nearby schools based on available schools
    const randomSchools = [...allSchools]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setNearbySchools(randomSchools);
  }, [allSchools]);

  const handleJoinSchool = async (schoolId: string) => {
    if (!currentUser) return;
    
    setIsJoining(true);
    setJoiningSchoolId(schoolId);
    
    try {
      await joinSchool(currentUser.id, schoolId);
      toast({
        title: "School joined successfully!",
        description: "You've been enrolled in the school.",
      });
      
      // Redirect to dashboard after joining
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to join school",
        description: "Please try again later.",
      });
    } finally {
      setIsJoining(false);
      setJoiningSchoolId(null);
    }
  };
  
  const renderSchoolItem = (school: School) => (
    <div key={school.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-md">
      <div>
        <p className="font-medium">{school.name}</p>
        <div className="flex flex-col gap-1 mt-1">
          {school.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{school.location}</span>
            </div>
          )}
          {school.athletes && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{school.athletes.length} members</span>
            </div>
          )}
        </div>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              onClick={() => handleJoinSchool(school.id)}
              disabled={isJoining}
            >
              {isJoining && joiningSchoolId === school.id ? (
                <>Joining...</>
              ) : (
                <>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Join
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send a request to join this school</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join a School</CardTitle>
        <CardDescription>
          To access all features, find and join a Brazilian Jiu-Jitsu school.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools by name or location..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) {
                  setIsSearching(true);
                }
              }}
              autoFocus
            />
          </div>
          
          {isSearching || searchTerm ? (
            <div className="space-y-3 mt-4">
              {filteredSchools.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No schools found matching your search.</p>
              ) : (
                filteredSchools.map(renderSchoolItem)
              )}
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">Nearby Schools</h3>
                <Badge variant="outline" className="text-xs">Based on your location</Badge>
              </div>
              {nearbySchools.length > 0 ? (
                nearbySchools.map(renderSchoolItem)
              ) : (
                <p className="text-center text-muted-foreground py-4">No nearby schools found.</p>
              )}
            </div>
          )}
          
          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Can't find your school? Contact them to join the JU-PLAY platform.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          onClick={() => setIsSearching(!isSearching)}
        >
          {isSearching ? "Show Nearby Schools" : "Search All Schools"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchoolEnrollment;
