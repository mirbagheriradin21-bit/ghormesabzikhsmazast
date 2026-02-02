import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LiveTelemetry from "./pages/LiveTelemetry";
import LiveAnalysis from "./pages/LiveAnalysis";
import TrackMapPage from "./pages/TrackMapPage";
import AIStrategy from "./pages/AIStrategy";
import DataAnalysis from "./pages/DataAnalysis";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live-telemetry" element={<LiveTelemetry />} />
          <Route path="/live-analysis" element={<LiveAnalysis />} />
          <Route path="/track-map" element={<TrackMapPage />} />
          <Route path="/ai-strategy" element={<AIStrategy />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/alerts" element={<Alerts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
