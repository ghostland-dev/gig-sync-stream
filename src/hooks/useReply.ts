import { useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { useAuthContext } from './useAuth';

export interface Reply {
  id: string;
  messageId: string;
  content: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'draft' | 'scheduled';
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'devis' | 'questions' | 'suivi' | 'refus' | 'general';
  platform?: 'fiverr' | 'upwork' | 'malt' | 'codeur';
}

// Default templates
const getDefaultTemplates = (): Template[] => [
  {
    id: 'template-1',
    name: 'Demande d\'informations',
    subject: 'Re: {original_subject}',
    category: 'questions',
    content: `Bonjour {client_name},

Merci pour votre message concernant votre projet.

J'aurais besoin de quelques informations supplémentaires pour vous établir un devis précis :

• Quel est le délai souhaité pour ce projet ?
• Avez-vous des exemples ou références visuelles ?
• Quel est votre budget approximatif ?
• Y a-t-il des fonctionnalités spécifiques requises ?

Je reste à votre disposition pour discuter plus en détail de votre projet.

Cordialement,
{my_name}`
  },
  {
    id: 'template-2',
    name: 'Proposition de devis',
    subject: 'Proposition pour votre projet - {original_subject}',
    category: 'devis',
    content: `Bonjour {client_name},

Suite à votre demande, je suis ravi de vous proposer mes services pour votre projet.

**Résumé du projet :**
{project_summary}

**Prestations incluses :**
• {service_1}
• {service_2}
• {service_3}

**Budget :** {budget}
**Délai :** {timeline}

Cette proposition inclut :
- Développement complet selon vos spécifications
- Tests et corrections
- Livraison du code source
- Support de 30 jours post-livraison

N'hésitez pas si vous avez des questions ou souhaitez ajuster certains points.

Cordialement,
{my_name}`
  },
  {
    id: 'template-3',
    name: 'Suivi de projet',
    subject: 'Point d\'avancement - {original_subject}',
    category: 'suivi',
    content: `Bonjour {client_name},

J'espère que vous allez bien.

Je souhaitais faire un point sur l'avancement de votre projet :

**Réalisé :**
• {completed_task_1}
• {completed_task_2}

**En cours :**
• {current_task}

**Prochaines étapes :**
• {next_task_1}
• {next_task_2}

Le projet avance bien et respecte le planning prévu. La livraison est toujours prévue pour le {delivery_date}.

Avez-vous des questions ou retours à ce stade ?

Cordialement,
{my_name}`
  },
  {
    id: 'template-4',
    name: 'Refus poli',
    subject: 'Re: {original_subject}',
    category: 'refus',
    content: `Bonjour {client_name},

Merci pour votre confiance et votre intérêt pour mes services.

Malheureusement, je ne pourrai pas prendre en charge votre projet car :
{reason}

Cependant, je peux vous recommander {recommendation} qui pourrait parfaitement répondre à vos besoins.

Je vous souhaite bonne chance pour votre projet.

Cordialement,
{my_name}`
  },
  {
    id: 'template-5',
    name: 'Question technique - Fiverr',
    subject: 'Clarifications techniques - {original_subject}',
    category: 'questions',
    platform: 'fiverr',
    content: `Hi {client_name},

Thank you for your message about your project.

To provide you with the best possible service, I need some technical clarifications:

• What technologies are you currently using?
• Do you have any existing codebase or starting from scratch?
• Are there any specific integrations required?
• What's your preferred timeline for completion?

I'm confident I can deliver exactly what you need once I have these details.

Looking forward to working with you!

Best regards,
{my_name}`
  }
];

export const useReply = () => {
  const { user } = useAuthContext();
  const [replies, setReplies] = useLocalStorage<Reply[]>('user-replies', []);
  const [templates, setTemplates] = useLocalStorage<Template[]>('reply-templates', getDefaultTemplates());
  const [isLoading, setIsLoading] = useState(false);

  const sendReply = async (messageId: string, content: string, subject: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      messageId,
      content,
      subject,
      sentAt: new Date().toISOString(),
      status: 'sent',
      attachments: []
    };
    
    setReplies(prev => [newReply, ...prev]);
    setIsLoading(false);
    
    return { success: true };
  };

  const saveDraft = (messageId: string, content: string, subject: string): string => {
    const draftId = `draft-${Date.now()}`;
    const draft: Reply = {
      id: draftId,
      messageId,
      content,
      subject,
      sentAt: new Date().toISOString(),
      status: 'draft',
      attachments: []
    };
    
    setReplies(prev => {
      // Remove existing draft for this message if any
      const filtered = prev.filter(r => !(r.messageId === messageId && r.status === 'draft'));
      return [draft, ...filtered];
    });
    
    return draftId;
  };

  const getDraft = (messageId: string): Reply | null => {
    return replies.find(r => r.messageId === messageId && r.status === 'draft') || null;
  };

  const deleteDraft = (draftId: string) => {
    setReplies(prev => prev.filter(r => r.id !== draftId));
  };

  const getRepliesForMessage = (messageId: string): Reply[] => {
    return replies.filter(r => r.messageId === messageId && r.status === 'sent');
  };

  const getAllDrafts = (): Reply[] => {
    return replies.filter(r => r.status === 'draft');
  };

  const createTemplate = (template: Omit<Template, 'id'>): Template => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
    return newTemplate;
  };

  const updateTemplate = (templateId: string, updates: Partial<Template>) => {
    setTemplates(prev => 
      prev.map(t => t.id === templateId ? { ...t, ...updates } : t)
    );
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const applyTemplate = (template: Template, variables: Record<string, string>): { subject: string; content: string } => {
    let processedSubject = template.subject;
    let processedContent = template.content;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return {
      subject: processedSubject,
      content: processedContent
    };
  };

  const getTemplatesByCategory = (category: Template['category']): Template[] => {
    return templates.filter(t => t.category === category);
  };

  const getTemplatesByPlatform = (platform: string): Template[] => {
    return templates.filter(t => !t.platform || t.platform === platform);
  };

  return {
    replies,
    templates,
    isLoading,
    sendReply,
    saveDraft,
    getDraft,
    deleteDraft,
    getRepliesForMessage,
    getAllDrafts,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    getTemplatesByCategory,
    getTemplatesByPlatform
  };
};