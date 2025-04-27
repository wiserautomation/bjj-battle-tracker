
import { Button } from "@/components/ui/button";
import { Challenge } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface ChallengesListProps {
  challenges: Challenge[];
  onNewChallenge: () => void;
}

export const ChallengesList = ({ challenges, onNewChallenge }: ChallengesListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search challenges..."
          className="max-w-xs"
        />
        <Button onClick={onNewChallenge}>
          <Trophy className="mr-2 h-4 w-4" />
          New Challenge
        </Button>
      </div>
      
      {challenges.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No challenges yet</h3>
          <p className="text-muted-foreground mb-4">Create your first challenge for your athletes</p>
          <Button onClick={onNewChallenge}>Create Challenge</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map(challenge => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <Badge className="mb-2 inline-flex">{challenge.type}</Badge>
                <CardTitle>{challenge.title}</CardTitle>
                <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm flex justify-between">
                  <div>
                    <p className="text-muted-foreground">Start</p>
                    <p>{new Date(challenge.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End</p>
                    <p>{new Date(challenge.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
