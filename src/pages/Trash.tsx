import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockTrashedMessages = [
  {
    id: "trash1",
    sender: "Spam Bot",
    subject: "Offre exceptionnelle ! Gagnez de l'argent rapidement !",
    preview: "Cliquez ici pour découvrir cette offre incroyable qui va changer votre vie...",
    date: "Il y a 1h",
    unread: false,
    platform: "fiverr" as const,
    body: "Cliquez ici pour découvrir cette offre incroyable qui va changer votre vie... [Message spam supprimé]"
  },
  {
    id: "trash2",
    sender: "Client Difficile",
    subject: "Révisions infinies - Annulation du projet",
    preview: "Encore des modifications à apporter. Ce n'est toujours pas ce que je veux...",
    date: "Hier",
    unread: false,
    platform: "upwork" as const,
    body: "Encore des modifications à apporter. Ce n'est toujours pas ce que je veux. Je pense qu'on devrait tout recommencer...\n\n[Message supprimé - Client problématique]"
  }
];

export default function Trash() {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const selectedMessage = mockTrashedMessages.find(message => message.id === selectedMessageId);

  const handleEmptyTrash = () => {
    // Logique pour vider la corbeille
    console.log("Vider la corbeille");
  };

  const handleRestoreMessage = (messageId: string) => {
    // Logique pour restaurer un message
    console.log("Restaurer le message:", messageId);
  };

  return (
    <Dashboard>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/3 border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="h-5 w-5 text-gray-500" />
              <h1 className="text-xl font-semibold">Corbeille</h1>
            </div>
            
            {mockTrashedMessages.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Suppression automatique
                  </span>
                </div>
                <p className="text-xs text-yellow-700">
                  Les messages sont supprimés définitivement après 30 jours
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-gray-600">
                {mockTrashedMessages.length} message{mockTrashedMessages.length > 1 ? 's' : ''}
              </Badge>
              {mockTrashedMessages.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEmptyTrash}
                  className="text-destructive hover:text-destructive"
                >
                  Vider la corbeille
                </Button>
              )}
            </div>
          </div>
          
          {mockTrashedMessages.length > 0 ? (
            <MessageList 
              messages={mockTrashedMessages}
              onSelectMessage={(id) => setSelectedMessageId(id)}
              selectedMessageId={selectedMessageId}
            />
          ) : (
            <EmptyState type="no-trash" />
          )}
        </div>
        
        <div className="w-full md:w-2/3 overflow-y-auto bg-background">
          {selectedMessage ? (
            <div>
              <div className="p-4 border-b border-border bg-yellow-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Ce message est dans la corbeille</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestoreMessage(selectedMessage.id)}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurer
                  </Button>
                </div>
              </div>
              <MessageDetail message={selectedMessage} onBack={() => setSelectedMessageId(null)} />
            </div>
          ) : (
            <EmptyState type="no-message-selected" />
          )}
        </div>
      </div>
    </Dashboard>
  );
}