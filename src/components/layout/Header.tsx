
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Bell } from "lucide-react";

const Header = () => {
  const { currentUser } = useApp();
  
  if (!currentUser) return null;
  
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-card">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold md:text-2xl">JU-PLAY</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
