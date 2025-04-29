
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/context/AppContext";
import { Athlete } from "@/types";
import { format, addDays } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface StudentBillingProps {
  studentId: string;
  isLoading?: boolean;
}

const StudentBillingManager = ({ studentId, isLoading = false }: StudentBillingProps) => {
  const [billingDate, setBillingDate] = useState<Date | undefined>(undefined);
  const [reminderDays, setReminderDays] = useState(3);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { getAthleteById } = useApp();

  const student = getAthleteById(studentId) as Athlete | undefined;

  // In a real implementation, this would fetch the billing data from the database
  useEffect(() => {
    // Mock fetching billing data
    if (student) {
      // Set a default date 30 days from now if none exists
      setBillingDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    }
  }, [student]);

  const handleSave = async () => {
    if (!billingDate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please set a billing date",
      });
      return;
    }

    setSaving(true);
    try {
      // In a real app, this would save the billing data to the database
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "Billing information saved",
        description: `Billing date set for ${format(billingDate, "PPP")}. Student will be notified ${reminderDays} days before.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save billing information",
        description: "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!student) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Student not found</p>
        </CardContent>
      </Card>
    );
  }

  const calculatedReminderDate = billingDate ? addDays(billingDate, -reminderDays) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Billing Settings for {student.name}
        </CardTitle>
        <CardDescription>
          Configure when this student's membership renews and when to send reminders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="billing-date">Membership Renewal Date</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <DatePicker
              date={billingDate}
              setDate={setBillingDate}
              disabled={isLoading || saving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminder-days">Reminder Days Before</Label>
          <Input
            id="reminder-days"
            type="number"
            min={1}
            max={14}
            value={reminderDays}
            onChange={(e) => setReminderDays(parseInt(e.target.value, 10) || 3)}
            disabled={isLoading || saving}
            className="max-w-[100px]"
          />
        </div>

        {billingDate && calculatedReminderDate && (
          <div className="p-4 bg-muted rounded-md mt-4">
            <p className="text-sm font-medium">Summary:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Next billing date: {format(billingDate, "MMMM d, yyyy")}</li>
              <li>• Reminder will be sent on: {format(calculatedReminderDate, "MMMM d, yyyy")}</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading || saving || !billingDate}>
          {saving ? "Saving..." : "Save Billing Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentBillingManager;
