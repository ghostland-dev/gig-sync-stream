
import React from "react";
import { ArrowLeft, Star, CornerDownLeft, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Avatar } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender: string;
  senderEmail?: string;
  subject: string;
  body: string;
  date: string;
  unread: boolean;
  platform: "fiverr" | "upwork" | "malt" | "codeur";
}

interface MessageDetailProps {
  message: Message | null;
  onBack: () => void;
}

export const MessageDetail: React.FC<MessageDetailProps> = ({ message, onBack }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold truncate">{message.subject}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Marquer comme non lu</DropdownMenuItem>
              <DropdownMenuItem>Archiver</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Message details */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <div className="bg-muted h-full w-full flex items-center justify-center text-foreground font-medium">
                {message.sender.charAt(0)}
              </div>
            </Avatar>
            <div>
              <div className="font-medium">{message.sender}</div>
              <div className="text-sm text-muted-foreground">
                {message.senderEmail || `via ${message.platform}`}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-sm text-muted-foreground">{message.date}</div>
            <PlatformBadge platform={message.platform} />
          </div>
        </div>
      </div>

      {/* Message body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none">
          {message.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Reply section */}
      <div className="p-4 border-t">
        <Button className="gap-2">
          <CornerDownLeft className="h-4 w-4" />
          Répondre
        </Button>
      </div>
    </div>
  );
};
