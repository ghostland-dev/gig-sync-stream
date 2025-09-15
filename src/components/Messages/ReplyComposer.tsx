import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading';
import { useReply, Template } from '@/hooks/useReply';
import { useAuthContext } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Save, 
  FileText, 
  X, 
  Plus,
  Clock,
  Sparkles,
  Copy,
  MessageSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Message {
  id: string;
  platform: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  sender: string;
  subject: string;
  body: string;
}

interface ReplyComposerProps {
  message: Message;
  onClose: () => void;
  onSent?: () => void;
}

export const ReplyComposer: React.FC<ReplyComposerProps> = ({ 
  message, 
  onClose, 
  onSent 
}) => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const {
    sendReply,
    saveDraft,
    getDraft,
    deleteDraft,
    templates,
    applyTemplate,
    getTemplatesByPlatform,
    isLoading
  } = useReply();

  const [subject, setSubject] = useState(`Re: ${message.subject}`);
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft(message.id);
    if (draft) {
      setSubject(draft.subject);
      setContent(draft.content);
      setIsDraftSaved(true);
    }
  }, [message.id, getDraft]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (content.trim() || subject !== `Re: ${message.subject}`) {
      const timer = setTimeout(() => {
        handleSaveDraft();
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [content, subject]);

  const handleSend = async () => {
    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Le message ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    const result = await sendReply(message.id, content, subject);
    
    if (result.success) {
      toast({
        title: "Message envoyé",
        description: "Votre réponse a été envoyée avec succès",
      });
      
      // Delete draft if exists
      const draft = getDraft(message.id);
      if (draft) {
        deleteDraft(draft.id);
      }
      
      onSent?.();
      onClose();
    } else {
      toast({
        title: "Erreur d'envoi",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleSaveDraft = () => {
    if (content.trim() || subject !== `Re: ${message.subject}`) {
      saveDraft(message.id, content, subject);
      setIsDraftSaved(true);
      toast({
        title: "Brouillon sauvegardé",
        description: "Votre message a été sauvegardé en brouillon",
      });
    }
  };

  const handleApplyTemplate = (template: Template) => {
    const variables = {
      client_name: message.sender,
      original_subject: message.subject,
      my_name: `${user?.firstName} ${user?.lastName}`,
      project_summary: "À compléter selon le projet",
      service_1: "Service à définir",
      service_2: "Service à définir", 
      service_3: "Service à définir",
      budget: "À définir",
      timeline: "À définir",
      delivery_date: "À définir",
      reason: "planning complet actuellement",
      recommendation: "un autre freelancer qualifié",
      completed_task_1: "Tâche complétée",
      completed_task_2: "Tâche complétée",
      current_task: "Tâche en cours",
      next_task_1: "Prochaine tâche",
      next_task_2: "Prochaine tâche"
    };

    const processed = applyTemplate(template, variables);
    setSubject(processed.subject);
    setContent(processed.content);
    setSelectedTemplate(template);
    setShowTemplates(false);
    setIsDraftSaved(false);
  };

  const platformTemplates = getTemplatesByPlatform(message.platform);

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Répondre à {message.sender}
          </DialogTitle>
          <DialogDescription>
            Message reçu sur {message.platform} - Rédigez votre réponse
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original message preview */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`platform-${message.platform}`}>
                    {message.platform}
                  </Badge>
                  <span className="text-sm font-medium">{message.sender}</span>
                </div>
                <span className="text-xs text-muted-foreground">Message original</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <h4 className="font-medium mb-2">{message.subject}</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {message.body}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Rédiger</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-4">
              {/* Subject field */}
              <div className="space-y-2">
                <Label htmlFor="subject">Objet</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setIsDraftSaved(false);
                  }}
                  placeholder="Objet du message"
                />
              </div>

              {/* Message content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Message</Label>
                  <div className="flex items-center gap-2">
                    {isDraftSaved && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Brouillon sauvegardé
                      </Badge>
                    )}
                    {selectedTemplate && (
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {selectedTemplate.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setIsDraftSaved(false);
                  }}
                  placeholder="Rédigez votre message ici..."
                  className="min-h-[300px] resize-none"
                />
              </div>

              {/* Quick templates */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(true)}
                  className="gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Templates
                </Button>
                
                {platformTemplates.slice(0, 3).map((template) => (
                  <Button
                    key={template.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApplyTemplate(template)}
                    className="gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Templates disponibles</h3>
                  <Badge variant="secondary">
                    {platformTemplates.length} templates
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {platformTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {template.category}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(template.content);
                              toast({
                                title: "Copié",
                                description: "Template copié dans le presse-papiers"
                              });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.content.split('\n')[0]}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="gap-2"
                disabled={!content.trim() && subject === `Re: ${message.subject}`}
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading || !content.trim()}
                className="gap-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};