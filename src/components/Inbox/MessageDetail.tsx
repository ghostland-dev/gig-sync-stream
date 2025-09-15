import React, { useState } from "react";
import { ArrowLeft, Star, Archive, Trash2, Reply, MoreHorizontal, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReplyComposer } from "@/components/Messages/ReplyComposer";
import { ReplyHistory } from "@/components/Messages/ReplyHistory";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender: string;
  senderEmail?: string;
  subject: string;
  body: string;
  date: string;
  unread: boolean;
  starred: boolean;
  platform: "fiverr" | "upwork" | "malt" | "codeur";
  projectBudget?: string;
  clientLocation?: string;
  urgency: 'low' | 'medium' | 'high';
  labels: string[];
}

interface MessageDetailProps {
  message: Message;
  onBack: () => void;
}

export const MessageDetail: React.FC<MessageDetailProps> = ({ message, onBack }) => {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const { toggleStar, markAsRead, archiveMessage, deleteMessage } = useMessages();
  const { toast } = useToast();

  // Mark as read when opening message
  React.useEffect(() => {
    if (message.unread) {
      markAsRead(message.id);
    }
  }, [message.id, message.unread, markAsRead]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleStar = () => {
    toggleStar(message.id);
    toast({
      title: message.starred ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `Message ${message.starred ? 'retiré des' : 'ajouté aux'} favoris`
    });
  };

  const handleArchive = () => {
    archiveMessage(message.id);
    toast({
      title: "Message archivé",
      description: "Le message a été déplacé vers les archives"
    });
    onBack();
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    toast({
      title: "Message supprimé",
      description: "Le message a été déplacé vers la corbeille"
    });
    onBack();
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">{message.sender}</h1>
              <p className="text-sm text-muted-foreground">
                {message.senderEmail || `Contact via ${message.platform}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStar}
              className={message.starred ? "text-yellow-500" : ""}
            >
              <Star className={`h-4 w-4 ${message.starred ? "fill-current" : ""}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowReplyComposer(true)}
              className="text-primary"
            >
              <Reply className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archiver
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="message" className="h-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 px-4">
              <TabsTrigger value="message">Message</TabsTrigger>
              <TabsTrigger value="replies">Réponses</TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="p-0 mt-0">
              <div className="p-6 space-y-6">
                {/* Message metadata */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={message.platform} />
                        <Badge variant={getUrgencyColor(message.urgency)} className="gap-1">
                          {getUrgencyIcon(message.urgency)}
                          {message.urgency === 'high' ? 'Urgent' : 
                           message.urgency === 'medium' ? 'Normal' : 'Faible'}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(message.date), { addSuffix: true, locale: fr })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {message.projectBudget && (
                        <div>
                          <span className="font-medium">Budget: </span>
                          <span className="text-green-600 font-semibold">{message.projectBudget}</span>
                        </div>
                      )}
                      {message.clientLocation && (
                        <div>
                          <span className="font-medium">Localisation: </span>
                          <span>{message.clientLocation}</span>
                        </div>
                      )}
                    </div>

                    {message.labels.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Labels:</div>
                        <div className="flex flex-wrap gap-1">
                          {message.labels.map((label) => (
                            <Badge key={label} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Subject */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">{message.subject}</h2>
                  <Separator />
                </div>

                {/* Message body */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.body}
                  </div>
                </div>

                {/* Quick reply button */}
                <div className="flex justify-center pt-6">
                  <Button 
                    onClick={() => setShowReplyComposer(true)}
                    className="gap-2"
                    size="lg"
                  >
                    <Reply className="h-4 w-4" />
                    Répondre au message
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="replies" className="p-0 mt-0">
              <div className="p-6">
                <ReplyHistory messageId={message.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Reply composer modal */}
      {showReplyComposer && (
        <ReplyComposer
          message={message}
          onClose={() => setShowReplyComposer(false)}
          onSent={() => {
            setShowReplyComposer(false);
            toast({
              title: "Réponse envoyée",
              description: "Votre message a été envoyé avec succès"
            });
          }}
        />
      )}
    </>
  );
};