import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useClients } from '@/hooks/useClients';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { getAnalytics, calculateRealTimeMetrics, getRevenueProjection } = useAnalytics();
  const { getClientStats } = useClients();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const realTimeMetrics = calculateRealTimeMetrics();
  const clientStats = getClientStats();
  const revenueProjection = getRevenueProjection(period === 'week' ? 'month' : period);

  useEffect(() => {
    const loadData = async () => {
      const data = await getAnalytics('month');
      setAnalyticsData(data);
    };
    loadData();
  }, [getAnalytics]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages reçus</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.messagesReceived}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réponse</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(realTimeMetrics.responseRate)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeMetrics.averageResponseTime}h</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -20min vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.activeClients}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{clientStats.totalClients - clientStats.activeClients} nouveaux
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Projection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Projections de revenus
            </CardTitle>
            <Tabs value={period} onValueChange={(value) => setPeriod(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="quarter">Trimestre</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueProjection.current)}
              </div>
              <p className="text-sm text-muted-foreground">Revenus actuels</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(revenueProjection.pending)}
              </div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(revenueProjection.projected)}
              </div>
              <p className="text-sm text-muted-foreground">
                Projeté ({period === 'week' ? 'cette semaine' : 
                         period === 'month' ? 'ce mois' : 'ce trimestre'})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance par plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData && Object.entries(analyticsData.platformBreakdown).map(([platform, data]: [string, any]) => (
              <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold uppercase">{platform[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium capitalize">{platform}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.messages} messages • {data.clients} clients
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(data.revenue)}</div>
                  <div className="text-sm text-muted-foreground">Revenus</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData?.topClients.map((client, index) => (
              <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.projects} projets</p>
                  </div>
                </div>
                <div className="font-bold">{formatCurrency(client.revenue)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};