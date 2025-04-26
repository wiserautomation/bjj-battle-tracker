
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

const SubscriptionPage = () => {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
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
          <p className="text-muted-foreground">Get access to all premium features and take your training to the next level</p>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Premium Membership
            </CardTitle>
            <CardDescription>30-day free trial, then $9.99/month</CardDescription>
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
              size="lg" 
              onClick={handleSubscribe}
              disabled={loading || !currentUser}
            >
              {loading ? "Loading..." : "Start Free Trial"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SubscriptionPage;
