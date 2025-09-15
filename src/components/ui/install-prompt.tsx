import React, { useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { usePWA } from '@/hooks/usePWA';
import useLocalStorage from '@/hooks/useLocalStorage';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = useLocalStorage('install-prompt-dismissed', false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || dismissed || !isVisible) {
    return null;
  }

  const handleInstall = () => {
    installApp();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 z-50 shadow-lg border-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Installer GigSync</h4>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Installez l'app pour un accès rapide et des notifications push
        </p>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleInstall}
            size="sm"
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" />
            Installer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDismiss}
          >
            Plus tard
          </Button>
        </div>
      </CardContent>     
    </Card>
  );
};