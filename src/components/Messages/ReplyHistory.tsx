import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useReply } from '@/hooks/useReply';
import { useAuthContext } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  Send,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReplyHistoryProps {
  messageId: string;
}

export const ReplyHistory: React.FC<ReplyHistoryProps> = ({ messageId }) => {
  const { user } = useAuthContext();
  const { getRepliesForMessage, getDraft } = useReply();
  const { toast } = useToast();
  
  const replies = getRepliesForMessage(messageId);
  const draft = getDraft(messageId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Le contenu a été copié dans le presse-papiers"
    });
  };

  if (replies.length === 0 && !draft) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Aucune réponse envoyée</h3>
          <p className="text-sm text-muted-foreground">
            Vos réponses à ce message apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Historique des réponses</h3>
        <Badge variant="secondary">
          {replies.length} envoyée{replies.length > 1 ? 's' : ''}
          {draft && ' + 1 brouillon'}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Draft if exists */}
        {draft && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-900">Brouillon</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(draft.content)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
                    {formatDistanceToNow(new Date(draft.sentAt), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Objet: </span>
                  <span className="text-muted-foreground">{draft.subject}</span>
                </div>
                <Separator />
                <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                  {draft.content}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sent replies */}
        {replies.map((reply, index) => (
          <Card key={reply.id} className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">
                    Réponse #{replies.length - index}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(reply.content)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                    {formatDistanceToNow(new Date(reply.sentAt), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Objet: </span>
                  <span className="text-muted-foreground">{reply.subject}</span>
                </div>
                <Separator />
                <div className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                  {reply.content}
                </div>
                
                {reply.attachments.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-medium mb-2">Pièces jointes:</div>
                    <div className="flex flex-wrap gap-2">
                      {reply.attachments.map((attachment) => (
                        <Badge key={attachment.id} variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {attachment.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};