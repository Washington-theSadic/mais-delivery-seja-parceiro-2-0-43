
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/context/AdminContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MarketingCampaigns from "./pages/admin/MarketingCampaigns";
import TeamImages from "./pages/admin/TeamImages";
import Testimonials from "./pages/admin/Testimonials";
import VideoLinks from "./pages/admin/VideoLinks";
import ThankYou from "./pages/ThankYou";

// Create the QueryClient outside of the component
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/obrigado" element={<ThankYou />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/marketing" element={<MarketingCampaigns />} />
              <Route path="/admin/team" element={<TeamImages />} />
              <Route path="/admin/testimonials" element={<Testimonials />} />
              <Route path="/admin/videos" element={<VideoLinks />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
