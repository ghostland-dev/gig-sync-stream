import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { useSettings } from './useSettings';

export interface Notification {
  id: string;
  type: 'message' | 'project' | 'system' | 'warning' | 'success';
  title: string;
  message: string;
  platform?: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
}

const generateMockNotifications = (): Notification[] => [
  {
    id: '1',
    type: 'message',
    title: 'Nouveau message sur Fiverr',
    message: 'John Doe vous a envoyé un message concernant le projet "E-commerce Website"',
    platform: 'fiverr',
    priority: 'high',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    actionUrl: '/messages/fiverr-123',
    actionText: 'Voir le message'
  },
  {
    id: '2',
    type: 'project',
    title: 'Nouveau projet Upwork',
    message: 'Alice Smith a accepté votre proposition pour "React Dashboard Development"',
    platform: 'upwork',
    priority: 'medium',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    actionUrl: '/projects/upwork-456',
    actionText: 'Voir le projet'
  },
  {
    id: '3',
    type: 'system',
    title: 'Synchronisation terminée',
    message: 'La synchronisation de vos messages avec toutes les plateformes est terminée',
    priority: 'low',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    type: 'warning',
    title: 'Réponse en attente',
    message: 'Vous avez 3 messages non répondus depuis plus de 24 heures',
    priority: 'medium',
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    actionUrl: '/messages?filter=pending',
    actionText: 'Voir les messages'
  },
  {
    id: '5',
    type: 'success',
    title: 'Paiement reçu',
    message: 'Vous avez reçu un paiement de 1,500€ pour le projet "Mobile App Design"',
    platform: 'malt',
    priority: 'high',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    actionUrl: '/projects/malt-789',
    actionText: 'Voir les détails'
  }
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', generateMockNotifications());
  const [isLoading, setIsLoading] = useState(false);
  const { notifications: notificationSettings } = useSettings();
  
  // Permission state for browser notifications
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setBrowserPermission(permission);
    return permission === 'granted';
  };

  const showBrowserNotification = useCallback((notification: Notification) => {
    if (!notificationSettings.browser.enabled || browserPermission !== 'granted') {
      return;
    }

    const browserNotif = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'high',
      silent: !notificationSettings.browser.sound
    });

    // Auto close after 5 seconds for non-critical notifications
    if (notification.priority !== 'high') {
      setTimeout(() => {
        browserNotif.close();
      }, 5000);
    }

    browserNotif.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
      browserNotif.close();
    };
  }, [browserPermission, notificationSettings.browser]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if enabled
    if (notificationSettings.browser.enabled) {
      showBrowserNotification(newNotification);
    }

    // Play sound if enabled (simplified)
    if (notificationSettings.browser.sound && notificationSettings.browser.enabled) {
      // In a real app, you'd play an actual sound file
      console.log('🔊 Notification sound');
    }

    return newNotification;
  }, [notificationSettings, showBrowserNotification]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Simulate receiving new notifications (for demo purposes)
  const simulateNewNotification = useCallback(() => {
    const types: Array<Notification['type']> = ['message', 'project', 'system', 'warning', 'success'];
    const platforms: Array<Notification['platform']> = ['fiverr', 'upwork', 'malt', 'codeur'];
    const priorities: Array<Notification['priority']> = ['low', 'medium', 'high'];
    
    const mockNotifications = [
      {
        type: 'message' as const,
        title: 'Nouveau message reçu',
        message: 'Un client vous a envoyé un nouveau message',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        priority: 'high' as const
      },
      {
        type: 'project' as const,
        title: 'Proposition acceptée',
        message: 'Votre proposition a été acceptée par le client',
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        priority: 'medium' as const
      },
      {
        type: 'success' as const,
        title: 'Paiement reçu',
        message: `Vous avez reçu un paiement de ${Math.floor(Math.random() * 2000) + 500}€`,
        priority: 'high' as const
      }
    ];

    const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    addNotification(randomNotif);
  }, [addNotification]);

  // Auto-cleanup expired notifications
  useEffect(() => {
    const cleanup = () => {
      setNotifications(prev => 
        prev.filter(notif => 
          !notif.expiresAt || new Date(notif.expiresAt) > new Date()
        )
      );
    };

    const interval = setInterval(cleanup, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [setNotifications]);

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  const getNotificationsByType = (type: Notification['type']) => 
    notifications.filter(n => n.type === type);

  const getRecentNotifications = (hours: number = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return notifications.filter(n => new Date(n.createdAt) > cutoff);
  };

  const getNotificationsByPlatform = (platform: string) =>
    notifications.filter(n => n.platform === platform);

  // Check for overdue messages and create notifications
  const checkForOverdueMessages = useCallback(() => {
    // This would integrate with useMessages to check for overdue responses
    // For now, it's a placeholder that could trigger warnings
    console.log('Checking for overdue messages...');
  }, []);

  return {
    notifications,
    isLoading,
    browserPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    simulateNewNotification,
    requestBrowserPermission,
    getUnreadCount,
    getNotificationsByType,
    getRecentNotifications,
    getNotificationsByPlatform,
    checkForOverdueMessages
  };
};