import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockPendingMessages = [
  {
    id: "pend1",
    sender: "Sarah Chen",
    subject: "Révision du projet WordPress",
    preview: "Bonjour, j'attends encore votre retour sur les modifications demandées...",
    date: "Il y a 2h",
    unread: true,
    platform: "fiverr" as const,
    body: "Bonjour,\n\nJ'attends encore votre retour sur les modifications demandées pour le site WordPress. Nous avions convenu d'un délai de 48h et je n'ai toujours pas de nouvelles.\n\nPouvez-vous me tenir informé de l'avancement?\n\nMerci,\nSarah Chen",
    starred: false,
    urgency: 'high' as const,
    labels: ['wordpress', 'en-attente', 'urgent']
  },
  {
    id: "pend2",
    sender: "David Martin",
    subject: "Validation maquettes UI",
    preview: "Les maquettes sont prêtes pour validation. En attente de votre feedback...",
    date: "Hier",
    unread: true,
    platform: "upwork" as const,
    body: "Bonjour,\n\nLes maquettes sont prêtes pour validation. J'ai incorporé tous vos commentaires de la dernière réunion.\n\nEn attente de votre feedback pour passer à l'étape suivante du développement.\n\nVous pouvez voir les maquettes sur Figma : [lien]\n\nCordialement,\nDavid Martin",
    starred: false,
    urgency: 'medium' as const,
    labels: ['ui-ux', 'validation', 'en-attente']
  },
  {
    id: "pend3",
    sender: "Emma Dubois",
    subject: "Paiement en attente - Facture #2024-001",  
    preview: "Bonjour, la facture pour le développement de l'API est toujours en attente de paiement...",
    date: "3 jours",
    unread: false,
    platform: "malt" as const,
    body: "Bonjour,\n\nLa facture #2024-001 pour le développement de l'API REST est toujours en attente de paiement depuis 15 jours.\n\nMontant : 1,500€\nÉchéance : 15 mars 2024\n\nPouvez-vous me tenir informé du statut du paiement?\n\nMerci,\nEmma Dubois",
    starred: false,
    urgency: 'high' as const,
    labels: ['paiement', 'facture', 'en-attente']
  }
];

export default function Pending() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const selectedMessage = mockPendingMessages.find(message => message.id === selectedMessageId);

  return (
    <Dashboard>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <h1 className="text-xl font-semibold">Messages en attente</h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {mockPendingMessages.length} en attente
              </Badge>
              <p className="text-sm text-muted-foreground">
                Nécessitent une action de votre part
              </p>
            </div>
          </div>
          {mockPendingMessages.length > 0 ? (
            <MessageList 
              messages={mockPendingMessages}
              onSelectMessage={(id) => setSelectedMessageId(id)}
              selectedMessageId={selectedMessageId}
            />
          ) : (
            <EmptyState type="no-pending" />
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
    </Dashboard>
  );
}