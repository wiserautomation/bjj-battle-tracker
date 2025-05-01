
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User, Mail } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "athlete";
  const [accountType, setAccountType] = useState<"athlete" | "school">(initialType as "athlete" | "school");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [belt, setBelt] = useState("white");
  const [stripes, setStripes] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentUser } = useApp();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: accountType,
            ...(accountType === "athlete" 
              ? { belt, stripes: Number(stripes) } 
              : { location }),
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user object to update context
        const newUser: User = {
          id: data.user.id,
          name: name,
          email: data.user.email || "",
          role: accountType,
          profilePicture: "/placeholder.svg",
          schoolId: null
        };
        
        setCurrentUser(newUser);
      }

      toast({
        title: "Account created successfully!",
        description: "You can now log in with your credentials.",
      });

      // Redirect to dashboard after successful signup
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // If we have user data, update the context
      if (data.user) {
        // Get user metadata to create proper user object
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const metadata = userData.user.user_metadata;
          
          const user: User = {
            id: userData.user.id,
            name: metadata?.name || "Unknown User",
            email: userData.user.email || "",
            role: metadata?.role || "athlete",
            profilePicture: metadata?.avatar_url || "/placeholder.svg",
            schoolId: metadata?.schoolId || null
          };
          
          setCurrentUser(user);
        }
      }

      toast({
        title: "Login successful!",
        description: "Welcome back!",
      });
      
      // Redirect to dashboard after login
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
      
      // Note: No navigation needed here as OAuth will handle the redirect
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error.message || "Failed to authenticate with Google. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bjj-navy to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">JU-PLAY</CardTitle>
          <CardDescription>
            Sign in or create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="m@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Sign In with Email"}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign In with Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button 
                  type="button" 
                  variant={accountType === "athlete" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 p-4 h-auto"
                  onClick={() => setAccountType("athlete")}
                >
                  <User className="h-5 w-5" />
                  <span>Athlete</span>
                </Button>
                <Button 
                  type="button" 
                  variant={accountType === "school" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 p-4 h-auto"
                  onClick={() => setAccountType("school")}
                >
                  <School className="h-5 w-5" />
                  <span>School</span>
                </Button>
              </div>
              
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder={accountType === "athlete" ? "Your name" : "School name"} 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                {accountType === "athlete" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="belt">Belt</Label>
                      <select 
                        id="belt" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={belt}
                        onChange={(e) => setBelt(e.target.value)}
                        required
                      >
                        <option value="white">White</option>
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="brown">Brown</option>
                        <option value="black">Black</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripes">Stripes</Label>
                      <select 
                        id="stripes" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={stripes}
                        onChange={(e) => setStripes(Number(e.target.value))}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="School location" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign Up with Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
