
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden p-4 bg-primary flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="text-white text-lg font-bold">GigSync</div>
        <div className="w-6"></div> {/* placeholder for balance */}
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out absolute md:relative z-10 md:z-0 h-[calc(100vh-4rem)] md:h-screen w-64 md:w-64 bg-sidebar shadow-lg md:shadow-none`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 transition-all duration-300">
        <main className="p-0">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
