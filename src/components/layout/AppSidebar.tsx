
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
import { Calendar, Trophy, Notebook, User, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const AppSidebar = () => {
  const { currentUser } = useApp();
  
  if (!currentUser) return null;
  
  const isAthlete = currentUser.role === 'athlete';
  const user = currentUser as (Athlete | School);
  
  // Get safe belt name with fallback for undefined belt
  const getBeltDisplayName = (athlete: Athlete) => {
    if (!athlete.belt) return "No Belt";
    return `${athlete.belt.charAt(0).toUpperCase() + athlete.belt.slice(1)} Belt`;
  };
  
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
          {isAthlete && (user as Athlete).belt && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className={`inline-block px-3 py-1 rounded belt-${(user as Athlete).belt}`}>
                {getBeltDisplayName(user as Athlete)}
              </span>
              {Array.from({ length: (user as Athlete).stripes || 0 }).map((_, i) => (
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
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <Trophy className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAthlete && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/journal" className="flex items-center gap-3">
                      <Notebook className="h-5 w-5" />
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
                  <Link to="/chat" className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" />
                    <span>School Chat</span>
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
                    <Link to="/school-dashboard" className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>School Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="flex justify-center p-4">
        <p className="text-xs text-muted-foreground">JU-PLAY © 2025</p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
