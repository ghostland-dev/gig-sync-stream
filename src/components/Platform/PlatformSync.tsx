import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PlatformSyncProps {
  platform?: 'fiverr' | 'upwork' | 'malt' | 'codeur';
}

export const PlatformSync: React.FC<PlatformSyncProps> = ({ platform }) => {
  const { integrations, connectPlatform, disconnectPlatform, updateIntegration, isLoading } = useSettings();
  const { toast } = useToast();
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    platform: '',
    username: '',
    apiKey: '',
    showForm: false
  });

  const platformsToShow = platform ? 
    integrations.filter(p => p.platform === platform) : 
    integrations;

  const handleConnect = async (platformId: string) => {
    if (!connectionForm.username) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir vos identifiants.",
        variant: "destructive"
      });
      return;
    }

    try {
      await connectPlatform(platformId, {
        username: connectionForm.username,
        apiKey: connectionForm.apiKey
      });
      
      toast({
        title: "Connexion réussie",
        description: `${platformId} a été connecté avec succès.`
      });
      
      setConnectionForm({
        platform: '',
        username: '',
        apiKey: '',
        showForm: false
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la plateforme.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      await disconnectPlatform(platformId);
      toast({
        title: "Déconnexion réussie",
        description: `${platformId} a été déconnecté.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter la plateforme.",
        variant: "destructive"
      });
    }
  };

  const handleSync = async (platformId: string) => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          toast({
            title: "Synchronisation terminée",
            description: `Les données de ${platformId} ont été synchronisées.`
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Update last sync time
    await updateIntegration(platformId, {
      lastSync: new Date().toISOString()
    });
  };

  const toggleSync = async (platformId: string, enabled: boolean) => {
    await updateIntegration(platformId, {
      syncEnabled: enabled
    });
    
    toast({
      title: enabled ? "Synchronisation activée" : "Synchronisation désactivée",
      description: `La synchronisation automatique pour ${platformId} a été ${enabled ? 'activée' : 'désactivée'}.`
    });
  };

  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'fiverr': return '🟢';
      case 'upwork': return '🔵';
      case 'malt': return '🟡';
      case 'codeur': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusColor = (connected: boolean, syncEnabled: boolean) => {
    if (!connected) return 'destructive';
    if (connected && syncEnabled) return 'default';
    return 'secondary';
  };

  const getStatusText = (connected: boolean, syncEnabled: boolean) => {
    if (!connected) return 'Déconnecté';
    if (connected && syncEnabled) return 'Synchronisé';
    return 'Connecté';
  };

  return (
    <div className="space-y-4">
      {!platform && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Synchronisation des plateformes</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => platformsToShow.forEach(p => p.connected && handleSync(p.platform))}
            disabled={isSyncing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Synchroniser tout
          </Button>
        </div>
      )}

      {platformsToShow.map((integration) => (
        <Card key={integration.platform} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getPlatformIcon(integration.platform)}</span>
                <div>
                  <CardTitle className="text-base capitalize">{integration.platform}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusColor(integration.connected, integration.syncEnabled)}>
                      {getStatusText(integration.connected, integration.syncEnabled)}
                    </Badge>
                    {integration.connected && integration.lastSync && (
                      <span className="text-xs text-muted-foreground">
                        Synchronisé {formatDistanceToNow(new Date(integration.lastSync), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(integration.platform)}
                      disabled={isSyncing || isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDisconnect(integration.platform)}
                      disabled={isLoading}
                    >
                      <WifiOff className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setConnectionForm({
                      platform: integration.platform,
                      username: '',
                      apiKey: '',
                      showForm: true
                    })}
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Connecter
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Connection Form */}
            {connectionForm.showForm && connectionForm.platform === integration.platform && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`username-${integration.platform}`}>Nom d'utilisateur</Label>
                  <Input
                    id={`username-${integration.platform}`}
                    value={connectionForm.username}
                    onChange={(e) => setConnectionForm(prev => ({ 
                      ...prev, 
                      username: e.target.value 
                    }))}
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`apikey-${integration.platform}`}>Clé API (optionnel)</Label>
                  <Input
                    id={`apikey-${integration.platform}`}
                    type="password"
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm(prev => ({ 
                      ...prev, 
                      apiKey: e.target.value 
                    }))}
                    placeholder="Votre clé API"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleConnect(integration.platform)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Connecter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConnectionForm(prev => ({ 
                      ...prev, 
                      showForm: false 
                    }))}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {/* Sync Progress */}
            {isSyncing && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Synchronisation en cours...</span>
                  <span className="text-sm font-medium">{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}

            {/* Platform Details */}
            {integration.connected && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Synchronisation automatique</span>
                  </div>
                  <Switch
                    checked={integration.syncEnabled}
                    onCheckedChange={(enabled) => toggleSync(integration.platform, enabled)}
                  />
                </div>

                {integration.username && (
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Connecté en tant que <span className="font-medium">{integration.username}</span>
                    </span>
                  </div>
                )}

                {integration.syncEnabled && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Zap className="h-4 w-4" />
                    Synchronisation automatique activée
                  </div>
                )}
              </div>
            )}

            {!integration.connected && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Connectez votre compte pour synchroniser les messages
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};