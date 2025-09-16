import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PlatformBadge } from '@/components/ui/PlatformBadge';

interface NotificationCenterProps {
  trigger?: React.ReactNode;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ trigger }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    getUnreadCount,
    simulateNewNotification
  } = useNotifications();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread' | 'message' | 'project' | 'system'>('all');
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = getUnreadCount();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'project':
        return <Briefcase className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50';
    if (type === 'success') return 'border-green-200 bg-green-50';
    if (type === 'warning') return 'border-orange-200 bg-orange-50';
    if (type === 'message') return 'border-blue-200 bg-blue-50';
    return 'border-border bg-background';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast({
      title: "Notification marquée comme lue",
      description: "La notification a été marquée comme lue."
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "Toutes les notifications marquées comme lues",
      description: `${unreadCount} notifications marquées comme lues.`
    });
  };

  const handleDelete = (id: string, title: string) => {
    deleteNotification(id);
    toast({
      title: "Notification supprimée",
      description: `"${title}" a été supprimée.`
    });
  };

  const handleClearAll = () => {
    clearAll();
    toast({
      title: "Toutes les notifications supprimées",
      description: "Toutes les notifications ont été supprimées."
    });
  };

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} non lues</Badge>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => simulateNewNotification()}
              className="text-xs"
            >
              Test
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Filter and Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Toutes
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </Button>
            <Button
              variant={filter === 'message' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('message')}
            >
              Messages
            </Button>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex-1"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            )}
          </div>

          <Separator />

          {/* Notifications List */}
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`${getNotificationColor(notification.type, notification.priority)} ${
                      !notification.read ? 'border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'success' ? 'bg-green-100 text-green-600' :
                          notification.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                          notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm leading-tight">
                                {notification.title}
                              </h4>
                              {notification.platform && (
                                <div className="mt-1">
                                  <PlatformBadge platform={notification.platform} />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Badge 
                                variant={notification.priority === 'high' ? 'destructive' : 
                                        notification.priority === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {notification.priority === 'high' ? 'Urgent' :
                                 notification.priority === 'medium' ? 'Normal' : 'Info'}
                              </Badge>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(notification.id, notification.title)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </span>
                            
                            {notification.actionUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => {
                                  window.location.href = notification.actionUrl!;
                                  setIsOpen(false);
                                }}
                              >
                                {notification.actionText || 'Voir'}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">
                      {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {filter === 'unread' 
                        ? 'Toutes vos notifications ont été lues.'
                        : 'Vous recevrez ici vos notifications importantes.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};