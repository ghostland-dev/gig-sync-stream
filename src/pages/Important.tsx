import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockImportantMessages = [
  {
    id: "imp1",
    sender: "TechCorp Solutions",
    subject: "Contrat de développement - Signature urgente",
    preview: "URGENT: Le contrat pour le projet d'envergure doit être signé avant vendredi...",
    date: "Il y a 30min",
    unread: true,
    platform: "upwork" as const,
    body: "Bonjour,\n\nURGENT: Le contrat pour le projet d'envergure (développement d'une plateforme SaaS) doit être signé avant vendredi pour respecter le planning client.\n\nValeur du contrat : 25,000€\nDurée : 6 mois\nDémarrage : 1er avril 2024\n\nMerci de me confirmer votre disponibilité dans les plus brefs délais.\n\nCordialement,\nLéa Moreau\nDirectrice Projets - TechCorp Solutions"
  },
  {
    id: "imp2",
    sender: "StartupX",
    subject: "Levée de fonds réussie - Nouveau budget disponible",
    preview: "Excellente nouvelle ! Notre levée de fonds de série A est finalisée...",
    date: "Il y a 2h",
    unread: true,
    platform: "malt" as const,
    body: "Bonjour,\n\nExcellente nouvelle ! Notre levée de fonds de série A est finalisée (2.5M€).\n\nNous pouvons maintenant lancer le projet de refonte complète de notre application dont nous avions discuté. Le budget alloué est de 50,000€.\n\nÊtes-vous toujours intéressé? Nous souhaiterions démarrer dès que possible.\n\nBien cordialement,\nMaxime Leroy\nCTO - StartupX"
  },
  {
    id: "imp3",
    sender: "Ministère de la Transition Numérique",
    subject: "Appel d'offres public - Plateforme gouvernementale",
    preview: "Suite à votre candidature pour l'appel d'offres 2024-GOV-001...",
    date: "Aujourd'hui",
    unread: false,
    platform: "codeur" as const,
    body: "Madame, Monsieur,\n\nSuite à votre candidature pour l'appel d'offres 2024-GOV-001 concernant le développement d'une plateforme gouvernementale de dématérialisation, nous avons le plaisir de vous informer que votre dossier a été présélectionné.\n\nMontant estimé : 150,000€\nDurée : 12 mois\nSoutenance : 25 mars 2024\n\nVous recevrez les détails techniques par courrier recommandé sous 48h.\n\nCordialement,\nService des Marchés Publics\nMinistère de la Transition Numérique"
  }
];

export default function Important() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const selectedMessage = mockImportantMessages.find(message => message.id === selectedMessageId);

  return (
    <Dashboard>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h1 className="text-xl font-semibold">Messages importants</h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive">
                {mockImportantMessages.length} important{mockImportantMessages.length > 1 ? 's' : ''}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Haute priorité et opportunités majeures
              </p>
            </div>
          </div>
          {mockImportantMessages.length > 0 ? (
            <MessageList 
              messages={mockImportantMessages}
              onSelectMessage={(id) => setSelectedMessageId(id)}
              selectedMessageId={selectedMessageId}
            />
          ) : (
            <EmptyState type="no-important" />
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