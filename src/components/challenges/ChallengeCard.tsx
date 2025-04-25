
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Challenge } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isAfter, isBefore, parseISO } from "date-fns";
import { Trophy } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (challengeId: string) => void;
}

const ChallengeCard = ({ challenge, onSelect }: ChallengeCardProps) => {
  const startDate = parseISO(challenge.startDate);
  const endDate = parseISO(challenge.endDate);
  const now = new Date();
  
  const getStatus = () => {
    if (isBefore(now, startDate)) {
      return {
        text: "Upcoming",
        className: "bg-blue-100 text-blue-800"
      };
    } else if (isAfter(now, endDate)) {
      return {
        text: "Completed",
        className: "bg-gray-100 text-gray-800"
      };
    } else {
      return {
        text: "Active",
        className: "bg-green-100 text-green-800"
      };
    }
  };
  
  const status = getStatus();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={status.className}>
            {status.text}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {challenge.type}
          </Badge>
        </div>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Trophy className="h-5 w-5 text-bjj-gold" />
          {challenge.title}
        </CardTitle>
        <CardDescription>
          {challenge.description.length > 100 
            ? `${challenge.description.substring(0, 100)}...` 
            : challenge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium">{new Date(challenge.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date</p>
            <p className="font-medium">{new Date(challenge.endDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-muted-foreground text-sm">Difficulty</p>
          <p className="font-medium capitalize">{challenge.difficulty}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full border-bjj-blue text-bjj-blue hover:bg-bjj-blue hover:text-white"
          onClick={() => onSelect(challenge.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
