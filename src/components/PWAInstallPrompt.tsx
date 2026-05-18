import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Download } from 'lucide-react';

// Define the BeforeInstallPromptEvent interface according to the spec
// https://w3c.github.io/manifest/#beforeinstallpromptevent-interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Declare the event for TypeScript
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle the appinstalled event
  useEffect(() => {
    const handleAppInstalled = () => {
      // Clear the deferredPrompt variable as it's no longer needed
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Log the outcome
    console.log(`User ${outcome} the installation`);
    
    // Clear the deferredPrompt as it can't be used again
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  // Don't show anything if there's no install prompt or if we're in standalone mode
  if (!showInstallPrompt || window.matchMedia('(display-mode: standalone)').matches) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Install MEA App
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {isIOS 
              ? 'Tap the share icon and select "Add to Home Screen"'
              : 'Add this app to your home screen for quick access'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {!isIOS && (
        <div className="mt-3 flex gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Not now
          </Button>
        </div>
      )}
    </div>
  );
} 