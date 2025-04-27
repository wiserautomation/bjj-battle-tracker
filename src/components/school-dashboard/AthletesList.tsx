
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Athlete } from "@/types";

interface AthletesListProps {
  athletes: Athlete[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AthletesList = ({ athletes, searchTerm, onSearchChange }: AthletesListProps) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        {athletes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No athletes found</p>
          </div>
        ) : (
          <div className="border rounded-md divide-y">
            {athletes.map((athlete) => (
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
  );
};
