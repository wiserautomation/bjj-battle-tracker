
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Challenge } from "@/types";

interface ChallengesListProps {
  challenges: Challenge[];
  onNewChallenge: () => void;
}

export const ChallengesList = ({ challenges, onNewChallenge }: ChallengesListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>School Challenges</CardTitle>
          <CardDescription>Create and manage training challenges</CardDescription>
        </div>
        <Button onClick={onNewChallenge}>
          <Plus className="mr-2 h-4 w-4" />
          New Challenge
        </Button>
      </CardHeader>
      <CardContent>
        {challenges.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No challenges created yet</p>
            <Button className="mt-4" onClick={onNewChallenge}>Create Your First Challenge</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map(challenge => (
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
  );
};
