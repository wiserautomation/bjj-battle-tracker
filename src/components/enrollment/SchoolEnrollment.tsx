
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { School } from "@/types";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const SchoolEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [nearbySchools, setNearbySchools] = useState<School[]>([]);
  const [isJoining, setIsJoining] = useState(false);
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
    // Simulate finding nearby schools based on geolocation
    // In a real app, this would use the browser's geolocation API
    const randomSchools = [...allSchools]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setNearbySchools(randomSchools);
  }, [allSchools]);

  const handleJoinSchool = async (schoolId: string) => {
    if (!currentUser) return;
    
    setIsJoining(true);
    
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
    }
  };
  
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
                setIsSearching(true);
              }}
            />
          </div>
          
          {isSearching || searchTerm ? (
            <div className="space-y-3 mt-4">
              {filteredSchools.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No schools found matching your search.</p>
              ) : (
                filteredSchools.map((school) => (
                  <div key={school.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-md">
                    <div>
                      <p className="font-medium">{school.name}</p>
                      {school.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{school.location}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinSchool(school.id)}
                      disabled={isJoining}
                    >
                      {isJoining ? "Joining..." : "Join"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Nearby Schools</h3>
              {nearbySchools.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-md">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    {school.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{school.location}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleJoinSchool(school.id)}
                    disabled={isJoining}
                  >
                    {isJoining ? "Joining..." : "Join"}
                  </Button>
                </div>
              ))}
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
