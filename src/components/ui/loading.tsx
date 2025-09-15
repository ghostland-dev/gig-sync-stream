import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingStateProps {
  children?: React.ReactNode;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <LoadingSpinner size="lg" className="mb-4" />
      {children ? (
        children
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-2">Chargement...</h3>
          <p className="text-muted-foreground">
            Veuillez patienter pendant que nous récupérons vos données.
          </p>
        </div>
      )}
    </div>
  );
};

interface FullPageLoadingProps {
  message?: string;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = "Chargement de GigSync..."
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
          <LoadingSpinner size="lg" className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">GigSync</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};