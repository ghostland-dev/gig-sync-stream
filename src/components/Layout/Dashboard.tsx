
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkipToContent } from '@/components/ui/accessibility';

interface DashboardProps {
  children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <SkipToContent />
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden p-4 bg-primary flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="text-white text-lg font-bold">GigSync</div>
          <div className="w-6"></div> {/* placeholder for balance */}
        </div>

        {/* Sidebar */}
        <nav 
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out absolute md:relative z-10 md:z-0 h-[calc(100vh-4rem)] md:h-screen w-64 md:w-64 bg-sidebar shadow-lg md:shadow-none`}
          aria-label="Navigation principale"
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </nav>

        {/* Main content */}
        <div className="flex-1 transition-all duration-300">
          <main id="main-content" className="p-0" role="main">
            {children}
          </main>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer le menu"
          />
        )}
      </div>
    </>
  );
};
