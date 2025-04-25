
import { useApp } from "@/context/AppContext";
import { Athlete, School } from "@/types";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Trophy, Journal, User, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  const { currentUser } = useApp();
  
  if (!currentUser) return null;
  
  const isAthlete = currentUser.role === 'athlete';
  const user = currentUser as (Athlete | School);
  
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center p-4 gap-2 text-center">
        <Avatar className="h-20 w-20 border-2 border-bjj-gold">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback className="bg-bjj-navy text-white text-xl">
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          {isAthlete && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className={`inline-block px-3 py-1 rounded belt-${(user as Athlete).belt}`}>
                {`${(user as Athlete).belt.charAt(0).toUpperCase() + (user as Athlete).belt.slice(1)} Belt`}
              </span>
              {Array.from({ length: (user as Athlete).stripes }).map((_, i) => (
                <span key={i} className="inline-block h-2 w-2 bg-bjj-gold rounded-full"></span>
              ))}
            </div>
          )}
          {!isAthlete && (
            <p className="text-sm text-muted-foreground">{(user as School).location}</p>
          )}
        </div>
        <SidebarTrigger className="mt-2 md:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center gap-3">
                    <Trophy className="h-5 w-5" />
                    <span>Challenges</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAthlete && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/journal" className="flex items-center gap-3">
                      <Journal className="h-5 w-5" />
                      <span>Journal</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/calendar" className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/profile" className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {!isAthlete && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/athletes" className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>Athletes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="flex justify-center p-4">
        <p className="text-xs text-muted-foreground">PLAY BJJ APP © 2025</p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
