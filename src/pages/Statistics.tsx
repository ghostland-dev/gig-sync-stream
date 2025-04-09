
import React from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart, 
  Calendar, 
  TrendingUp,
  Users
} from "lucide-react";
import { Bar, Line, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

// Custom chart components
const BarChart = ({ data, className }: { data: any[], className?: string }) => (
  <ChartContainer className={className} config={{}}>
    <ResponsiveContainer width="100%" height="100%">
      <Bar data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="var(--primary)" />
      </Bar>
    </ResponsiveContainer>
  </ChartContainer>
);

const LineChart = ({ data, className }: { data: any[], className?: string }) => (
  <ChartContainer className={className} config={{}}>
    <ResponsiveContainer width="100%" height="100%">
      <Line data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="Fiverr" stroke="var(--fiverr-primary)" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Upwork" stroke="var(--upwork-primary)" />
        <Line type="monotone" dataKey="Malt" stroke="var(--malt-primary)" />
        <Line type="monotone" dataKey="Codeur" stroke="var(--codeur-primary)" />
      </Line>
    </ResponsiveContainer>
  </ChartContainer>
);

const DonutChart = ({ data, className }: { data: any[], className?: string }) => (
  <ChartContainer className={className} config={{}}>
    <ResponsiveContainer width="100%" height="100%">
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </ResponsiveContainer>
  </ChartContainer>
);

export default function Statistics() {
  return (
    <Dashboard>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
            <p className="text-muted-foreground">Vue d'ensemble de votre activité sur les plateformes</p>
          </div>
          <Tabs defaultValue="week">
            <TabsList>
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Cards for key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages reçus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+15%</span> depuis la semaine dernière
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+2%</span> depuis la semaine dernière
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Temps de réponse moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1h 12min</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">-15min</span> depuis la semaine dernière
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+3</span> depuis la semaine dernière
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Activité par plateforme</CardTitle>
              <CardDescription>Messages reçus par plateforme au cours des 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={[
                  { name: "Fiverr", value: 42 },
                  { name: "Upwork", value: 38 },
                  { name: "Malt", value: 26 },
                  { name: "Codeur", value: 21 }
                ]}
                className="w-full aspect-[4/3]"
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Répartition des messages</CardTitle>
              <CardDescription>Nombre de messages par plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart 
                data={[
                  { name: "Fiverr", value: 42, color: "var(--fiverr-primary)" },
                  { name: "Upwork", value: 38, color: "var(--upwork-primary)" },
                  { name: "Malt", value: 26, color: "var(--malt-primary)" },
                  { name: "Codeur", value: 21, color: "var(--codeur-primary)" }
                ]}
                className="w-full aspect-[4/3]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Timeline chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activité au fil du temps</CardTitle>
            <CardDescription>Messages reçus au cours des 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={[
                { date: "1 Avril", Fiverr: 5, Upwork: 3, Malt: 2, Codeur: 1 },
                { date: "2 Avril", Fiverr: 2, Upwork: 4, Malt: 3, Codeur: 2 },
                { date: "3 Avril", Fiverr: 3, Upwork: 2, Malt: 1, Codeur: 3 },
                { date: "4 Avril", Fiverr: 4, Upwork: 1, Malt: 4, Codeur: 2 },
                { date: "5 Avril", Fiverr: 3, Upwork: 3, Malt: 2, Codeur: 1 },
                { date: "6 Avril", Fiverr: 2, Upwork: 5, Malt: 1, Codeur: 2 },
                { date: "7 Avril", Fiverr: 5, Upwork: 2, Malt: 3, Codeur: 1 },
              ]}
              className="w-full aspect-[16/5]"
            />
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}
