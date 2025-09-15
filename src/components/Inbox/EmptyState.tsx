
import React from "react";
import { Inbox, SearchX, Star, Clock, AlertCircle, Archive, Trash2, AlertTriangle } from "lucide-react";

interface EmptyStateProps {
  type: 
    | "no-message-selected" 
    | "no-messages" 
    | "no-favorites" 
    | "no-pending" 
    | "no-important" 
    | "no-archived" 
    | "no-trash" 
    | "platform-not-found" 
    | "no-platform-messages";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case "no-message-selected":
        return {
          icon: <Inbox className="h-8 w-8 text-muted-foreground" />,
          title: "Aucun message sélectionné",
          description: "Sélectionnez un message dans la liste pour afficher son contenu ici."
        };
      
      case "no-messages":
        return {
          icon: <SearchX className="h-8 w-8 text-muted-foreground" />,
          title: "Aucun message trouvé",
          description: "Aucun message ne correspond à vos critères de recherche. Essayez de modifier vos filtres.",
          action: "Effacer les filtres"
        };
      
      case "no-favorites":
        return {
          icon: <Star className="h-8 w-8 text-yellow-500" />,
          title: "Aucun message favori",
          description: "Vous n'avez pas encore marqué de messages comme favoris. Cliquez sur l'étoile dans un message pour l'ajouter ici."
        };
      
      case "no-pending":
        return {
          icon: <Clock className="h-8 w-8 text-orange-500" />,
          title: "Aucun message en attente",
          description: "Parfait ! Vous n'avez aucun message nécessitant une action urgente de votre part."
        };
      
      case "no-important":
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          title: "Aucun message important",
          description: "Aucun message n'est actuellement marqué comme important. Les opportunités majeures apparaîtront ici."
        };
      
      case "no-archived":
        return {
          icon: <Archive className="h-8 w-8 text-gray-500" />,
          title: "Aucun message archivé",
          description: "Vos messages archivés apparaîtront ici. Archivez les conversations terminées pour garder votre boîte de réception organisée."
        };
      
      case "no-trash":
        return {
          icon: <Trash2 className="h-8 w-8 text-gray-500" />,
          title: "Corbeille vide",
          description: "Votre corbeille est vide. Les messages supprimés apparaissent ici pendant 30 jours avant d'être définitivement effacés."
        };
      
      case "platform-not-found":
        return {
          icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
          title: "Plateforme non trouvée",
          description: "Cette plateforme n'existe pas ou n'est pas encore configurée dans votre compte."
        };
      
      case "no-platform-messages":
        return {
          icon: <Inbox className="h-8 w-8 text-muted-foreground" />,
          title: "Aucun message sur cette plateforme",
          description: "Vous n'avez reçu aucun message sur cette plateforme pour le moment."
        };
      
      default:
        return {
          icon: <Inbox className="h-8 w-8 text-muted-foreground" />,
          title: "Aucun contenu",
          description: "Aucun contenu à afficher pour le moment."
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 rounded-lg">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse-subtle">
        {content.icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{content.title}</h3>
      <p className="text-muted-foreground max-w-md">
        {content.description}
      </p>
      {content.action && (
        <button className="mt-4 text-primary hover:underline">
          {content.action}
        </button>
      )}
    </div>
  );
};
