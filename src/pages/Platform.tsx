import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Dashboard } from "@/components/Layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages } from "@/hooks/useMessages";
import { useClients } from "@/hooks/useClients";
import { PlatformSync } from "@/components/Platform/PlatformSync";
import { AnalyticsDashboard } from "@/components/Analytics/AnalyticsDashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Search,
  Settings,
  BarChart3,
  RefreshCw,
  DollarSign
} from "lucide-react";
import { PlatformBadge } from "@/components/ui/PlatformBadge";

export default function Platform() {
  const { platform } = useParams<{ platform: string }>();
  const { getMessagesByPlatform, messages } = useMessages();
  const { getClientsByPlatform, clients } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  if (!platform) {
    return (
      <Dashboard>
        <div className="p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-xl font-semibold mb-2">Plateforme non trouvée</h1>
              <p className="text-muted-foreground">La plateforme demandée n'existe pas.</p>
            </CardContent>
          </Card>
        </div>
      </Dashboard>
    );
  }

  const platformMessages = getMessagesByPlatform(platform);
  const platformClients = getClientsByPlatform(platform);
  
  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchQuery) return platformMessages;
    return platformMessages.filter(msg => 
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [platformMessages, searchQuery]);

  const selectedMessage = platformMessages.find(msg => msg.id === selectedMessageId);

  const getRecentStats = () => {
    const recentMessages = platformMessages.filter(msg => {
      const msgDate = new Date(msg.date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return msgDate >= weekAgo;
    });

    const unreadCount = platformMessages.filter(msg => msg.unread).length;
    const activeClients = platformClients.filter(client => client.status === 'active').length;
    
    return {
      totalMessages: platformMessages.length,
      recentMessages: recentMessages.length,
      unreadCount,
      totalClients: platformClients.length,
      activeClients,
      totalRevenue: platformClients.reduce((sum, client) => sum + client.totalRevenue, 0)
    };
  };

  const stats = getRecentStats();

  return (
    <Dashboard>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <PlatformBadge platform={platform as any} />
              <h1 className="text-2xl font-bold tracking-tight capitalize">
                Plateforme {platform}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Synchroniser
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                {stats.recentMessages} cette semaine
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.unreadCount}</div>
              <p className="text-xs text-muted-foreground">À traiter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeClients} actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRevenue.toLocaleString('fr-FR')}€
              </div>
              <p className="text-xs text-muted-foreground">Total plateforme</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="sync">Synchronisation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Messages List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Messages</CardTitle>
                    <div className="relative w-full sm:w-48">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px] overflow-y-auto">
                    {filteredMessages.length > 0 ? (
                      <MessageList
                        messages={filteredMessages}
                        onSelectMessage={setSelectedMessageId}
                        selectedMessageId={selectedMessageId}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-6">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                          {searchQuery ? 'Aucun message trouvé' : 'Aucun message pour cette plateforme'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Message Detail */}
              <Card className="lg:col-span-2">
                <CardContent className="p-0 h-[600px] overflow-y-auto">
                  {selectedMessage ? (
                    <MessageDetail 
                      message={selectedMessage} 
                      onBack={() => setSelectedMessageId(null)} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Sélectionnez un message</h3>
                      <p className="text-muted-foreground text-center">
                        Cliquez sur un message dans la liste pour voir les détails et répondre
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clients de la plateforme
                </CardTitle>
                <CardDescription>
                  Gérez vos clients actifs sur {platform}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformClients.length > 0 ? (
                    platformClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-sm">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {client.status === 'active' ? 'Actif' : 'Inactif'}
                              </Badge>
                              {client.starred && (
                                <Badge variant="outline" className="text-xs">
                                  ⭐ Favori
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{client.totalRevenue.toLocaleString('fr-FR')}€</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{client.totalProjects} projet{client.totalProjects > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Aucun client pour cette plateforme</h3>
                      <p className="text-muted-foreground">
                        Les clients connectés via {platform} apparaîtront ici
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Synchronisation {platform}</h3>
                <p className="text-muted-foreground mb-6">
                  Gérez la synchronisation de vos données avec {platform}
                </p>
              </div>
              <PlatformSync platform={platform as any} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}