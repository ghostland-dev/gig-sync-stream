import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { Star } from "lucide-react";

const mockFavoriteMessages = [
  {
    id: "fav1",
    sender: "Alice Smith",
    subject: "Développement d'une application mobile",
    preview: "Salut, j'ai besoin d'un développeur pour une application mobile native...",
    date: "Hier",
    unread: false,
    platform: "upwork" as const,
    body: "Salut,\n\nJ'ai besoin d'un développeur pour une application mobile native pour iOS et Android. L'application permettra aux utilisateurs de suivre leurs habitudes quotidiennes et de recevoir des rappels.\n\nAvez-vous de l'expérience dans ce domaine? Quel serait votre tarif pour ce projet?\n\nMerci,\nAlice Smith"
  },
  {
    id: "fav2", 
    sender: "Marc Rousseau",
    subject: "Projet e-commerce avec React",
    preview: "Bonjour, je recherche un développeur React expérimenté pour créer une boutique en ligne...",
    date: "2 jours",
    unread: true,
    platform: "malt" as const,
    body: "Bonjour,\n\nJe recherche un développeur React expérimenté pour créer une boutique en ligne moderne avec panier, paiement en ligne et gestion des stocks.\n\nLe projet est bien défini avec des maquettes complètes. Budget : 5000€\n\nÊtes-vous disponible pour commencer rapidement?\n\nCordialement,\nMarc Rousseau"
  }
];

export default function Favorites() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const selectedMessage = mockFavoriteMessages.find(message => message.id === selectedMessageId);

  return (
    <Dashboard>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <h1 className="text-xl font-semibold">Messages favoris</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {mockFavoriteMessages.length} message{mockFavoriteMessages.length > 1 ? 's' : ''} marqué{mockFavoriteMessages.length > 1 ? 's' : ''} comme favori{mockFavoriteMessages.length > 1 ? 's' : ''}
            </p>
          </div>
          {mockFavoriteMessages.length > 0 ? (
            <MessageList 
              messages={mockFavoriteMessages}
              onSelectMessage={(id) => setSelectedMessageId(id)}
              selectedMessageId={selectedMessageId}
            />
          ) : (
            <EmptyState type="no-favorites" />
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