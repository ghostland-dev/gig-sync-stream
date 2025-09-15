
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
  Home,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { 
    getInboxMessages, 
    getFavoriteMessages, 
    getPendingMessages, 
    getImportantMessages,
    getMessagesByPlatform 
  } = useMessages();
  
  // Get message counts
  const inboxCount = getInboxMessages().filter(m => m.unread).length;
  const favoriteCount = getFavoriteMessages().length;
  const pendingCount = getPendingMessages().length;
  const importantCount = getImportantMessages().length;
  
  const platformCounts = {
    fiverr: getMessagesByPlatform('fiverr').filter(m => m.unread).length,
    upwork: getMessagesByPlatform('upwork').filter(m => m.unread).length,
    malt: getMessagesByPlatform('malt').filter(m => m.unread).length,
    codeur: getMessagesByPlatform('codeur').filter(m => m.unread).length,
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Profile section at top */}
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
            badge={inboxCount}
            to="/messages"
            active={location.pathname === '/messages'}
          />
          <NavItem 
            icon={<Star className="h-5 w-5" />} 
            label="Favoris" 
            badge={favoriteCount}
            to="/favorites"
            active={location.pathname === '/favorites'}
          />
          <NavItem 
            icon={<Clock className="h-5 w-5" />} 
            label="En attente" 
            badge={pendingCount}
            to="/pending"
            active={location.pathname === '/pending'}
          />
          <NavItem 
            icon={<AlertCircle className="h-5 w-5" />} 
            label="Important" 
            badge={importantCount}
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
            <NavItem 
              label="Fiverr" 
              platformColor="fiverr" 
              badge={platformCounts.fiverr} 
              to="/platform/fiverr" 
              active={location.pathname === '/platform/fiverr'} 
            />
            <NavItem 
              label="Upwork" 
              platformColor="upwork" 
              badge={platformCounts.upwork} 
              to="/platform/upwork" 
              active={location.pathname === '/platform/upwork'} 
            />
            <NavItem 
              label="Malt" 
              platformColor="malt" 
              badge={platformCounts.malt} 
              to="/platform/malt" 
              active={location.pathname === '/platform/malt'} 
            />
            <NavItem 
              label="Codeur.fr" 
              platformColor="codeur" 
              badge={platformCounts.codeur} 
              to="/platform/codeur" 
              active={location.pathname === '/platform/codeur'} 
            />
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
      
      {/* User profile section at bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <div className="flex items-center w-full">
                <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-semibold text-sm mr-3">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs opacity-70 capitalize">{user?.plan} Plan</div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
