
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { School, User, Athlete } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, Users, Mail, School as SchoolIcon, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { mockSchools } from "@/services/mock/schools";
import { mockAthletes } from "@/services/mock/athletes";

const AdminPage = () => {
  const { currentUser, getSchools } = useApp();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [comissionRate, setComissionRate] = useState(15);
  const [minPrice, setMinPrice] = useState(4.99);
  const [maxPrice, setMaxPrice] = useState(30);
  const [comissionThreshold, setComissionThreshold] = useState(10);
  const [configId, setConfigId] = useState<string | null>(null);
  const [schoolDialogOpen, setSchoolDialogOpen] = useState(false);
  const [athleteDialogOpen, setAthleteDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states for adding/editing schools
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [schoolDescription, setSchoolDescription] = useState("");
  const [schoolContact, setSchoolContact] = useState("");
  const [schoolPricing, setSchoolPricing] = useState(9.99);

  // States for notifications
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationRecipients, setNotificationRecipients] = useState<string[]>([]);
  const [schoolFilter, setSchoolFilter] = useState<string | "all">("all");

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      try {
        if (currentUser?.role === 'admin') {
          setIsAdmin(true);
          // Add test school
          const testSchool: School = {
            id: "resiliance-bjj",
            name: "Resiliance BJJ",
            email: "contact@resiliancebjj.com",
            role: "school",
            location: "123 Main St, San Francisco, CA",
            contact: "(555) 123-4567",
            description: "A premier BJJ academy focused on technical excellence and competitive success.",
            athletes: [],
            profilePicture: "/placeholder.svg"
          };

          const allSchools = [...mockSchools];
          if (!allSchools.find(s => s.id === testSchool.id)) {
            allSchools.push(testSchool);
          }
          
          setSchools(allSchools);
          setAthletes(mockAthletes);
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

  const openAddSchoolDialog = () => {
    setCurrentSchool(null);
    setSchoolName("");
    setSchoolEmail("");
    setSchoolLocation("");
    setSchoolDescription("");
    setSchoolContact("");
    setSchoolPricing(9.99);
    setSchoolDialogOpen(true);
  };

  const openEditSchoolDialog = (school: School) => {
    setCurrentSchool(school);
    setSchoolName(school.name);
    setSchoolEmail(school.email);
    setSchoolLocation(school.location || "");
    setSchoolDescription(school.description || "");
    setSchoolContact(school.contact || "");
    setSchoolPricing(school.pricing?.pricePerStudent ? school.pricing.pricePerStudent / 100 : 9.99);
    setSchoolDialogOpen(true);
  };

  const handleSchoolSubmit = () => {
    if (currentSchool) {
      // Edit existing school
      const updatedSchool: School = {
        ...currentSchool,
        name: schoolName,
        email: schoolEmail,
        location: schoolLocation,
        description: schoolDescription,
        contact: schoolContact,
        pricing: {
          pricePerStudent: Math.round(schoolPricing * 100)
        }
      };
      
      setSchools(schools.map(s => s.id === updatedSchool.id ? updatedSchool : s));
      
      toast({
        title: "School Updated",
        description: `${schoolName} has been updated successfully.`
      });
    } else {
      // Add new school
      const newSchool: School = {
        id: `school-${Date.now()}`,
        name: schoolName,
        email: schoolEmail,
        role: "school",
        location: schoolLocation,
        description: schoolDescription,
        contact: schoolContact,
        athletes: [],
        pricing: {
          pricePerStudent: Math.round(schoolPricing * 100)
        }
      };
      
      setSchools([...schools, newSchool]);
      
      toast({
        title: "School Added",
        description: `${schoolName} has been added successfully.`
      });
    }
    
    setSchoolDialogOpen(false);
  };

  const deleteSchool = (schoolId: string) => {
    setSchools(schools.filter(s => s.id !== schoolId));
    
    toast({
      title: "School Deleted",
      description: "The school has been removed."
    });
  };

  const openNotificationDialog = () => {
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationRecipients([]);
    setSchoolFilter("all");
    setNotificationDialogOpen(true);
  };

  const handleSendNotification = () => {
    const targetSchools = schoolFilter === "all" 
      ? schools
      : schools.filter(s => s.id === schoolFilter);
    
    const recipientCount = targetSchools.length;
    
    toast({
      title: "Notification Sent",
      description: `Your notification has been sent to ${recipientCount} school${recipientCount !== 1 ? 's' : ''}.`
    });
    
    setNotificationDialogOpen(false);
  };

  const filteredSchools = searchTerm
    ? schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.location && school.location.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : schools;

  const filteredAthletes = searchTerm
    ? athletes.filter(athlete =>
        athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.belt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : athletes;

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

        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search schools and athletes..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={openNotificationDialog}>
              <Bell className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
            <Button onClick={openAddSchoolDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add School
            </Button>
          </div>
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
                  <div className="text-2xl font-bold">{athletes.length}</div>
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
                  {filteredSchools.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No schools found matching your search.</p>
                  ) : (
                    filteredSchools.map(school => (
                      <div key={school.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h3 className="font-medium">{school.name}</h3>
                          <p className="text-sm text-muted-foreground">{school.location}</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">{school.athletes?.length || 0} athletes</span> • 
                            <span className="ml-2">${school.pricing?.pricePerStudent ? (school.pricing.pricePerStudent / 100).toFixed(2) : '9.99'}/month</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditSchoolDialog(school)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => deleteSchool(school.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={openAddSchoolDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New School
                </Button>
              </CardFooter>
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
                <div className="space-y-4">
                  {filteredAthletes.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No athletes found matching your search.</p>
                  ) : (
                    filteredAthletes.map(athlete => (
                      <div key={athlete.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={athlete.profilePicture} alt={athlete.name} />
                            <AvatarFallback className={`bg-bjj-${athlete.belt}`}>
                              {athlete.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{athlete.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="capitalize">
                                {athlete.belt} Belt
                              </Badge>
                              {Array.from({ length: athlete.stripes }).map((_, i) => (
                                <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* School Dialog */}
      <Dialog open={schoolDialogOpen} onOpenChange={setSchoolDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentSchool ? "Edit School" : "Add New School"}</DialogTitle>
            <DialogDescription>
              {currentSchool ? "Update the school information." : "Enter the details for the new school."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="school-name">School Name</Label>
              <Input 
                id="school-name" 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g., Elite BJJ Academy"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-email">Email</Label>
              <Input 
                id="school-email" 
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                placeholder="e.g., contact@elitebjj.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-location">Location</Label>
              <Input 
                id="school-location" 
                value={schoolLocation}
                onChange={(e) => setSchoolLocation(e.target.value)}
                placeholder="e.g., 123 Main St, New York, NY"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-contact">Contact Number</Label>
              <Input 
                id="school-contact" 
                value={schoolContact}
                onChange={(e) => setSchoolContact(e.target.value)}
                placeholder="e.g., (555) 123-4567"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-description">Description</Label>
              <Input 
                id="school-description" 
                value={schoolDescription}
                onChange={(e) => setSchoolDescription(e.target.value)}
                placeholder="Brief description of the school"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school-pricing">Price per Student ($ per month)</Label>
              <Input 
                id="school-pricing" 
                type="number"
                step="0.01"
                min={minPrice}
                max={maxPrice}
                value={schoolPricing}
                onChange={(e) => setSchoolPricing(parseFloat(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Price must be between ${minPrice.toFixed(2)} and ${maxPrice.toFixed(2)}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSchoolDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSchoolSubmit}>
              {currentSchool ? "Save Changes" : "Add School"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Platform Notification</DialogTitle>
            <DialogDescription>
              Send notifications to schools and athletes
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Recipients</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
              >
                <option value="all">All Schools</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notification-title">Title</Label>
              <Input 
                id="notification-title" 
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="e.g., Important Platform Update"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notification-message">Message</Label>
              <textarea 
                id="notification-message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your notification message here..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSendNotification} 
              disabled={!notificationTitle.trim() || !notificationMessage.trim()}
            >
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminPage;
