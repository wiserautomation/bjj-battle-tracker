
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, LogOut } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Athlete } from "@/types";

const Header = () => {
  const { currentUser, logout } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!currentUser) return null;

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account"
      });
      navigate('/auth');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again"
      });
    }
  };
  
  const userInitials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';
  
  // Check if user is an athlete to access belt color
  const isAthlete = currentUser.role === 'athlete';
  const athlete = isAthlete ? (currentUser as Athlete) : null;
  
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
      <div className="flex items-center gap-2">
        <Link to={currentUser.role === 'school' ? "/school-dashboard" : "/dashboard"}>
          <h1 className="text-xl font-bold md:text-2xl">JU-PLAY</h1>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.profilePicture} />
                <AvatarFallback className={athlete && athlete.belt ? `bg-bjj-${athlete.belt}` : undefined}>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              {currentUser.name}
              <p className="text-xs font-normal text-muted-foreground">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {currentUser.role === 'school' && (
                <DropdownMenuItem asChild>
                  <Link to="/school-dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>School Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/subscription">
                  <User className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
