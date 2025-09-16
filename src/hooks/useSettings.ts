import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  timezone: string;
  language: string;
}

export interface NotificationSettings {
  email: {
    newMessages: boolean;
    projectUpdates: boolean;
    marketing: boolean;
    weeklyReport: boolean;
  };
  browser: {
    enabled: boolean;
    sound: boolean;
  };
  platforms: {
    fiverr: boolean;
    upwork: boolean;
    malt: boolean;
    codeur: boolean;
  };
}

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  compactMode: boolean;
  showAvatars: boolean;
  defaultView: 'inbox' | 'messages' | 'clients';
  messagesPerPage: number;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number; // in minutes
  loginHistory: Array<{
    id: string;
    date: string;
    ip: string;
    device: string;
    success: boolean;
  }>;
}

export interface PlatformIntegration {
  platform: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  connected: boolean;
  username?: string;
  lastSync?: string;
  apiKey?: string;
  webhookUrl?: string;
  syncEnabled: boolean;
}

const defaultProfile: UserProfile = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33 6 12 34 56 78',
  bio: 'Développeur web freelance spécialisé en React et Node.js',
  timezone: 'Europe/Paris',
  language: 'fr'
};

const defaultNotifications: NotificationSettings = {
  email: {
    newMessages: true,
    projectUpdates: true,
    marketing: false,
    weeklyReport: true
  },
  browser: {
    enabled: true,
    sound: false
  },
  platforms: {
    fiverr: true,
    upwork: true,
    malt: true,
    codeur: true
  }
};

const defaultPreferences: AppPreferences = {
  theme: 'system',
  autoRefresh: true,
  refreshInterval: 5,
  compactMode: false,
  showAvatars: true,
  defaultView: 'inbox',
  messagesPerPage: 25,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h'
};

const defaultSecurity: SecuritySettings = {
  twoFactorEnabled: false,
  sessionTimeout: 480, // 8 hours
  loginHistory: [
    {
      id: '1',
      date: '2025-04-08T10:30:00Z',
      ip: '192.168.1.100',
      device: 'Chrome on Windows',
      success: true
    },
    {
      id: '2',
      date: '2025-04-07T09:15:00Z',
      ip: '192.168.1.100',
      device: 'Firefox on Windows',
      success: true
    },
    {
      id: '3',
      date: '2025-04-06T14:45:00Z',
      ip: '10.0.0.1',
      device: 'Safari on iPhone',
      success: false
    }
  ]
};

const defaultIntegrations: PlatformIntegration[] = [
  {
    platform: 'fiverr',
    connected: true,
    username: 'jean.dupont',
    lastSync: '2025-04-08T10:00:00Z',
    syncEnabled: true
  },
  {
    platform: 'upwork',
    connected: true,
    username: 'jean.dupont@example.com',
    lastSync: '2025-04-08T10:00:00Z',
    syncEnabled: true
  },
  {
    platform: 'malt',
    connected: false,
    syncEnabled: false
  },
  {
    platform: 'codeur',
    connected: true,
    username: 'JeanD',
    lastSync: '2025-04-08T10:00:00Z',
    syncEnabled: true
  }
];

