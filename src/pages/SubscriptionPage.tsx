
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, School as SchoolIcon, AlertCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  pricePerStudent: z
    .number()
    .min(4.99, { message: "Price must be at least $4.99" })
    .max(30, { message: "Price cannot exceed $30.00" })
});

const SubscriptionPage = () => {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(4.99);
  const [maxPrice, setMaxPrice] = useState(30);
  const [commissionThreshold, setCommissionThreshold] = useState(10);
  const [commissionRate, setCommissionRate] = useState(15);
  const [isSchool, setIsSchool] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (currentUser?.role === 'school') {
      setIsSchool(true);
      fetchPricingConfig();
    }
  }, [currentUser]);

  const fetchPricingConfig = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-school-pricing', {
        body: { action: 'get_pricing_config' }
      });
      
      if (error) throw error;
      if (data) {
        setMinPrice(data.min_price / 100);
        setMaxPrice(data.max_price / 100);
        setCommissionThreshold(data.commission_threshold / 100);
        setCommissionRate(data.commission_rate);
      }
    } catch (error) {
      console.error('Error fetching pricing config:', error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricePerStudent: 9.99,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const priceInCents = Math.round(values.pricePerStudent * 100);
      
      const { data, error } = await supabase.functions.invoke('manage-school-pricing', {
        body: {
          action: 'create_subscription',
          data: {
            schoolId: currentUser?.id,
            pricePerStudent: priceInCents
          }
        }
      });
      
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
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

  // Calculate commission amount
  const calculateCommission = (price: number) => {
    if (price >= commissionThreshold) {
      return (price * commissionRate) / 100;
    }
    return 0;
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Training Journey</h1>
          <p className="text-muted-foreground">
            {isSchool 
              ? "Configure your school subscription to give your athletes the best experience"
              : "Get access to all premium features and take your training to the next level"
            }
          </p>
        </div>

        {isSchool ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SchoolIcon className="w-5 h-5" />
                School Subscription
              </CardTitle>
              <CardDescription>Set your price per student per month</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pricePerStudent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per student (${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)})</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              className="pl-8"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              min={minPrice}
                              max={maxPrice}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('pricePerStudent') >= commissionThreshold && (
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-sm flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>
                          For prices above ${commissionThreshold.toFixed(2)}, a {commissionRate}% platform commission applies.
                        </p>
                        <p className="mt-1 font-medium">
                          Your commission: ${calculateCommission(form.watch('pricePerStudent')).toFixed(2)} per student
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Subscription Includes:</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">✓ School dashboard</li>
                      <li className="flex items-center gap-2">✓ Unlimited athletes</li>
                      <li className="flex items-center gap-2">✓ Custom challenges</li>
                      <li className="flex items-center gap-2">✓ Progress tracking tools</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full" 
                    size="lg" 
                    disabled={loading || !currentUser}
                  >
                    {loading ? "Processing..." : "Subscribe Now"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
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
