
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { School } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SchoolEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { getSchools, currentUser, joinSchool } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const allSchools = getSchools();
  const filteredSchools = allSchools.filter(
    school => school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (school.location && school.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleJoinSchool = async (schoolId: string) => {
    if (!currentUser) return;
    
    try {
      await joinSchool(currentUser.id, schoolId);
      toast({
        title: "School joined successfully!",
        description: "You've been enrolled in the school.",
      });
      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to join school",
        description: "Please try again later.",
      });
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
          
          {isSearching && (
            <div className="space-y-3 mt-4">
              {filteredSchools.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No schools found matching your search.</p>
              ) : (
                filteredSchools.map((school) => (
                  <div key={school.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-md">
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-muted-foreground">{school.location}</p>
                    </div>
                    <Button size="sm" onClick={() => handleJoinSchool(school.id)}>
                      Join
                    </Button>
                  </div>
                ))
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
    </Card>
  );
};

export default SchoolEnrollment;
