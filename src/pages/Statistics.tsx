
import React, { useState, useEffect } from "react";
import { Dashboard } from "@/components/Layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalytics } from "@/hooks/useAnalytics";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart, 
  Calendar, 
  TrendingUp,
  Users,
  Download,
  RefreshCw
} from "lucide-react";
import { Bar, Line, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

// Custom chart components
const BarChart = ({ data, className }: { data: any[], className?: string }) => (
  <ChartContainer className={className} config={{}}>
    <ResponsiveContainer width="100%" height="100%">
      <Bar data={data} dataKey="value">
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
      <Line data={data} dataKey="Fiverr">
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
  const { 
    currentPeriod, 
    setCurrentPeriod, 
    getAnalytics, 
    calculateRealTimeMetrics, 
    getRevenueProjection, 
    exportAnalytics,
    isLoading 
  } = useAnalytics();
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const realTimeMetrics = calculateRealTimeMetrics();
  const revenueProjection = getRevenueProjection('month');

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getAnalytics(currentPeriod);
      setAnalyticsData(data);
    };
    loadAnalytics();
  }, [currentPeriod, getAnalytics]);

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    setCurrentPeriod(period);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    exportAnalytics(format);
  };

  return (
    <Dashboard>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
            <p className="text-muted-foreground">Vue d'ensemble de votre activité sur les plateformes</p>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={currentPeriod} onValueChange={handlePeriodChange}>
              <TabsList>
                <TabsTrigger value="day">Jour</TabsTrigger>
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="year">Année</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={() => getAnalytics()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Cards for key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages reçus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.messagesReceived}</div>
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
              <div className="text-2xl font-bold">{realTimeMetrics.responseRate}%</div>
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
              <div className="text-2xl font-bold">{realTimeMetrics.averageResponseTime}h</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">-0.3h</span> depuis la semaine dernière
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires projeté</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(revenueProjection.projected).toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+12%</span> ce mois-ci
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
                data={analyticsData ? [
                  { name: "Fiverr", value: analyticsData.platformBreakdown.fiverr.messages },
                  { name: "Upwork", value: analyticsData.platformBreakdown.upwork.messages },
                  { name: "Malt", value: analyticsData.platformBreakdown.malt.messages },
                  { name: "Codeur", value: analyticsData.platformBreakdown.codeur.messages }
                ] : []}
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
                data={analyticsData ? [
                  { name: "Fiverr", value: analyticsData.platformBreakdown.fiverr.messages, color: "hsl(var(--fiverr-primary))" },
                  { name: "Upwork", value: analyticsData.platformBreakdown.upwork.messages, color: "hsl(var(--upwork-primary))" },
                  { name: "Malt", value: analyticsData.platformBreakdown.malt.messages, color: "hsl(var(--malt-primary))" },
                  { name: "Codeur", value: analyticsData.platformBreakdown.codeur.messages, color: "hsl(var(--codeur-primary))" }
                ] : []}
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
              data={analyticsData?.timeSeriesData ? analyticsData.timeSeriesData.map(item => ({
                date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                Messages: item.messages,
                Réponses: item.replies
              })) : []}
              className="w-full aspect-[16/5]"
            />
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}
