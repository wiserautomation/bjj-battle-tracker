
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Award, Calendar, Trophy, User } from "lucide-react";

// Form schema for logging a challenge achievement
const achievementSchema = z.object({
  count: z.number().min(1, "Please enter at least 1").or(z.string().transform(val => parseInt(val, 10))),
  notes: z.string().optional(),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

const ChallengeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    currentUser,
    getChallengeById,
    getChallengeResults,
    getAthleteById,
    getSchoolById,
    logChallengeAchievement
  } = useApp();
  
  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      count: 1,
      notes: "",
    },
  });
  
  if (!id) {
    navigate("/");
    return null;
  }
  
  const challenge = getChallengeById(id);
  
  if (!challenge) {
    navigate("/");
    return null;
  }
  
  const results = getChallengeResults(id);
  const school = getSchoolById(challenge.createdBy);
  
  // Group results by athlete
  const athleteResults = results.reduce((acc, result) => {
    if (!acc[result.athleteId]) {
      acc[result.athleteId] = [];
    }
    acc[result.athleteId].push(result);
    return acc;
  }, {} as Record<string, typeof results>);
  
  // Calculate total points for each athlete
  const rankings = Object.entries(athleteResults).map(([athleteId, results]) => {
    const athlete = getAthleteById(athleteId);
    const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
    return {
      athleteId,
      name: athlete?.name || "Unknown Athlete",
      belt: athlete?.belt || "white",
      totalPoints,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
  
  const isActive = () => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    return now >= startDate && now <= endDate;
  };
  
  const isParticipant = () => {
    return currentUser && challenge.participants.includes(currentUser.id);
  };
  
  const canLogAchievement = () => {
    return currentUser && isActive() && isParticipant() && currentUser.role === 'athlete';
  };
  
  const onSubmit = (data: AchievementFormValues) => {
    if (!currentUser) return;
    
    logChallengeAchievement({
      challengeId: challenge.id,
      count: data.count,
      notes: data.notes,
    });
    
    toast({
      title: "Achievement logged!",
      description: `You've successfully logged your achievement for ${challenge.title}.`,
    });
    
    setDialogOpen(false);
    form.reset();
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={isActive() ? "default" : "outline"}>
              {isActive() ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">{challenge.difficulty}</Badge>
            <Badge variant="outline">{challenge.type}</Badge>
            <Badge className="bg-bjj-navy">{school?.name}</Badge>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
              <CardDescription>
                Set by {school?.name} • Runs from {format(new Date(challenge.startDate), 'MMM d, yyyy')} to {format(new Date(challenge.endDate), 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{challenge.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium mt-1 capitalize">{challenge.type}</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <span className="font-medium mt-1 capitalize">{challenge.difficulty}</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Points System</span>
                  <span className="font-medium mt-1 capitalize">{challenge.pointsSystem.type}</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Participants</span>
                  <span className="font-medium mt-1">{challenge.participants.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {canLogAchievement() && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Log Achievement</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log Achievement</DialogTitle>
                      <DialogDescription>
                        Record your progress for this challenge.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Count</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  {...field} 
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                The number of times you achieved this challenge.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Any additional details about your achievement.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit">Submit</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-bjj-gold" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Current rankings for this challenge</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Athlete</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        No results recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rankings.map((ranking, index) => (
                      <TableRow key={ranking.athleteId}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full bg-bjj-${ranking.belt}`} />
                          {ranking.name}
                        </TableCell>
                        <TableCell className="text-right font-bold">{ranking.totalPoints}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest achievements recorded for this challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Athlete</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                      No activity recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  results
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map(result => {
                      const athlete = getAthleteById(result.athleteId);
                      return (
                        <TableRow key={result.id}>
                          <TableCell>{format(new Date(result.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-medium">{athlete?.name || 'Unknown'}</TableCell>
                          <TableCell>{result.points}</TableCell>
                          <TableCell>
                            {result.details?.submissions && (
                              <span>
                                {result.details.submissions} {result.details.submissions === 1 ? 'submission' : 'submissions'}
                                {result.details.submissionTypes && result.details.submissionTypes.length > 0 && (
                                  <> ({result.details.submissionTypes.join(', ')})</>
                                )}
                              </span>
                            )}
                            {result.details?.notes && <span>{result.details.notes}</span>}
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ChallengeDetailPage;
