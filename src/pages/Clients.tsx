
import React from "react";
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
  ArrowUpDown 
} from "lucide-react";

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
];

export default function Clients() {
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
                  {mockClients.map((client) => (
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}
