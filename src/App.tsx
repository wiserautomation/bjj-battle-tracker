
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import JournalPage from "./pages/JournalPage";
import ProfilePage from "./pages/ProfilePage";
import CalendarPage from "./pages/CalendarPage";
import AthletesPage from "./pages/AthletesPage";
import ChallengeDetailPage from "./pages/ChallengeDetailPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import SchoolDashboardPage from "./pages/SchoolDashboardPage";
import SchoolBillingPage from "./pages/SchoolBillingPage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";

// Create a single queryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Index />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/athletes" element={<AthletesPage />} />
              <Route path="/challenge/:id" element={<ChallengeDetailPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/school-dashboard" element={<SchoolDashboardPage />} />
              <Route path="/school-dashboard/billing" element={<SchoolBillingPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
