
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/ui/PlatformBadge";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  platform: "fiverr" | "upwork" | "malt" | "codeur";
}

interface MessageListProps {
  messages: Message[];
  selectedMessageId: string | null;
  onSelectMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
}) => {
  return (
    <div className="flex flex-col h-full border-r">
      {/* Search bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des messages..."
            className="pl-9 py-2"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-2 border-b flex items-center justify-between">
        <div className="text-sm font-medium">Tous les messages ({messages.length})</div>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <Filter className="h-4 w-4" />
          <span className="text-xs">Filtrer</span>
        </Button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isSelected={message.id === selectedMessageId}
            onClick={() => onSelectMessage(message.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface MessageItemProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isSelected,
  onClick,
}) => {
  const itemClasses = `p-4 cursor-pointer message-list-item ${
    message.unread ? "unread" : ""
  } ${isSelected ? "selected" : ""} platform-${message.platform}`;

  return (
    <div className={itemClasses} onClick={onClick}>
      <div className="flex justify-between mb-1">
        <div className="font-medium truncate">{message.sender}</div>
        <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
          {message.date}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <PlatformBadge platform={message.platform} className="text-xs px-1.5 py-0" />
        <div className="text-sm font-medium truncate">{message.subject}</div>
      </div>
      <div className="text-sm text-muted-foreground line-clamp-1">
        {message.preview}
      </div>
    </div>
  );
};
