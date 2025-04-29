
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, School as SchoolIcon, Calendar, Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const SubscriptionPage = () => {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSchool, setIsSchool] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Determine if the current user is a school
  useEffect(() => {
    if (currentUser?.role === 'school') {
      setIsSchool(true);
    }
  }, [currentUser]);

  const handleSubscribeAthlete = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL received');
      
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Training Journey</h1>
          <p className="text-muted-foreground">
            {isSchool 
              ? "Manage your school's student billing notifications"
              : "Get access to all premium features and take your training to the next level"
            }
          </p>
        </div>

        {isSchool ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SchoolIcon className="w-5 h-5" />
                School Dashboard
              </CardTitle>
              <CardDescription>Configure payment reminders for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-center">
                As a school, you can use JU-PLAY for free. Set up billing reminders for your students to help them
                stay current with their memberships.
              </p>
              
              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Billing Notifications</h3>
                  <Bell className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Students will receive reminders before their monthly subscription expires.
                </p>
                <Button className="w-full" onClick={() => navigate("/school-dashboard/billing")}>
                  Manage Student Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Premium Membership
              </CardTitle>
              <CardDescription>$4.99/month - 30-day free trial</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">✓ Track all your training sessions</li>
                <li className="flex items-center gap-2">✓ Join exclusive challenges</li>
                <li className="flex items-center gap-2">✓ Detailed progress analytics</li>
                <li className="flex items-center gap-2">✓ Connect with training partners</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size={isMobile ? "default" : "lg"}
                onClick={handleSubscribeAthlete}
                disabled={loading || !currentUser}
              >
                {loading ? "Loading..." : "Start Free Trial"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default SubscriptionPage;
