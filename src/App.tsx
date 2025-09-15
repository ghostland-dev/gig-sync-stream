
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { PerformanceMonitor } from "@/components/ui/performance-monitor";
import { usePerformance, useCoreWebVitals, useResourceTiming } from "@/hooks/usePerformance";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/Layout/ProtectedRoute";
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
import Drafts from "./pages/Drafts";
import Platform from "./pages/Platform";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  usePerformance();
  useCoreWebVitals();
  useResourceTiming();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/pending" element={
              <ProtectedRoute>
                <Pending />
              </ProtectedRoute>
            } />
            <Route path="/important" element={
              <ProtectedRoute>
                <Important />
              </ProtectedRoute>
            } />
            <Route path="/archives" element={
              <ProtectedRoute>
                <Archives />
              </ProtectedRoute>
            } />
            <Route path="/trash" element={
              <ProtectedRoute>
                <Trash />
              </ProtectedRoute>
            } />
            <Route path="/drafts" element={
              <ProtectedRoute>
                <Drafts />
              </ProtectedRoute>
            } />
            <Route path="/platform/:platform" element={
              <ProtectedRoute>
                <Platform />
              </ProtectedRoute>
            } />
            <Route path="/statistics" element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <InstallPrompt />
        <PerformanceMonitor />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
