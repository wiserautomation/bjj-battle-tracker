
import { ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useApp } from "@/context/AppContext";
import { useIsMobile, useIsNativeApp } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, loading } = useApp();
  const isMobile = useIsMobile();
  const isNativeApp = useIsNativeApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not loading and no user, redirect to auth page
    if (!loading && !currentUser) {
      navigate("/auth");
    }
    
    // Redirect school users to the school dashboard
    if (!loading && currentUser && currentUser.role === 'school') {
      navigate("/school-dashboard", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bjj-navy text-white">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Loading JU-PLAY</h1>
          <p className="text-xl">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to auth page in useEffect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className={`flex-1 p-4 ${isMobile ? "pb-16" : ""} overflow-auto`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