export const useSettings = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', defaultProfile);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>('notification-settings', defaultNotifications);
  const [preferences, setPreferences] = useLocalStorage<AppPreferences>('app-preferences', defaultPreferences);
  const [security, setSecurity] = useLocalStorage<SecuritySettings>('security-settings', defaultSecurity);
  const [integrations, setIntegrations] = useLocalStorage<PlatformIntegration[]>('platform-integrations', defaultIntegrations);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProfile(prev => ({ ...prev, ...updates }));
    setIsLoading(false);
  };

  const updateNotifications = async (updates: Partial<NotificationSettings>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNotifications(prev => ({ 
      ...prev, 
      ...updates,
      email: updates.email ? { ...prev.email, ...updates.email } : prev.email,
      browser: updates.browser ? { ...prev.browser, ...updates.browser } : prev.browser,
      platforms: updates.platforms ? { ...prev.platforms, ...updates.platforms } : prev.platforms,
    }));
    setIsLoading(false);
  };

  const updatePreferences = async (updates: Partial<AppPreferences>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setPreferences(prev => ({ ...prev, ...updates }));
    
    // Apply theme change immediately
    if (updates.theme) {
      const root = document.documentElement;
      if (updates.theme === 'dark') {
        root.classList.add('dark');
      } else if (updates.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      }
    }
    
    setIsLoading(false);
  };

  const updateSecurity = async (updates: Partial<SecuritySettings>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSecurity(prev => ({ ...prev, ...updates }));
    setIsLoading(false);
  };

  const updateIntegration = async (platform: string, updates: Partial<PlatformIntegration>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIntegrations(prev => prev.map(integration => 
      integration.platform === platform 
        ? { ...integration, ...updates, lastSync: updates.connected ? new Date().toISOString() : integration.lastSync }
        : integration
    ));
    setIsLoading(false);
  };

  const connectPlatform = async (platform: string, credentials: { username?: string; apiKey?: string }): Promise<void> => {
    setIsLoading(true);
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await updateIntegration(platform, {
      connected: true,
      username: credentials.username,
      apiKey: credentials.apiKey,
      syncEnabled: true,
      lastSync: new Date().toISOString()
    });
  };

  const disconnectPlatform = async (platform: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await updateIntegration(platform, {
      connected: false,
      username: undefined,
      apiKey: undefined,
      syncEnabled: false,
      lastSync: undefined
    });
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate password validation
    if (currentPassword.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Mot de passe actuel incorrect' };
    }
    
    if (newPassword.length < 8) {
      setIsLoading(false);
      return { success: false, error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' };
    }
    
    // Add to login history
    const newLogin = {
      id: `login-${Date.now()}`,
      date: new Date().toISOString(),
      ip: '192.168.1.100',
      device: 'Current Device - Password Change',
      success: true
    };
    
    setSecurity(prev => ({
      ...prev,
      loginHistory: [newLogin, ...prev.loginHistory]
    }));
    
    setIsLoading(false);
    return { success: true };
  };

  const enable2FA = async (): Promise<{ success: boolean; qrCode?: string; backupCodes?: string[] }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 2FA setup
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    
    await updateSecurity({ twoFactorEnabled: true });
    
    setIsLoading(false);
    return { 
      success: true, 
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      backupCodes
    };
  };

  const disable2FA = async (): Promise<{ success: boolean }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await updateSecurity({ twoFactorEnabled: false });
    
    setIsLoading(false);
    return { success: true };
  };

  const exportSettings = (): void => {
    const settingsData = {
      profile,
      notifications,
      preferences,
      security: {
        twoFactorEnabled: security.twoFactorEnabled,
        sessionTimeout: security.sessionTimeout
      },
      integrations: integrations.map(i => ({
        platform: i.platform,
        connected: i.connected,
        username: i.username,
        syncEnabled: i.syncEnabled
      })),
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `gigsync-settings-${Date.now()}.json`);
    linkElement.click();
  };

  const importSettings = async (settingsFile: File): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const text = await settingsFile.text();
      const importedSettings = JSON.parse(text);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (importedSettings.profile) setProfile(importedSettings.profile);
      if (importedSettings.notifications) setNotifications(importedSettings.notifications);
      if (importedSettings.preferences) setPreferences(importedSettings.preferences);
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Fichier de paramètres invalide' };
    }
  };

  return {
    profile,
    notifications,
    preferences,
    security,
    integrations,
    isLoading,
    updateProfile,
    updateNotifications,
    updatePreferences,
    updateSecurity,
    updateIntegration,
    connectPlatform,
    disconnectPlatform,
    changePassword,
    enable2FA,
    disable2FA,
    exportSettings,
    importSettings
  };
};