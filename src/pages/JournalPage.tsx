
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter } from "lucide-react";
import { JournalEntry } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import JournalEntryDialog from "@/components/journal/JournalEntryDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AIJournalInsights from "@/components/journal/AIJournalInsights";
import SchoolEnrollment from "@/components/enrollment/SchoolEnrollment";

const JournalPage = () => {
  const { currentUser, getJournalEntriesByAthlete, hasSchool, addJournalEntry } = useApp();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const { toast } = useToast();

  // Get journal entries for the current user
  const journalEntries = currentUser && currentUser.role === "athlete"
    ? getJournalEntriesByAthlete(currentUser.id)
    : [];
    
  // Check if the athlete has joined a school
  const hasJoinedSchool = currentUser?.role === "athlete" && hasSchool(currentUser.id);

  // Filter entries based on search term and selected tag
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag ? entry.tags.includes(filterTag) : true;
    return matchesSearch && matchesTag;
  });

  // Get unique tags from all entries
  const allTags = [...new Set(journalEntries.flatMap(entry => entry.tags))];

  const handleCreateEntry = (newEntry: Partial<JournalEntry>) => {
    // Add the new entry
    addJournalEntry(newEntry);
    
    toast({
      title: "Journal Entry Created",
      description: "Your entry has been saved successfully.",
    });
    
    setShowCreateDialog(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Journal</h1>
            <p className="text-muted-foreground">Track your BJJ journey and progress</p>
          </div>
          
          {hasJoinedSchool && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          )}
        </div>
        
        {!hasJoinedSchool && currentUser?.role === "athlete" ? (
          <SchoolEnrollment />
        ) : (
          <Tabs defaultValue="entries" className="space-y-4">
            <TabsList>
              <TabsTrigger value="entries">My Entries</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="entries">
              <Card>
                <CardHeader>
                  <CardTitle>Journal Entries</CardTitle>
                  <CardDescription>Record and reflect on your training sessions</CardDescription>
                  <div className="flex gap-3 items-center pt-2">
                    <Input 
                      placeholder="Search entries..." 
                      className="max-w-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No journal entries found.</p>
                      <Button variant="outline" className="mt-4" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Entry
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEntries.map(entry => (
                        <div key={entry.id} className="border p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{entry.title}</h3>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(entry.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{entry.content}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {entry.trainingType}
                            </Badge>
                            {entry.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="cursor-pointer"
                                onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                            <div>
                              <span className="font-medium">Submissions:</span> 
                              {entry.submissions.achieved.count} achieved / {entry.submissions.received.count} received
                            </div>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights">
              <AIJournalInsights entries={journalEntries} />
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {showCreateDialog && (
        <JournalEntryDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateEntry}
        />
      )}
    </MainLayout>
  );
};

export default JournalPage;
