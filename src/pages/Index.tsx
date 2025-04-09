
import React, { useState } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { MessageList } from "@/components/Inbox/MessageList";
import { MessageDetail } from "@/components/Inbox/MessageDetail";
import { EmptyState } from "@/components/Inbox/EmptyState";

// Données factices pour la démo
const mockMessages = [
  {
    id: "1",
    sender: "Marie Leclerc",
    subject: "Projet de développement web",
    preview: "Bonjour, j'ai vu votre profil et je suis intéressée par vos services pour développer un site e-commerce...",
    date: "10:30",
    unread: true,
    platform: "fiverr" as const,
    body: "Bonjour,\n\nJ'ai vu votre profil et je suis intéressée par vos services pour développer un site e-commerce pour ma boutique de vêtements.\n\nMon budget est d'environ 2000€ et j'aimerais lancer le site dans les 2 mois. Pourriez-vous me faire une proposition?\n\nMerci d'avance,\nMarie"
  },
  {
    id: "2",
    sender: "Antoine Dubois",
    subject: "Demande de devis pour application mobile",
    preview: "Bonjour, nous sommes une startup dans le secteur de la santé et recherchons un développeur capable de...",
    date: "Hier",
    unread: true,
    platform: "upwork" as const,
    body: "Bonjour,\n\nNous sommes une startup dans le secteur de la santé et recherchons un développeur capable de créer une application mobile cross-platform.\n\nL'application permettrait aux utilisateurs de suivre leur activité physique et d'obtenir des conseils personnalisés.\n\nSeriez-vous disponible pour discuter de ce projet plus en détail?\n\nCordialement,\nAntoine Dubois\nCEO, HealthTrack"
  },
  {
    id: "3",
    sender: "Sophie Martin",
    subject: "Mission freelance UI/UX",
    preview: "Bonjour, je recherche un designer UI/UX pour refondre l'interface de notre application...",
    date: "Hier",
    unread: true,
    platform: "malt" as const,
    body: "Bonjour,\n\nJe recherche un designer UI/UX pour refondre l'interface de notre application de gestion financière.\n\nNous avons déjà une application fonctionnelle mais l'expérience utilisateur n'est pas optimale, et nous souhaitons moderniser l'interface.\n\nLe projet serait à réaliser sur 3-4 semaines. Êtes-vous disponible pour en discuter?\n\nMeilleures salutations,\nSophie Martin\nDirectrice Produit"
  },
  {
    id: "4",
    sender: "Thomas Bernard",
    subject: "Développement plugin WordPress",
    preview: "Bonjour, je cherche un expert WordPress pour développer un plugin personnalisé pour notre site...",
    date: "Lun.",
    unread: false,
    platform: "codeur" as const,
    body: "Bonjour,\n\nJe cherche un expert WordPress pour développer un plugin personnalisé pour notre site d'actualités.\n\nNous avons besoin d'un système permettant aux utilisateurs de sauvegarder des articles et de recevoir des notifications personnalisées.\n\nPouvez-vous me donner une estimation du coût et du délai pour un tel projet?\n\nCordialement,\nThomas Bernard\nRédacteur en chef, ActuPlus"
  },
  {
    id: "5",
    sender: "Laura Petit",
    subject: "Intégration API de paiement",
    preview: "Nous avons besoin d'intégrer plusieurs solutions de paiement à notre plateforme existante...",
    date: "Dim.",
    unread: false,
    platform: "upwork" as const,
    body: "Bonjour,\n\nNous avons besoin d'intégrer plusieurs solutions de paiement à notre plateforme existante (Stripe, PayPal et Apple Pay).\n\nNotre site est développé en React avec un backend Node.js. Nous recherchons quelqu'un ayant de l'expérience avec ces technologies et les API de paiement.\n\nPourriez-vous nous indiquer votre expérience dans ce domaine et vos disponibilités?\n\nBien cordialement,\nLaura Petit\nCTO, ShopEasy"
  },
  {
    id: "6",
    sender: "Lucas Moreau",
    subject: "Traduction site web",
    preview: "Bonjour, je cherche un traducteur technique pour traduire notre site web en anglais et en espagnol...",
    date: "28 mars",
    unread: false,
    platform: "fiverr" as const,
    body: "Bonjour,\n\nJe cherche un traducteur technique pour traduire notre site web en anglais et en espagnol.\n\nNotre site présente des solutions logicielles B2B assez techniques, donc une connaissance du vocabulaire informatique est nécessaire.\n\nLe site contient environ 20 pages. Pourriez-vous me faire une proposition avec vos tarifs et délais?\n\nMerci,\nLucas Moreau\nResponsable Marketing"
  },
  {
    id: "7",
    sender: "Julie Lambert",
    subject: "Rédaction fiches produits",
    preview: "Nous lançons une nouvelle gamme de produits écologiques et cherchons un rédacteur web pour...",
    date: "25 mars",
    unread: false,
    platform: "malt" as const,
    body: "Bonjour,\n\nNous lançons une nouvelle gamme de produits écologiques et cherchons un rédacteur web pour créer des fiches produits engageantes et SEO-friendly.\n\nIl y aurait environ 30 fiches à rédiger, avec un ton à la fois informatif et commercial.\n\nAvez-vous de l'expérience dans la rédaction pour le secteur écologique/durable?\n\nBien à vous,\nJulie Lambert\nFondatrice, EcoVie"
  },
  {
    id: "8",
    sender: "Pierre Durand",
    subject: "Création logo et identité visuelle",
    preview: "Bonjour, je lance ma société de conseil en stratégie et je recherche un designer pour créer mon identité visuelle...",
    date: "22 mars",
    unread: false,
    platform: "codeur" as const,
    body: "Bonjour,\n\nJe lance ma société de conseil en stratégie et je recherche un designer pour créer mon identité visuelle complète (logo, carte de visite, en-tête, etc.).\n\nJe souhaite une identité moderne et professionnelle qui inspire confiance. Mes couleurs préférées sont le bleu foncé et le gris.\n\nPouvez-vous me montrer des exemples de vos réalisations dans ce domaine?\n\nCordialement,\nPierre Durand\nStratège Consultant"
  }
];

const Index = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const selectedMessage = selectedMessageId 
    ? mockMessages.find(msg => msg.id === selectedMessageId) || null
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
              messages={mockMessages} 
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
