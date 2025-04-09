
import React from "react";
import { Inbox, SearchX } from "lucide-react";

interface EmptyStateProps {
  type: "no-message-selected" | "no-messages";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50 rounded-lg">
      {type === "no-message-selected" ? (
        <>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse-subtle">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Aucun message sélectionné</h3>
          <p className="text-muted-foreground max-w-md">
            Sélectionnez un message dans la liste pour afficher son contenu ici.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 animate-pulse-subtle">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Aucun message trouvé</h3>
          <p className="text-muted-foreground max-w-md">
            Aucun message ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </p>
          <button className="mt-4 text-primary hover:underline">
            Effacer les filtres
          </button>
        </>
      )}
    </div>
  );
};
