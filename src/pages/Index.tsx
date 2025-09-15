
import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";
import { useMessages } from "@/hooks/useMessages";

const Index = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  
  const { getInboxMessages } = useMessages();
  const messages = getInboxMessages();

  const selectedMessage = selectedMessageId 
    ? messages.find(msg => msg.id === selectedMessageId) || null
    : null;
    
  // Handler pour la sélection des messages sur mobile
  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setIsMobileDetailView(true);
  };
  
  // Handler pour retourner à la liste sur mobile
  const handleBackToList = () => {
    setIsMobileDetailView(false);
  };

  return (
    <Dashboard>
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold">Boîte de réception</h1>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des messages (cachée sur mobile quand un message est affiché) */}
          <div className={`w-full md:w-1/3 lg:w-2/5 ${isMobileDetailView ? 'hidden md:block' : ''}`}>
            <MessageList 
              messages={messages} 
              selectedMessageId={selectedMessageId} 
              onSelectMessage={handleSelectMessage} 
            />
          </div>
          
          {/* Détail du message (visible sur mobile uniquement quand un message est sélectionné) */}
          <div className={`flex-1 ${!isMobileDetailView ? 'hidden md:block' : ''}`}>
            {selectedMessage ? (
              <MessageDetail 
                message={selectedMessage} 
                onBack={handleBackToList} 
              />
            ) : (
              <EmptyState type="no-message-selected" />
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
