import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function AppDownloadButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the installation`);
    setDeferredPrompt(null);
  };

  const handleIOSInstall = () => {
    alert('To install the app on iOS:\n1. Tap the share icon in your browser\n2. Select "Add to Home Screen"\n3. Tap "Add"');
  };

  if (isStandalone) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isIOS ? handleIOSInstall : handleInstallClick}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-mea-gold dark:hover:text-mea-gold transition-colors"
      title={isIOS ? "Install on iOS" : "Install App"}
    >
      <Smartphone className="h-4 w-4" />
      <span className="hidden sm:inline">Install</span>
    </Button>
  );
}
