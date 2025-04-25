
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Journal } from "lucide-react";
import { Athlete } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RecentJournalEntries = () => {
  const { currentUser, getJournalEntriesByAthlete } = useApp();
  
  if (!currentUser || currentUser.role !== 'athlete') {
    return null;
  }
  
  const athlete = currentUser as Athlete;
  const journalEntries = getJournalEntriesByAthlete(athlete.id);
  
  // Sort by date, most recent first
  const sortedEntries = [...journalEntries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3); // Get only the 3 most recent entries
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Journal className="h-4 w-4" />
          Recent Journal Entries
        </CardTitle>
        <Link to="/journal">
          <Button variant="link" size="sm" className="text-bjj-blue">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        {sortedEntries.length === 0 ? (
          <div className="h-full flex items-center justify-center flex-col text-center p-4">
            <p className="text-muted-foreground mb-3">No journal entries yet.</p>
            <Link to="/journal">
              <Button variant="outline" size="sm">
                Create Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map(entry => (
              <div key={entry.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium truncate">{entry.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.content}
                </p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentJournalEntries;
