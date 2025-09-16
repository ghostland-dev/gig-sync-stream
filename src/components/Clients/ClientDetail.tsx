import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformBadge } from '@/components/ui/PlatformBadge';
import { useClients, Client, Project } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  StarOff, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Linkedin,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientDetailProps {
  clientId: string;
  onEdit: () => void;
  onClose: () => void;
}

export const ClientDetail: React.FC<ClientDetailProps> = ({ clientId, onEdit, onClose }) => {
  const { getClient, getClientProjects, toggleClientStar, deleteClient } = useClients();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const client = getClient(clientId);
  const projects = getClientProjects(clientId);

  if (!client) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Client non trouvé</p>
          <Button onClick={onClose} className="mt-4">Retour</Button>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(clientId);
      toast({
        title: "Client supprimé",
        description: `${client.name} a été supprimé avec succès.`
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client.",
        variant: "destructive"
      });
    }
    setIsDeleting(false);
  };

  const handleToggleStar = () => {
    toggleClientStar(clientId);
    toast({
      title: client.starred ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `${client.name} ${client.starred ? 'retiré des' : 'ajouté aux'} favoris.`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.name} alt={client.name} />
                <AvatarFallback className="text-lg">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{client.name}</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleStar}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {client.starred ? (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <PlatformBadge platform={client.platform} />
                  <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                    {client.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                  {client.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Client depuis {formatDistanceToNow(new Date(client.createdAt), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button 
                onClick={handleDelete}
                variant="destructive" 
                size="sm"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                Fermer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{client.totalProjects}</div>
            <p className="text-sm text-muted-foreground">Projets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{client.totalRevenue.toLocaleString('fr-FR')}€</div>
            <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{client.averageRating.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-sm font-medium">
              {new Date(client.lastContact).toLocaleDateString('fr-FR')}
            </div>
            <p className="text-sm text-muted-foreground">Dernier contact</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="projects">Projets ({projects.length})</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{client.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{client.phone}</p>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                    </div>
                  </div>
                )}
              </div>
              
              {client.address && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">
                        {client.address.street}<br />
                        {client.address.city}, {client.address.zipCode}<br />
                        {client.address.country}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {client.social && Object.keys(client.social).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-3">Réseaux sociaux</p>
                    <div className="flex flex-wrap gap-2">
                      {client.social.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.social.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            Site web
                          </a>
                        </Button>
                      )}
                      {client.social.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={client.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Projets</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </div>
          
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 
                                   project.status === 'completed' ? 'secondary' : 'outline'}>
                        {project.status === 'active' ? 'En cours' :
                         project.status === 'completed' ? 'Terminé' :
                         project.status === 'cancelled' ? 'Annulé' : 'En pause'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{project.budget.toLocaleString('fr-FR')}€</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payé</p>
                        <p className="font-medium">{project.paidAmount.toLocaleString('fr-FR')}€</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Début</p>
                        <p className="font-medium">
                          {new Date(project.startDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Échéance</p>
                        <p className="font-medium">
                          {new Date(project.deadline).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun projet pour ce client</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{client.email}</p>
                    <p className="text-sm text-muted-foreground">Email principal</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${client.email}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contacter
                    </a>
                  </Button>
                </div>

                {client.phone && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{client.phone}</p>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${client.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Historique des communications</p>
                <p className="text-sm text-muted-foreground">
                  Dernier contact: {formatDistanceToNow(new Date(client.lastContact), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes et observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {client.notes || "Aucune note pour ce client."}
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier les notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};