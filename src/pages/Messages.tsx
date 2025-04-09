
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
    platform: "fiverr",
    sender: "John Doe",
    subject: "Projet de site web e-commerce",
    content: "Bonjour, je suis intéressé par vos services pour créer un site e-commerce...",
    date: "2025-04-08T14:30:00",
    unread: true,
    starred: false,
  },
  {
    id: "2",
    platform: "upwork",
    sender: "Alice Smith",
    subject: "Développement d'une application mobile",
    content: "Salut, j'ai besoin d'un développeur pour une application mobile native...",
    date: "2025-04-07T09:15:00",
    unread: false,
    starred: true,
  },
  {
    id: "3",
    platform: "malt",
    sender: "Pierre Dupont",
    subject: "Refonte de site WordPress",
    content: "Bonjour, je cherche un expert WordPress pour refaire mon site vitrine...",
    date: "2025-04-06T16:45:00",
    unread: true,
    starred: false,
  },
  {
    id: "4",
    platform: "codeur",
    sender: "Marie Martin",
    subject: "Intégration HTML/CSS",
    content: "Bonjour, j'ai des maquettes Figma à intégrer en HTML/CSS responsive...",
    date: "2025-04-05T11:20:00",
    unread: false,
    starred: false,
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
            <MessageDetail message={selectedMessage} />
          ) : (
            <EmptyState type="no-message-selected" />
          )}
        </div>
      </div>
    </Dashboard>
  );
}
