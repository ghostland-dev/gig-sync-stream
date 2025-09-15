import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { useAuthContext } from './useAuth';

export interface Message {
  id: string;
  platform: 'fiverr' | 'upwork' | 'malt' | 'codeur';
  sender: string;
  senderEmail?: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  unread: boolean;
  starred: boolean;
  important: boolean;
  archived: boolean;
  deleted: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  labels: string[];
  projectBudget?: string;
  clientLocation?: string;
  urgency: 'low' | 'medium' | 'high';
  responseTime?: number; // in hours
}

// Mock messages with realistic freelance content
const generateMockMessages = (): Message[] => [
  {
    id: 'msg-1',
    platform: 'fiverr',
    sender: 'Sophie Martin',
    senderEmail: 'sophie.martin@gmail.com',
    subject: 'Projet de développement e-commerce urgente',
    preview: 'Bonjour, j\'ai besoin d\'un développeur expérimenté pour créer une boutique en ligne complète...',
    body: `Bonjour,

J'ai besoin d'un développeur expérimenté pour créer une boutique en ligne complète pour ma marque de vêtements éthiques.

**Détails du projet :**
- Site e-commerce avec panier
- Intégration Stripe/PayPal
- Gestion des stocks
- Interface d'administration
- Design responsive

**Budget :** 3000-4000€
**Délai :** 6 semaines

J'ai des maquettes Figma prêtes et une liste détaillée des fonctionnalités.

Êtes-vous disponible pour commencer rapidement ?

Cordialement,
Sophie Martin
Fondatrice - EcoVogue`,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread: true,
    starred: false,
    important: true,
    archived: false,
    deleted: false,
    labels: ['nouveau-client', 'e-commerce'],
    projectBudget: '3000-4000€',
    clientLocation: 'Paris, France',
    urgency: 'high'
  },
  {
    id: 'msg-2',
    platform: 'upwork',
    sender: 'TechCorp Inc.',
    senderEmail: 'projects@techcorp.com',
    subject: 'Long-term React Developer Position',
    preview: 'We are looking for a senior React developer for a 6-month contract...',
    body: `Hello,

We are looking for a senior React developer for a 6-month contract to work on our SaaS platform.

**Requirements:**
- 5+ years React experience
- TypeScript proficiency
- Experience with modern state management
- Knowledge of testing frameworks
- English proficiency required

**What we offer:**
- $80-100/hour
- Remote work
- Flexible schedule
- Potential for extension

The project involves rebuilding our dashboard interface and implementing new features.

Please share your portfolio and availability.

Best regards,
Mike Johnson
Technical Lead - TechCorp Inc.`,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    unread: true,
    starred: true,
    important: true,
    archived: false,
    deleted: false,
    labels: ['longue-durée', 'react'],
    projectBudget: '$80-100/h',
    clientLocation: 'Remote (US)',
    urgency: 'medium'
  },
  {
    id: 'msg-3',
    platform: 'malt',
    sender: 'Startup Innovation',
    subject: 'Mission UI/UX - Application mobile',
    preview: 'Nous recherchons un designer UI/UX pour notre application mobile innovante...',
    body: `Bonjour,

Nous recherchons un designer UI/UX talentueux pour notre application mobile innovante dans le secteur de la fintech.

**Mission :**
- Refonte complète de l'UX/UI
- Création de prototypes interactifs
- Design system complet
- Tests utilisateurs

**Profil recherché :**
- 3+ ans d'expérience mobile
- Maîtrise de Figma/Sketch
- Connaissance des guidelines iOS/Android
- Portfolio solide

**Budget :** 2500€
**Durée :** 4 semaines

Nous avons déjà une base utilisateurs de 10k+ utilisateurs et cherchons à améliorer significativement l'expérience.

Disponible pour un appel cette semaine ?

Cordialement,
Emma Dubois
Product Manager`,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    unread: false,
    starred: false,
    important: false,
    archived: false,
    deleted: false,
    labels: ['ui-ux', 'mobile'],
    projectBudget: '2500€',
    clientLocation: 'Lyon, France',
    urgency: 'medium'
  },
  {
    id: 'msg-4',
    platform: 'codeur',
    sender: 'Pierre Durand',
    subject: 'Développement API REST - Microservices',
    preview: 'Recherche développeur backend pour architecture microservices...',
    body: `Bonjour,

Je recherche un développeur backend expérimenté pour développer une architecture microservices complète.

**Contexte :**
Modernisation d'un système legacy vers une architecture cloud-native.

**Technologies souhaitées :**
- Node.js/Python
- Docker/Kubernetes
- AWS/GCP
- API REST/GraphQL
- Base de données NoSQL

**Livrables :**
- 5 microservices
- Documentation API
- Tests automatisés
- Configuration CI/CD

**Budget :** 5000-7000€
**Délai :** 8 semaines

C'est un projet stratégique pour notre scale-up.

Merci de partager votre expérience avec ce type d'architecture.

Cordialement,
Pierre Durand
CTO - ScaleUp Solutions`,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    unread: false,
    starred: true,
    important: false,
    archived: false,
    deleted: false,
    labels: ['backend', 'microservices'],
    projectBudget: '5000-7000€',
    clientLocation: 'Remote',
    urgency: 'medium'
  },
  {
    id: 'msg-5',
    platform: 'fiverr',
    sender: 'Maria Garcia',
    subject: 'Quick WordPress Fix Needed',
    preview: 'Hi, I need help fixing a plugin conflict on my WordPress site...',
    body: `Hi,

I need help fixing a plugin conflict on my WordPress site that's causing the checkout page to break.

**Issue:**
- WooCommerce checkout not working
- Plugin conflict suspected
- Site is live and losing sales

**Requirements:**
- WordPress expert
- Available today/tomorrow
- Experience with WooCommerce

**Budget:** $150-200
**Urgency:** ASAP

This is affecting my business directly so quick turnaround is essential.

Can you help?

Thanks,
Maria Garcia`,
    date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    unread: false,
    starred: false,
    important: false,
    archived: false,
    deleted: false,
    labels: ['wordpress', 'urgent'],
    projectBudget: '$150-200',
    clientLocation: 'Barcelona, Spain',
    urgency: 'high'
  },
  // Add more mock messages for variety
  {
    id: 'msg-6',
    platform: 'upwork',
    sender: 'Digital Agency Pro',
    subject: 'Laravel Developer - Multiple Projects',
    preview: 'We have multiple Laravel projects and need a reliable developer...',
    body: `Hello,

We are a digital agency with multiple Laravel projects and need a reliable developer for ongoing work.

**Projects include:**
- Custom CMS development
- API integrations
- E-commerce solutions
- Performance optimization

**Looking for:**
- Laravel 8+ experience
- MySQL/PostgreSQL
- Git workflow
- English communication

**Terms:**
- $40-60/hour
- 20-30 hours/week
- Long-term partnership

Strong candidates will have ongoing work opportunities.

Best,
Agency Team`,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    starred: false,
    important: false,
    archived: false,
    deleted: false,
    labels: ['laravel', 'longue-durée'],
    projectBudget: '$40-60/h',
    clientLocation: 'Remote',
    urgency: 'low'
  }
];

