import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useReply } from "@/hooks/useReply";
import { useMessages } from "@/hooks/useMessages";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  FileText, 
  Search, 
  Trash2, 
  Edit, 
  Send,
  Clock,
  MessageSquare
} from "lucide-react";
import { EmptyState } from "@/components/Inbox/EmptyState";

export default function Drafts() {
  const [searchQuery, setSearchQuery] = useState("");
  const { getAllDrafts, deleteDraft, sendReply } = useReply();
  const { messages } = useMessages();
  const { toast } = useToast();

  const drafts = getAllDrafts();
  
  const filteredDrafts = drafts.filter(draft =>
    draft.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOriginalMessage = (messageId: string) => {
    return messages.find(m => m.id === messageId);
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    toast({
      title: "Brouillon supprimé",
      description: "Le brouillon a été supprimé définitivement"
    });
  };

  const handleSendDraft = async (draft: any) => {
    const result = await sendReply(draft.messageId, draft.content, draft.subject);
    
    if (result.success) {
      deleteDraft(draft.id);
      toast({
        title: "Message envoyé",
        description: "Votre brouillon a été envoyé avec succès"
      });
    } else {
      toast({
        title: "Erreur d'envoi",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <Dashboard>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brouillons</h1>
            <p className="text-muted-foreground">
              Gérez vos messages en cours de rédaction
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-4 w-4" />
            {drafts.length} brouillon{drafts.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {drafts.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les brouillons..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {filteredDrafts.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            {drafts.length === 0 ? (
              <EmptyState type="no-messages" />
            ) : (
              <div className="text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun brouillon trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun brouillon ne correspond à votre recherche
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDrafts.map((draft) => {
              const originalMessage = getOriginalMessage(draft.messageId);
              
              return (
                <Card key={draft.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{draft.subject}</CardTitle>
                        {originalMessage && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>En réponse à {originalMessage.sender}</span>
                            <Badge variant="outline" className={`platform-${originalMessage.platform} text-xs`}>
                              {originalMessage.platform}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(draft.sentAt), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm line-clamp-3 whitespace-pre-wrap">
                          {draft.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {draft.content.length} caractères
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Modifier
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleSendDraft(draft)}
                            className="gap-1"
                          >
                            <Send className="h-3 w-3" />
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Dashboard>
  );
}