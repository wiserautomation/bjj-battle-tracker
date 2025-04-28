import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";

const AdminPage = () => {
  const { currentUser } = useApp();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [comissionRate, setComissionRate] = useState(15);
  const [minPrice, setMinPrice] = useState(4.99);
  const [maxPrice, setMaxPrice] = useState(30);
  const [comissionThreshold, setComissionThreshold] = useState(10);
  const [configId, setConfigId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      try {
        if (currentUser?.email === "peghin@gmail.com") {
          setIsAdmin(true);
          setSchools([
            { id: '1', name: 'BJJ Elite Academy', location: 'New York', subscriberCount: 45, pricing: 12.99 },
            { id: '2', name: 'Gracie Barra', location: 'Los Angeles', subscriberCount: 68, pricing: 9.99 },
            { id: '3', name: 'Alliance Jiu-Jitsu', location: 'Chicago', subscriberCount: 37, pricing: 14.99 },
          ]);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Could not verify admin privileges"
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      checkAdminStatus();
    }
  }, [currentUser, toast]);

  const fetchPricingConfig = async () => {
    try {
      const { data } = await supabase.functions.invoke('manage-school-pricing', {
        body: { action: 'get_pricing_config' }
      });
      
      if (data) {
        setConfigId(data.id);
        setMinPrice(data.min_price / 100);
        setMaxPrice(data.max_price / 100);
        setComissionRate(data.commission_rate);
        setComissionThreshold(data.commission_threshold / 100);
      }
    } catch (error) {
      console.error('Error fetching pricing config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pricing configuration"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePricingSettings = async () => {
    try {
      setLoading(true);
      await supabase.functions.invoke('manage-school-pricing', {
        body: {
          action: 'update_pricing_config',
          data: {
            id: configId,
            min_price: Math.round(minPrice * 100),
            max_price: Math.round(maxPrice * 100),
            commission_rate: comissionRate,
            commission_threshold: Math.round(comissionThreshold * 100),
          }
        }
      });

      toast({
        title: "Settings Saved",
        description: "Pricing settings have been updated"
      });
    } catch (error) {
      console.error('Error saving pricing config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save pricing configuration"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>You do not have permission to access this page.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage platform settings and monitor schools</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{schools.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">150</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,248.95</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle>Registered Schools</CardTitle>
                <CardDescription>Manage schools and their subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map(school => (
                    <div key={school.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h3 className="font-medium">{school.name}</h3>
                        <p className="text-sm text-muted-foreground">{school.location}</p>
                        <div className="text-sm mt-1">
                          <span className="font-medium">{school.subscriberCount} athletes</span> • 
                          <span className="ml-2">${school.pricing}/month</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Settings</CardTitle>
                <CardDescription>Configure platform-wide pricing rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="min-price">Minimum Price ($)</Label>
                    <Input 
                      id="min-price" 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">Minimum price schools can charge</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-price">Maximum Price ($)</Label>
                    <Input 
                      id="max-price" 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">Maximum price schools can charge</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commission-threshold">Commission Threshold ($)</Label>
                    <Input 
                      id="commission-threshold" 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={comissionThreshold}
                      onChange={(e) => setComissionThreshold(parseFloat(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">Price threshold for commission to apply</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Commission Rate: {comissionRate}%</Label>
                    <Slider 
                      defaultValue={[comissionRate]} 
                      max={30} 
                      step={1}
                      onValueChange={(values) => setComissionRate(values[0])}
                    />
                    <p className="text-sm text-muted-foreground">
                      Commission rate for prices above threshold
                    </p>
                  </div>

                  <Button onClick={handleSavePricingSettings}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