export const useMessages = () => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useLocalStorage<Message[]>('user-messages', []);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with mock data if empty
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages(generateMockMessages());
    }
  }, [user, messages.length, setMessages]);

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  const toggleStar = (messageId: string) => {
    updateMessage(messageId, { starred: !messages.find(m => m.id === messageId)?.starred });
  };

  const markAsRead = (messageId: string) => {
    updateMessage(messageId, { unread: false });
  };

  const markAsUnread = (messageId: string) => {
    updateMessage(messageId, { unread: true });
  };

  const archiveMessage = (messageId: string) => {
    updateMessage(messageId, { archived: true });
  };

  const deleteMessage = (messageId: string) => {
    updateMessage(messageId, { deleted: true });
  };

  const restoreMessage = (messageId: string) => {
    updateMessage(messageId, { deleted: false, archived: false });
  };

  const addLabel = (messageId: string, label: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && !message.labels.includes(label)) {
      updateMessage(messageId, { labels: [...message.labels, label] });
    }
  };

  const removeLabel = (messageId: string, label: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      updateMessage(messageId, { labels: message.labels.filter(l => l !== label) });
    }
  };

  // Filtered getters
  const getInboxMessages = () => messages.filter(m => !m.archived && !m.deleted);
  const getFavoriteMessages = () => messages.filter(m => m.starred && !m.deleted);
  const getPendingMessages = () => messages.filter(m => m.unread && !m.deleted);
  const getImportantMessages = () => messages.filter(m => m.important && !m.deleted);
  const getArchivedMessages = () => messages.filter(m => m.archived && !m.deleted);
  const getTrashedMessages = () => messages.filter(m => m.deleted);
  const getMessagesByPlatform = (platform: string) => 
    messages.filter(m => m.platform === platform && !m.deleted);

  const searchMessages = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return messages.filter(m => 
      !m.deleted && (
        m.sender.toLowerCase().includes(lowercaseQuery) ||
        m.subject.toLowerCase().includes(lowercaseQuery) ||
        m.body.toLowerCase().includes(lowercaseQuery) ||
        m.labels.some(label => label.toLowerCase().includes(lowercaseQuery))
      )
    );
  };

  // Simulate receiving new message
  const simulateNewMessage = () => {
    const platforms: Array<'fiverr' | 'upwork' | 'malt' | 'codeur'> = ['fiverr', 'upwork', 'malt', 'codeur'];
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      sender: 'Nouveau Client',
      subject: 'Nouveau projet intéressant',
      preview: 'Bonjour, j\'ai un projet qui pourrait vous intéresser...',
      body: 'Bonjour,\n\nJ\'ai vu votre profil et je pense que vous seriez parfait pour mon projet...',
      date: new Date().toISOString(),
      unread: true,
      starred: false,
      important: false,
      archived: false,
      deleted: false,
      labels: ['nouveau'],
      urgency: 'medium'
    };
    
    setMessages(prev => [newMessage, ...prev]);
    return newMessage;
  };

  return {
    messages,
    isLoading,
    updateMessage,
    toggleStar,
    markAsRead,
    markAsUnread,
    archiveMessage,
    deleteMessage,
    restoreMessage,
    addLabel,
    removeLabel,
    getInboxMessages,
    getFavoriteMessages,
    getPendingMessages,
    getImportantMessages,
    getArchivedMessages,
    getTrashedMessages,
    getMessagesByPlatform,
    searchMessages,
    simulateNewMessage
  };
};