import React, { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { Badge } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export const PerformanceMonitor: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get connection info if available
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionType(connection.effectiveType || 'unknown');
      
      const updateConnection = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', updateConnection);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateConnection);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const getPerformanceData = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const memory = (performance as any).memory;
        
        setPerformanceData({
          loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          memoryUsed: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : null,
          memoryTotal: memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : null,
        });
      }
    };

    if (document.readyState === 'complete') {
      getPerformanceData();
    } else {
      window.addEventListener('load', getPerformanceData);
      return () => window.removeEventListener('load', getPerformanceData);
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getConnectionColor = () => {
    switch (connectionType) {
      case '4g': return 'bg-green-500';
      case '3g': return 'bg-yellow-500';
      case '2g': return 'bg-red-500';
      case 'slow-2g': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg shadow-lg cursor-pointer">
            <Activity className="h-4 w-4" />
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-3">
            <h4 className="font-semibold">Performance Monitor</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Connection:</span>
                <Badge variant={isOnline ? 'default' : 'destructive'}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-mono">{connectionType.toUpperCase()}</span>
              </div>
              
              {performanceData && (
                <>
                  <div className="flex justify-between">
                    <span>Load Time:</span>
                    <span className="font-mono">{performanceData.loadTime}ms</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>DOM Ready:</span>
                    <span className="font-mono">{performanceData.domReady}ms</span>
                  </div>
                  
                  {performanceData.memoryUsed && (
                    <div className="flex justify-between">
                      <span>Memory:</span>
                      <span className="font-mono">
                        {performanceData.memoryUsed}MB / {performanceData.memoryTotal}MB
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Development mode only
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};