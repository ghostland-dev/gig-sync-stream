
import React, { useState, useMemo } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Star, 
  StarOff,
  ArrowUpDown,
  AlertTriangle
} from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

// Mock data for clients
const mockClients = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    platform: "fiverr",
    projects: 3,
    status: "active",
    lastContact: "2025-04-05",
    starred: true,
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    platform: "upwork",
    projects: 2,
    status: "active",
    lastContact: "2025-04-03",
    starred: false,
  },
  {
    id: "3",
    name: "Pierre Dupont",
    email: "pierre.dupont@example.com",
    platform: "malt",
    projects: 1,
    status: "inactive",
    lastContact: "2025-03-22",
    starred: false,
  },
  {
    id: "4",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    platform: "codeur",
    projects: 4,
    status: "active",
    lastContact: "2025-04-08",
    starred: true,
  },
  {
    id: "5",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    platform: "fiverr",
    projects: 2,
    status: "active",
    lastContact: "2025-04-01",
    starred: false,
  },
  {
    id: "6",
    name: "Eva Müller",
    email: "eva.muller@example.com",
    platform: "upwork",
    projects: 5,
    status: "active",
    lastContact: "2025-04-06",
    starred: true,
  },
  {
    id: "7",
    name: "Thomas Bernard",
    email: "thomas.bernard@example.com",
    platform: "codeur",
    projects: 2,
    status: "inactive",
    lastContact: "2025-03-15",
    starred: false,
  },
  {
    id: "8",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    platform: "fiverr",
    projects: 1,
    status: "active",
    lastContact: "2025-04-02",
    starred: false,
  },
  {
    id: "9",
    name: "Lucas Wagner",
    email: "lucas.wagner@example.com",
    platform: "malt",
    projects: 3,
    status: "active",
    lastContact: "2025-04-04",
    starred: false,
  },
  {
    id: "10",
    name: "Emma Dubois",
    email: "emma.dubois@example.com",
    platform: "upwork",
    projects: 4,
    status: "active",
    lastContact: "2025-04-07",
    starred: true,
  },
  {
    id: "11",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    platform: "fiverr",
    projects: 2,
    status: "inactive",
    lastContact: "2025-03-25",
    starred: false,
  },
  {
    id: "12",
    name: "Julia Klein",
    email: "julia.klein@example.com",
    platform: "codeur",
    projects: 3,
    status: "active",
    lastContact: "2025-04-03",
    starred: false,
  },
];

export default function Clients() {
  const { toast } = useToast();
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    return clients.filter((client) => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage]);

  // Toggle star status for a client
  const toggleStarred = (clientId: string) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, starred: !client.starred } 
          : client
      )
    );
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      toast({
        title: client.starred ? "Retiré des favoris" : "Ajouté aux favoris",
        description: `${client.name} a été ${client.starred ? "retiré des" : "ajouté aux"} favoris.`,
        variant: client.starred ? "default" : "default",
      });
    }
  };

  return (
    <Dashboard>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground">Gérez vos clients à travers toutes les plateformes</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Ajouter un client
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <CardTitle>Liste des clients</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un client..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on new search
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2 text-left font-medium">
                      <div className="flex items-center gap-1">
                        <span>Client</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-2 text-left font-medium">
                      <div className="flex items-center gap-1">
                        <span>Plateforme</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-2 text-left font-medium">
                      <div className="flex items-center gap-1">
                        <span>Projets</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-2 text-left font-medium">
                      <div className="flex items-center gap-1">
                        <span>Statut</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-2 text-left font-medium">
                      <div className="flex items-center gap-1">
                        <span>Dernier contact</span>
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 px-2 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client) => (
                      <tr key={client.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-muted-foreground text-xs">{client.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <PlatformBadge platform={client.platform as any} />
                        </td>
                        <td className="py-3 px-2">{client.projects}</td>
                        <td className="py-3 px-2">
                          <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                            {client.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          {new Date(client.lastContact).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => toggleStarred(client.id)}
                            >
                              {client.starred ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                          <p>Aucun client ne correspond à votre recherche</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredClients.length > itemsPerPage && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#" 
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}
