
import { useApp } from "@/context/AppContext";
import { Athlete } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AchievementsList = () => {
  const { currentUser, getAthleteBadges } = useApp();
  
  if (!currentUser || currentUser.role !== 'athlete') {
    return null;
  }
  
  const athlete = currentUser as Athlete;
  const badges = getAthleteBadges(athlete.id);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Award className="h-4 w-4 text-bjj-gold" />
          Your Achievements
        </CardTitle>
        <Link to="/profile">
          <Button variant="link" size="sm" className="text-bjj-blue">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {badges.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-center p-4">
            <p className="text-muted-foreground">Complete challenges to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {badges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center text-center p-2">
                <Avatar className="h-12 w-12 mb-2 bg-bjj-navy/10">
                  <AvatarImage src={badge.imageUrl} alt={badge.name} />
                  <AvatarFallback className="bg-bjj-gold text-white">
                    {badge.name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xs font-medium truncate max-w-full">{badge.name}</h3>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsList;
