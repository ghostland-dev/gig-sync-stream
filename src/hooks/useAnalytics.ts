import { useState } from 'react';
import useLocalStorage from './useLocalStorage';
import { useMessages } from './useMessages';
import { useReply } from './useReply';
import { useClients } from './useClients';

export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  metrics: {
    messagesReceived: number;
    messagesReplied: number;
    responseRate: number;
    averageResponseTime: number; // in hours
    newClients: number;
    revenue: number;
    activeProjects: number;
    completedProjects: number;
  };
  platformBreakdown: {
    fiverr: { messages: number; revenue: number; clients: number };
    upwork: { messages: number; revenue: number; clients: number };
    malt: { messages: number; revenue: number; clients: number };
    codeur: { messages: number; revenue: number; clients: number };
  };
  timeSeriesData: Array<{
    date: string;
    messages: number;
    replies: number;
    revenue: number;
  }>;
  topClients: Array<{
    id: string;
    name: string;
    revenue: number;
    projects: number;
  }>;
}

const generateMockAnalytics = (period: 'day' | 'week' | 'month' | 'year'): AnalyticsData => {
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  switch (period) {
    case 'day':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  // Generate time series data
  const timeSeriesData = [];
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < Math.min(daysDiff, 30); i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    timeSeriesData.push({
      date: date.toISOString().split('T')[0],
      messages: Math.floor(Math.random() * 15) + 5,
      replies: Math.floor(Math.random() * 12) + 3,
      revenue: Math.floor(Math.random() * 2000) + 500
    });
  }

  return {
    period,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    metrics: {
      messagesReceived: 127,
      messagesReplied: 119,
      responseRate: 93.7,
      averageResponseTime: 1.2,
      newClients: 8,
      revenue: 15450,
      activeProjects: 12,
      completedProjects: 23
    },
    platformBreakdown: {
      fiverr: { messages: 42, revenue: 6800, clients: 15 },
      upwork: { messages: 38, revenue: 4950, clients: 12 },
      malt: { messages: 26, revenue: 2400, clients: 8 },
      codeur: { messages: 21, revenue: 1300, clients: 6 }
    },
    timeSeriesData,
    topClients: [
      { id: '1', name: 'TechCorp Solutions', revenue: 8500, projects: 5 },
      { id: '2', name: 'Digital Marketing Pro', revenue: 4200, projects: 3 },
      { id: '3', name: 'StartupX', revenue: 2800, projects: 2 },
      { id: '4', name: 'E-commerce Giant', revenue: 2500, projects: 4 },
      { id: '5', name: 'Creative Agency', revenue: 1900, projects: 2 }
    ]
  };
};

export const useAnalytics = () => {
  const [currentPeriod, setCurrentPeriod] = useLocalStorage<'day' | 'week' | 'month' | 'year'>('analytics-period', 'month');
  const [isLoading, setIsLoading] = useState(false);

  const getAnalytics = async (period?: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsData> => {
    setIsLoading(true);
    const selectedPeriod = period || currentPeriod;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you'd calculate this from actual data
    const analyticsData = generateMockAnalytics(selectedPeriod);
    
    setIsLoading(false);
    return analyticsData;
  };

  const calculateRealTimeMetrics = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Would calculate metrics from actual data
    const messagesReceived = 127;
    const messagesReplied = 119;
    const responseRate = messagesReceived > 0 ? (messagesReplied / messagesReceived) * 100 : 0;
    const averageResponseTime = 1.5; // hours

    return {
      messagesReceived,
      messagesReplied,
      responseRate: Math.round(responseRate * 10) / 10,
      averageResponseTime
    };
  };

  const getRevenueProjection = (period: 'month' | 'quarter' | 'year') => {
    const activeProjectsRevenue = 12000;
    const completedProjectsRevenue = 25000;

    let multiplier = 1;
    switch (period) {
      case 'quarter':
        multiplier = 3;
        break;
      case 'year':
        multiplier = 12;
        break;
    }

    const monthlyAverage = 5000;
    
    return {
      pending: activeProjectsRevenue,
      projected: monthlyAverage * multiplier,
      current: completedProjectsRevenue
    };
  };

  const exportAnalytics = async (format: 'csv' | 'pdf' | 'json') => {
    setIsLoading(true);
    
    const analytics = await getAnalytics();
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you'd generate the actual file
    const exportData = {
      format,
      generatedAt: new Date().toISOString(),
      analytics
    };
    
    // Create a download link (simplified)
    const dataStr = format === 'json' 
      ? JSON.stringify(exportData, null, 2)
      : `Analytics Export - ${format.toUpperCase()}\nGenerated: ${new Date().toLocaleDateString()}`;
    
    const dataUri = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics-${currentPeriod}-${Date.now()}.${format}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setIsLoading(false);
  };

  return {
    currentPeriod,
    setCurrentPeriod,
    isLoading,
    getAnalytics,
    calculateRealTimeMetrics,
    getRevenueProjection,
    exportAnalytics
  };
};