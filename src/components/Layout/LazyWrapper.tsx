import React, { Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback || <LoadingState />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};