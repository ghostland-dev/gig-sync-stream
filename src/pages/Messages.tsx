
import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/ui/PlatformBadge";

// Mock data for message list
const mockMessages = [
  {
    id: "1",
    platform: "fiverr" as const,
    sender: "John Doe",
    subject: "Projet de site web e-commerce",
    preview: "Bonjour, je suis intéressé par vos services pour créer un site e-commerce...",
    body: "Bonjour,\n\nJe suis intéressé par vos services pour créer un site e-commerce pour ma boutique de vêtements. J'aimerais discuter des fonctionnalités dont j'ai besoin et obtenir un devis.\n\nPouvez-vous me contacter pour en discuter plus en détail?\n\nCordialement,\nJohn Doe",
    date: "2025-04-08T14:30:00",
    unread: true,
    starred: false,
    urgency: 'medium' as const,
    labels: ['nouveau-client', 'e-commerce']
  },
  {
    id: "2",
    platform: "upwork" as const,
    sender: "Alice Smith",
    subject: "Développement d'une application mobile",
    preview: "Salut, j'ai besoin d'un développeur pour une application mobile native...",
    body: "Salut,\n\nJ'ai besoin d'un développeur pour une application mobile native pour iOS et Android. L'application permettra aux utilisateurs de suivre leurs habitudes quotidiennes et de recevoir des rappels.\n\nAvez-vous de l'expérience dans ce domaine? Quel serait votre tarif pour ce projet?\n\nMerci,\nAlice Smith",
    date: "2025-04-07T09:15:00",
    unread: false,
    starred: true,
    urgency: 'high' as const,
    labels: ['mobile', 'urgent']
  },
  {
    id: "3",
    platform: "malt" as const,
    sender: "Pierre Dupont",
    subject: "Refonte de site WordPress",
    preview: "Bonjour, je cherche un expert WordPress pour refaire mon site vitrine...",
    body: "Bonjour,\n\nJe cherche un expert WordPress pour refaire mon site vitrine qui est devenu obsolète. J'aimerais un design moderne et responsive, ainsi qu'une optimisation SEO.\n\nPouvez-vous me partager votre portfolio de sites WordPress que vous avez réalisés?\n\nCordialement,\nPierre Dupont",
    date: "2025-04-06T16:45:00",
    unread: true,
    starred: false,
    urgency: 'low' as const,
    labels: ['wordpress', 'refonte']
  },
  {
    id: "4",
    platform: "codeur" as const,
    sender: "Marie Martin",
    subject: "Intégration HTML/CSS",
    preview: "Bonjour, j'ai des maquettes Figma à intégrer en HTML/CSS responsive...",
    body: "Bonjour,\n\nJ'ai des maquettes Figma à intégrer en HTML/CSS responsive pour le site de mon entreprise. Il s'agit d'environ 5 pages avec quelques animations simples.\n\nÊtes-vous disponible dans les deux prochaines semaines pour réaliser ce travail?\n\nMerci d'avance,\nMarie Martin",
    date: "2025-04-05T11:20:00",
    unread: false,
    starred: false,
    urgency: 'medium' as const,
    labels: ['integration', 'figma']
  },
];

export default function Messages() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const selectedMessage = mockMessages.find(message => message.id === selectedMessageId);

  return (
    <Dashboard>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Message list panel */}
        <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-semibold">Boîte de réception</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="bg-primary/10">Tous</Badge>
              <PlatformBadge platform="fiverr" />
              <PlatformBadge platform="upwork" />
              <PlatformBadge platform="malt" />
              <PlatformBadge platform="codeur" />
            </div>
          </div>
          <MessageList 
            messages={mockMessages}
            onSelectMessage={(id) => setSelectedMessageId(id)}
            selectedMessageId={selectedMessageId}
          />
        </div>
        
        {/* Message detail panel */}
        <div className="w-full md:w-2/3 overflow-y-auto bg-background">
          {selectedMessage ? (
            <MessageDetail message={selectedMessage} onBack={() => setSelectedMessageId(null)} />
          ) : (
            <EmptyState type="no-message-selected" />
          )}
        </div>
      </div>
    </Dashboard>
  );
}
