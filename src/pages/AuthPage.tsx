
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { School, User } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "athlete";
  const [authType, setAuthType] = useState<"login" | "signup">("signup");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authType === "signup") {
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

        toast({
          title: "Account created successfully!",
          description: "You can now log in with your credentials.",
        });

        // Switch to login mode after successful signup
        setAuthType("login");
      } else {
        // Login with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
        
        // Redirect to dashboard after login
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Failed to authenticate. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bjj-navy to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {authType === "login" ? "Sign in to your account" : `Create a ${accountType} account`}
          </CardTitle>
          <CardDescription>
            Enter your details to {authType === "login" ? "sign in to" : "create"} your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authType === "signup" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button 
                type="button" 
                variant={accountType === "athlete" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 p-4 h-auto"
                onClick={() => setAccountType("athlete")}
              >
                <User size={24} />
                <span>Athlete</span>
              </Button>
              <Button 
                type="button" 
                variant={accountType === "school" ? "default" : "outline"}
                className="flex flex-col items-center gap-2 p-4 h-auto"
                onClick={() => setAccountType("school")}
              >
                <School size={24} />
                <span>School</span>
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {authType === "signup" && (
              <>
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
              </>
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
              {loading ? "Please wait..." : authType === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            {authType === "login" ? (
              <>Don't have an account? <button className="underline" onClick={() => setAuthType("signup")}>Sign up</button></>
            ) : (
              <>Already have an account? <button className="underline" onClick={() => setAuthType("login")}>Sign in</button></>
            )}
            <div className="mt-4">
              <Link to="/" className="text-sm text-muted-foreground hover:underline">
                Back to home
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
