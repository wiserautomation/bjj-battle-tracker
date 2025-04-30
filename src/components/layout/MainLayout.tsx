
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useApp } from "@/context/AppContext";
import { useIsMobile, useIsNativeApp } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser } = useApp();
  const isMobile = useIsMobile();
  const isNativeApp = useIsNativeApp();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bjj-navy text-white">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to JU-PLAY</h1>
          <p className="text-xl">Please log in to continue</p>
        </div>
      </div>
    );
  }

  // Add additional styles for native apps including iOS safe areas
  const nativeAppStyles = isNativeApp ? 
    "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right" : "";

  // Ensure TooltipProvider is the outermost provider that needs React context
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className={`min-h-screen flex w-full ${nativeAppStyles}`}>
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className={`flex-1 p-4 ${isMobile ? "pb-16" : ""} overflow-auto`}>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default MainLayout;
