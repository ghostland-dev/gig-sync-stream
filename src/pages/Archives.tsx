import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { Archive, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockArchivedMessages = [
  {
    id: "arch1",
    sender: "Julie Legrand",
    subject: "Projet terminé - Site vitrine restaurant",
    preview: "Merci pour l'excellent travail sur notre site vitrine. Le client est ravi...",
    date: "15 mars",
    unread: false,
    platform: "fiverr" as const,
    body: "Bonjour,\n\nMerci pour l'excellent travail sur notre site vitrine pour le restaurant 'Le Petit Jardin'. Le client est ravi du résultat final.\n\nLe site est maintenant en ligne et génère déjà des réservations. Nous n'hésiterons pas à faire appel à vos services pour de futurs projets.\n\nExcellente continuation,\nJulie Legrand\nAgence WebDesign Pro",
    starred: false,
    urgency: 'low' as const,
    labels: ['termine', 'restaurant', 'site-vitrine']
  },
  {
    id: "arch2",
    sender: "Marc Duval",
    subject: "Application mobile livrée - Feedback positif",
    preview: "L'application mobile pour notre startup a été livrée avec succès...",
    date: "10 mars",
    unread: false,
    platform: "upwork" as const,
    body: "Bonjour,\n\nL'application mobile pour notre startup FinTech a été livrée avec succès. Tous les tests sont passés et l'app est maintenant sur les stores.\n\nNos utilisateurs adorent l'interface intuitive que vous avez créée. Les téléchargements progressent bien depuis le lancement.\n\nUn grand merci pour votre professionnalisme,\nMarc Duval\nCEO - FinTech Solutions",
    starred: false,
    urgency: 'low' as const,
    labels: ['termine', 'mobile', 'fintech']
  },
  {
    id: "arch3",
    sender: "Sophie Bernard",
    subject: "Formation React terminée - Certification",
    preview: "La formation React que vous avez dispensée à notre équipe s'est très bien déroulée...",
    date: "5 mars",
    unread: false,
    platform: "malt" as const,
    body: "Bonjour,\n\nLa formation React que vous avez dispensée à notre équipe de 8 développeurs s'est très bien déroulée. Tous ont obtenu leur certification.\n\nL'équipe est maintenant autonome sur React et Redux. La montée en compétences est remarquable.\n\nNous recommanderons vos services de formation.\n\nCordialement,\nSophie Bernard\nCTO - DevCorp",
    starred: false,
    urgency: 'low' as const,
    labels: ['formation', 'react', 'termine']
  },
  {
    id: "arch4",
    sender: "Thomas Rousseau",
    subject: "Maintenance annuelle - Contrat renouvelé",
    preview: "Le contrat de maintenance annuelle pour nos 3 sites web a été renouvelé...",
    date: "1 mars",
    unread: false,
    platform: "codeur" as const,
    body: "Bonjour,\n\nLe contrat de maintenance annuelle pour nos 3 sites web (site corporate, e-commerce et intranet) a été renouvelé pour 2024.\n\nVotre réactivité et la qualité de votre support nous donnent entière satisfaction. Aucun incident majeur en 2023.\n\nÀ bientôt pour une nouvelle année de collaboration,\nThomas Rousseau\nDirecteur IT - TechServices",
    starred: false,
    urgency: 'low' as const,
    labels: ['maintenance', 'contrat', 'renouvele']
  }
];

export default function Archives() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedMessage = mockArchivedMessages.find(message => message.id === selectedMessageId);
  
  const filteredMessages = mockArchivedMessages.filter(message =>
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dashboard>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Archive className="h-5 w-5 text-gray-500" />
              <h1 className="text-xl font-semibold">Archives</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les archives..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''} archivé{filteredMessages.length > 1 ? 's' : ''}
            </p>
          </div>
          {filteredMessages.length > 0 ? (
            <MessageList 
              messages={filteredMessages}
              onSelectMessage={(id) => setSelectedMessageId(id)}
              selectedMessageId={selectedMessageId}
            />
          ) : (
            <EmptyState type="no-archived" />
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