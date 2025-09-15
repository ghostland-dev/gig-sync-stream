import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Basic analytics events
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

// Simple analytics class
class Analytics {
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = localStorage.getItem('analytics-user-id') || this.generateUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserId(): string {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics-user-id', userId);
    return userId;
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent & { timestamp: number; userId: string; sessionId: string } = {
      name: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      userId: this.userId!,
      sessionId: this.sessionId
    };

    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
      return;
    }

    // Store events locally for now (in production, send to analytics service)
    const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
    events.push(event);
    
    // Keep only last 100 events to prevent localStorage bloat
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem('analytics-events', JSON.stringify(events));
  }

  page(pageName: string, properties: Record<string, any> = {}) {
    this.track('page_view', {
      page: pageName,
      ...properties
    });
  }

  identify(userId: string, traits: Record<string, any> = {}) {
    this.userId = userId;
    localStorage.setItem('analytics-user-id', userId);
    
    this.track('identify', {
      userId,
      traits
    });
  }

  // Get stored events (useful for debugging or batch sending)
  getEvents(): AnalyticsEvent[] {
    return JSON.parse(localStorage.getItem('analytics-events') || '[]');
  }

  // Clear stored events
  clearEvents() {
    localStorage.removeItem('analytics-events');
  }
}

// Singleton instance
const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    const pageName = location.pathname;
    analytics.page(pageName, {
      search: location.search,
      hash: location.hash
    });
  }, [location]);

  return {
    track: analytics.track.bind(analytics),
    page: analytics.page.bind(analytics),
    identify: analytics.identify.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics),
    clearEvents: analytics.clearEvents.bind(analytics)
  };
};

// Track common user interactions
export const useInteractionTracking = () => {
  const { track } = useAnalytics();

  const trackClick = (elementName: string, properties: Record<string, any> = {}) => {
    track('click', {
      element: elementName,
      ...properties
    });
  };

  const trackSearch = (query: string, results: number = 0) => {
    track('search', {
      query,
      results
    });
  };

  const trackPlatformSwitch = (platform: string) => {
    track('platform_switch', {
      platform
    });
  };

  const trackMessageOpen = (messageId: string, platform: string) => {
    track('message_open', {
      messageId,
      platform
    });
  };

  const trackFeatureUse = (featureName: string, properties: Record<string, any> = {}) => {
    track('feature_use', {
      feature: featureName,
      ...properties
    });
  };

  return {
    trackClick,
    trackSearch,
    trackPlatformSwitch,
    trackMessageOpen,
    trackFeatureUse
  };
};

export default analytics;
