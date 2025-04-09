
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Star, 
  Archive, 
  Trash2, 
  Settings, 
  Users, 
  BarChart, 
  Clock,
  AlertCircle,
  X,
  Plus,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-white">GigSync</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white hover:bg-sidebar-accent hover:text-sidebar"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      {/* New Message Button */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2 bg-white text-primary hover:bg-gray-100">
          <Plus className="h-4 w-4" />
          <span>Nouveau message</span>
        </Button>
      </div>
      
      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <NavItem 
            icon={<Home className="h-5 w-5" />} 
            label="Tableau de bord" 
            to="/"
            active={location.pathname === '/'}
          />
          <NavItem 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Boîte de réception" 
            badge={12}
            to="/messages"
            active={location.pathname === '/messages'}
          />
          <NavItem 
            icon={<Star className="h-5 w-5" />} 
            label="Favoris" 
            to="/favorites"
            active={location.pathname === '/favorites'}
          />
          <NavItem 
            icon={<Clock className="h-5 w-5" />} 
            label="En attente" 
            badge={3}
            to="/pending"
            active={location.pathname === '/pending'}
          />
          <NavItem 
            icon={<AlertCircle className="h-5 w-5" />} 
            label="Important" 
            to="/important"
            active={location.pathname === '/important'}
          />
          <NavItem 
            icon={<Archive className="h-5 w-5" />} 
            label="Archives" 
            to="/archives"
            active={location.pathname === '/archives'}
          />
          <NavItem 
            icon={<Trash2 className="h-5 w-5" />} 
            label="Corbeille" 
            to="/trash"
            active={location.pathname === '/trash'}
          />
        </div>
        
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <h3 className="px-3 text-xs font-semibold text-white/70 uppercase tracking-wider">
            Plateformes
          </h3>
          <div className="mt-2 space-y-1">
            <NavItem label="Fiverr" platformColor="fiverr" badge={5} to="/platform/fiverr" active={location.pathname === '/platform/fiverr'} />
            <NavItem label="Upwork" platformColor="upwork" badge={2} to="/platform/upwork" active={location.pathname === '/platform/upwork'} />
            <NavItem label="Malt" platformColor="malt" badge={3} to="/platform/malt" active={location.pathname === '/platform/malt'} />
            <NavItem label="Codeur.fr" platformColor="codeur" badge={2} to="/platform/codeur" active={location.pathname === '/platform/codeur'} />
          </div>
        </div>
        
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <h3 className="px-3 text-xs font-semibold text-white/70 uppercase tracking-wider">
            Outils
          </h3>
          <div className="mt-2 space-y-1">
            <NavItem 
              icon={<BarChart className="h-5 w-5" />} 
              label="Statistiques" 
              to="/statistics"
              active={location.pathname === '/statistics'}
            />
            <NavItem 
              icon={<Users className="h-5 w-5" />} 
              label="Clients" 
              to="/clients"
              active={location.pathname === '/clients'}
            />
            <NavItem 
              icon={<Settings className="h-5 w-5" />} 
              label="Paramètres" 
              to="/settings"
              active={location.pathname === '/settings'}
            />
          </div>
        </div>
      </nav>
      
      {/* Profile section */}
      <div className="p-4 border-t border-sidebar-border flex items-center">
        <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-semibold text-sm">
          JD
        </div>
        <div className="ml-2 text-white">
          <div className="font-medium">Jean Dupont</div>
          <div className="text-xs opacity-70">Pro Plan</div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  platformColor?: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  badge, 
  active = false,
  platformColor,
  to
}) => {
  let colorClasses = active 
    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
    : "text-sidebar-foreground hover:bg-sidebar-border";

  let dotColor = "";
  if (platformColor) {
    switch (platformColor) {
      case 'fiverr':
        dotColor = "bg-fiverr-primary";
        break;
      case 'upwork':
        dotColor = "bg-upwork-primary";
        break;
      case 'malt':
        dotColor = "bg-malt-primary";
        break;
      case 'codeur':
        dotColor = "bg-codeur-primary";
        break;
    }
  }

  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${colorClasses} transition-colors duration-200`}
    >
      {icon ? icon : (
        <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
      )}
      <span className="flex-1">{label}</span>
      {badge && (
        <Badge variant={active ? "secondary" : "outline"} className={active ? "bg-primary text-primary-foreground" : "bg-sidebar-border text-white"}>
          {badge}
        </Badge>
      )}
    </Link>
  );
};
