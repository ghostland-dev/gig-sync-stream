
import React from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, BellRing, Shield, Key, Globe, BellOff } from "lucide-react";

export default function Settings() {
  return (
    <Dashboard>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">Gérez les paramètres de votre compte et vos préférences</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
            <TabsTrigger value="account" className="flex gap-2 items-center justify-center">
              <User className="h-4 w-4" /> <span className="hidden md:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center justify-center">
              <BellRing className="h-4 w-4" /> <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2 items-center justify-center">
              <Shield className="h-4 w-4" /> <span className="hidden md:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex gap-2 items-center justify-center">
              <Globe className="h-4 w-4" /> <span className="hidden md:inline">Intégrations</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" defaultValue="Jean" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" defaultValue="Dupont" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences</CardTitle>
                <CardDescription>Configurez vos préférences d'interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">Activer le thème sombre</p>
                  </div>
                  <Switch id="darkMode" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRefresh">Actualisation automatique</Label>
                    <p className="text-sm text-muted-foreground">Actualiser les messages toutes les 5 minutes</p>
                  </div>
                  <Switch id="autoRefresh" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <p className="text-sm text-muted-foreground">Langue de l'interface</p>
                  </div>
                  <select id="language" className="border p-2 rounded bg-background">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Gérez vos préférences de notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifs">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des emails pour les nouveaux messages</p>
                  </div>
                  <Switch id="emailNotifs" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browserNotifs">Notifications du navigateur</Label>
                    <p className="text-sm text-muted-foreground">Afficher des notifications dans le navigateur</p>
                  </div>
                  <Switch id="browserNotifs" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="soundNotifs">Sons de notification</Label>
                    <p className="text-sm text-muted-foreground">Jouer un son lors de la réception d'un message</p>
                  </div>
                  <Switch id="soundNotifs" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtres de notifications</CardTitle>
                <CardDescription>Configurez quels types de messages déclenchent des notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-fiverr-primary" />
                    <div>
                      <Label>Fiverr</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les messages Fiverr</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-upwork-primary" />
                    <div>
                      <Label>Upwork</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les messages Upwork</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-malt-primary" />
                    <div>
                      <Label>Malt</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les messages Malt</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-codeur-primary" />
                    <div>
                      <Label>Codeur.fr</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les messages Codeur.fr</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Enregistrer</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modifier le mot de passe</CardTitle>
                <CardDescription>Mettez à jour votre mot de passe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Mettre à jour</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs</CardTitle>
                <CardDescription>Renforcez la sécurité de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Activer l'authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">Renforce la sécurité en demandant un code en plus du mot de passe</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">Configurer</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intégrations de plateformes</CardTitle>
                <CardDescription>Connectez vos comptes de plateformes freelance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-fiverr-primary flex items-center justify-center text-white font-bold">F</div>
                    <div>
                      <Label>Fiverr</Label>
                      <p className="text-sm text-muted-foreground">Connecté en tant que jean.dupont</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Déconnecter</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-upwork-primary flex items-center justify-center text-white font-bold">U</div>
                    <div>
                      <Label>Upwork</Label>
                      <p className="text-sm text-muted-foreground">Connecté en tant que jean.dupont@example.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Déconnecter</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-malt-primary flex items-center justify-center text-white font-bold">M</div>
                    <div>
                      <Label>Malt</Label>
                      <p className="text-sm text-muted-foreground">Non connecté</p>
                    </div>
                  </div>
                  <Button size="sm">Connecter</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-codeur-primary flex items-center justify-center text-white font-bold">C</div>
                    <div>
                      <Label>Codeur.fr</Label>
                      <p className="text-sm text-muted-foreground">Connecté en tant que JeanD</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Déconnecter</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Gérez vos clés d'API pour intégrer GigSync avec d'autres outils</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clé d'API</Label>
                  <div className="flex">
                    <Input value="sk_live_51Lz•••••••••••••••••••••••••••" readOnly className="rounded-r-none" />
                    <Button variant="secondary" className="rounded-l-none">Copier</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Cette clé d'API permet un accès complet à votre compte. Ne la partagez jamais.</p>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Key className="h-4 w-4" /> Régénérer la clé
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Shield className="h-4 w-4" /> Documentation API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}
