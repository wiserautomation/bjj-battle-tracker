
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import AIJournalInsights from "@/components/journal/AIJournalInsights";

const JournalPage = () => {
  const { currentUser, getJournalEntriesByAthlete } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!currentUser || currentUser.role !== 'athlete') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Only athletes can access the journal feature.</p>
        </div>
      </MainLayout>
    );
  }
  
  const entries = getJournalEntriesByAthlete(currentUser.id);
  
  // Filter entries by search term
  const filteredEntries = entries.filter(
    entry => entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
             entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort by date, most recent first
  const sortedEntries = [...filteredEntries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Training Journal</h1>
            <p className="text-muted-foreground">Track your progress and reflect on your training sessions</p>
          </div>
          <Button className="bg-bjj-navy hover:bg-bjj-navy/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Journal Entry
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search journal entries..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Add AI Journal Insights component */}
        <AIJournalInsights entries={entries} />
        
        {sortedEntries.length === 0 ? (
          <div className="flex items-center justify-center flex-col text-center p-12 border rounded-lg">
            <p className="text-muted-foreground mb-3">
              No journal entries yet. Start tracking your training progress!
            </p>
            <Button>Create Your First Entry</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEntries.map(entry => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <CardTitle>{entry.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {entry.trainingType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="whitespace-pre-line">{entry.content}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">Submissions Achieved</p>
                      <p>{entry.submissions.achieved.count} submissions</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.submissions.achieved.types.map(type => (
                          <Badge key={type} variant="secondary" className="capitalize">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Submissions Received</p>
                      <p>{entry.submissions.received.count} submissions</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.submissions.received.types.map(type => (
                          <Badge key={type} variant="outline" className="capitalize">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex flex-wrap gap-1.5">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-secondary/50">
                      #{tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JournalPage;
