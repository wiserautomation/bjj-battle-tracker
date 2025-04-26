
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntry } from "@/types";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIJournalInsightsProps {
  entries: JournalEntry[];
}

type InsightType = {
  category: string;
  insights: string[];
}

const AIJournalInsights = ({ entries }: AIJournalInsightsProps) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightType[]>([]);
  const { toast } = useToast();
  
  const generateInsights = async () => {
    if (entries.length < 3) {
      toast({
        title: "Not enough data",
        description: "You need at least 3 journal entries for AI analysis.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare the journal data for analysis
      const journalData = entries.map(entry => ({
        date: entry.date,
        title: entry.title,
        trainingType: entry.trainingType,
        submissions: {
          achieved: entry.submissions.achieved,
          received: entry.submissions.received,
        },
        content: entry.content,
        tags: entry.tags,
      }));
      
      // Mock AI response for now - would be replaced with actual API call to backend
      // We'll simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock insights that would come from AI
      const mockInsights = [
        {
          category: "Strengths",
          insights: [
            "You consistently perform well with triangle chokes, with 5 successful attempts across your entries.",
            "Your guard retention has improved over the last month based on fewer submissions received from guard passes.",
            "Regular drilling sessions appear to translate directly to competition success."
          ]
        },
        {
          category: "Areas for Improvement",
          insights: [
            "Armbar defense needs work - you've been caught in 4 armbars in recent rolls.",
            "Consider more focused drilling on escaping side control, which appears as a problematic position.",
            "You might benefit from specific training on defending leg locks, which account for 30% of submissions received."
          ]
        },
        {
          category: "Training Recommendations",
          insights: [
            "Focus on 2-3 specific escapes from side control in your next few training sessions.",
            "Consider adding positional sparring starting from problematic positions to your routine.",
            "Your entries suggest you perform better in morning sessions - consider adjusting your training schedule if possible."
          ]
        }
      ];
      
      setInsights(mockInsights);
      
      toast({
        title: "Analysis complete",
        description: "AI insights have been generated based on your journal entries.",
      });
    } catch (error) {
      toast({
        title: "Error generating insights",
        description: "Could not analyze journal entries. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-bjj-gold" />
          AI Training Insights
        </CardTitle>
        <Button onClick={generateInsights} disabled={loading || entries.length < 3}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Click "Generate Insights" to have AI analyze your training journal.</p>
            <p className="text-sm mt-2">The AI will identify patterns, strengths, weaknesses and provide recommendations.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((category, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-lg mb-2">{category.category}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {category.insights.map((insight, i) => (
                    <li key={i} className="text-muted-foreground">{insight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIJournalInsights;
