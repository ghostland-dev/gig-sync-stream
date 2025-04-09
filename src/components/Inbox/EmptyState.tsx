
import React from "react";
import { Inbox, SearchX } from "lucide-react";

interface EmptyStateProps {
  type: "no-message-selected" | "no-messages";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {type === "no-message-selected" ? (
        <>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Aucun message sélectionné</h3>
          <p className="text-muted-foreground max-w-md">
            Sélectionnez un message dans la liste pour afficher son contenu ici.
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Aucun message trouvé</h3>
          <p className="text-muted-foreground max-w-md">
            Aucun message ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </p>
        </>
      )}
    </div>
  );
};
