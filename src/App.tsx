
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Statistics from "./pages/Statistics";
import Clients from "./pages/Clients";
import Settings from "./pages/Settings";
import Favorites from "./pages/Favorites";
import Pending from "./pages/Pending";
import Important from "./pages/Important";
import Archives from "./pages/Archives";
import Trash from "./pages/Trash";
import Platform from "./pages/Platform";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/important" element={<Important />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/platform/:platform" element={<Platform />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
