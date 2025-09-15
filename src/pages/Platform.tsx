import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data par plateforme
const platformMessages = {
  fiverr: [
    {
      id: "fiverr1",
      sender: "Marie Leclerc",
      subject: "Projet de développement web",
      preview: "Bonjour, j'ai vu votre profil et je suis intéressée par vos services pour développer un site e-commerce...",
      date: "10:30",
      unread: true,
      platform: "fiverr" as const,
      body: "Bonjour,\n\nJ'ai vu votre profil et je suis intéressée par vos services pour développer un site e-commerce pour ma boutique de vêtements.\n\nMon budget est d'environ 2000€ et j'aimerais lancer le site dans les 2 mois.\n\nMerci,\nMarie"
    },
    {
      id: "fiverr2",
      sender: "Lucas Moreau",
      subject: "Traduction site web",
      preview: "Bonjour, je cherche un traducteur technique pour traduire notre site web en anglais et en espagnol...",
      date: "28 mars",
      unread: false,
      platform: "fiverr" as const,
      body: "Bonjour,\n\nJe cherche un traducteur technique pour traduire notre site web en anglais et en espagnol.\n\nLe site contient environ 20 pages. Pourriez-vous me faire une proposition?\n\nMerci,\nLucas"
    }
  ],
  upwork: [
    {
      id: "upwork1",
      sender: "Antoine Dubois",
      subject: "Demande de devis pour application mobile",
      preview: "Bonjour, nous sommes une startup dans le secteur de la santé et recherchons un développeur capable de...",
      date: "Hier",
      unread: true,
      platform: "upwork" as const,
      body: "Bonjour,\n\nNous sommes une startup dans le secteur de la santé et recherchons un développeur pour créer une application mobile cross-platform.\n\nCordialement,\nAntoine Dubois"
    },
    {
      id: "upwork2",
      sender: "Laura Petit",
      subject: "Intégration API de paiement",
      preview: "Nous avons besoin d'intégrer plusieurs solutions de paiement à notre plateforme existante...",
      date: "Dim.",
      unread: false,
      platform: "upwork" as const,
      body: "Bonjour,\n\nNous avons besoin d'intégrer plusieurs solutions de paiement (Stripe, PayPal) à notre plateforme React/Node.js.\n\nBien cordialement,\nLaura Petit"
    }
  ],
  malt: [
    {
      id: "malt1",
      sender: "Sophie Martin",
      subject: "Mission freelance UI/UX",
      preview: "Bonjour, je recherche un designer UI/UX pour refondre l'interface de notre application...",
      date: "Hier",
      unread: true,
      platform: "malt" as const,
      body: "Bonjour,\n\nJe recherche un designer UI/UX pour refondre l'interface de notre application de gestion financière.\n\nMeilleures salutations,\nSophie Martin"
    },
    {
      id: "malt2",
      sender: "Julie Lambert",
      subject: "Rédaction fiches produits",
      preview: "Nous lançons une nouvelle gamme de produits écologiques et cherchons un rédacteur web pour...",
      date: "25 mars",
      unread: false,
      platform: "malt" as const,
      body: "Bonjour,\n\nNous lançons une nouvelle gamme de produits écologiques et cherchons un rédacteur web pour créer des fiches produits SEO-friendly.\n\nBien à vous,\nJulie Lambert"
    }
  ],
  codeur: [
    {
      id: "codeur1",
      sender: "Thomas Bernard",
      subject: "Développement plugin WordPress",
      preview: "Bonjour, je cherche un expert WordPress pour développer un plugin personnalisé pour notre site...",
      date: "Lun.",
      unread: false,
      platform: "codeur" as const,
      body: "Bonjour,\n\nJe cherche un expert WordPress pour développer un plugin personnalisé pour notre site d'actualités.\n\nCordialement,\nThomas Bernard"
    },
    {
      id: "codeur2",
      sender: "Pierre Durand",
      subject: "Création logo et identité visuelle",
      preview: "Bonjour, je lance ma société de conseil en stratégie et je recherche un designer pour créer mon identité visuelle...",
      date: "22 mars",
      unread: false,
      platform: "codeur" as const,
      body: "Bonjour,\n\nJe lance ma société de conseil et recherche un designer pour créer mon identité visuelle complète.\n\nCordialement,\nPierre Durand"
    }
  ]
};

const platformStats = {
  fiverr: { messages: 45, revenue: "3,250€", clients: 12, trend: "+12%" },
  upwork: { messages: 23, revenue: "8,150€", clients: 8, trend: "+24%" },
  malt: { messages: 31, revenue: "5,680€", clients: 15, trend: "+18%" },
  codeur: { messages: 18, revenue: "2,890€", clients: 7, trend: "+8%" }
};

const platformNames = {
  fiverr: "Fiverr",
  upwork: "Upwork", 
  malt: "Malt",
  codeur: "Codeur.fr"
};

export default function Platform() {
  const { platform } = useParams<{ platform: string }>();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const platformKey = platform as keyof typeof platformMessages;
  const messages = platformMessages[platformKey] || [];
  const stats = platformStats[platformKey];
  const platformName = platformNames[platformKey];
  
  const selectedMessage = messages.find(message => message.id === selectedMessageId);

  if (!platformKey || !platformMessages[platformKey]) {
    return (
      <Dashboard>
        <EmptyState type="platform-not-found" />
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="flex flex-col h-screen">
        {/* Header avec statistiques */}
        <div className="p-6 border-b border-border bg-background">
          <div className="flex items-center gap-3 mb-4">
            <PlatformBadge platform={platformKey} className="text-lg px-3 py-1" />
            <h1 className="text-2xl font-bold">{platformName}</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.messages}</div>
                <Badge variant="secondary" className="text-xs mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats?.trend}
                </Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.revenue}</div>
                <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.clients}</div>
                <p className="text-xs text-muted-foreground mt-1">Actifs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taux de réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground mt-1">Sous 24h</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
            <div className="p-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                {messages.length} message{messages.length > 1 ? 's' : ''} sur {platformName}
              </p>
            </div>
            {messages.length > 0 ? (
              <MessageList 
                messages={messages}
                onSelectMessage={(id) => setSelectedMessageId(id)}
                selectedMessageId={selectedMessageId}
              />
            ) : (
              <EmptyState type="no-platform-messages" />
            )}
          </div>
          
          <div className="w-full md:w-2/3 overflow-y-auto bg-background">
            {selectedMessage ? (
              <MessageDetail message={selectedMessage} onBack={() => setSelectedMessageId(null)} />
            ) : (
              <EmptyState type="no-message-selected" />
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
}