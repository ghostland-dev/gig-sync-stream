import { useEffect } from 'react';

// Performance monitoring hook
export const usePerformance = () => {
  useEffect(() => {
    // Measure and log performance metrics
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          
          // Paint timing
          firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          
          // Connection info
          connectionType: (navigator as any).connection?.effectiveType || 'unknown',
          
          // Memory info (Chrome only)
          usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
          totalJSHeapSize: (performance as any).memory?.totalJSHeapSize || 0,
        };

        // Log metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', metrics);
        }

        // Store metrics for potential analytics
        localStorage.setItem('performance-metrics', JSON.stringify(metrics));
      }
    };

    // Wait for page load to complete
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  // Measure component render time
  const measureRender = (componentName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const renderTime = end - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  };

  return { measureRender };
};

// Core Web Vitals measurement
export const useCoreWebVitals = () => {
  useEffect(() => {
    const measureCWV = async () => {
      try {
        // Dynamically import web-vitals functions
        const webVitals = await import('web-vitals');
        
        // Use available functions from web-vitals
        if (webVitals.onCLS) webVitals.onCLS(console.log);
        if (webVitals.onFCP) webVitals.onFCP(console.log);
        if (webVitals.onLCP) webVitals.onLCP(console.log);
        if (webVitals.onTTFB) webVitals.onTTFB(console.log);
        if (webVitals.onINP) webVitals.onINP(console.log);
        
      } catch (error) {
        // web-vitals not available, use basic measurements
        console.log('Core Web Vitals library not available');
      }
    };

    measureCWV();
  }, []);
};

// Bundle size and resource timing
export const useResourceTiming = () => {
  useEffect(() => {
    const logResourceTiming = () => {
      if ('performance' in window) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        const resourceSummary = resources.reduce((acc, resource) => {
          const type = resource.initiatorType;
          if (!acc[type]) acc[type] = { count: 0, totalSize: 0, totalTime: 0 };
          
          acc[type].count++;
          acc[type].totalSize += resource.transferSize || 0;
          acc[type].totalTime += resource.duration;
          
          return acc;
        }, {} as Record<string, { count: number; totalSize: number; totalTime: number }>);

        if (process.env.NODE_ENV === 'development') {
          console.log('Resource Summary:', resourceSummary);
        }
      }
    };

    window.addEventListener('load', logResourceTiming);
    return () => window.removeEventListener('load', logResourceTiming);
  }, []);
};