import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleControllerChange = () => {
        setShowUpdatePrompt(true);
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      }).catch((error) => {
        console.log('Service worker registration failed:', error);
      });

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Update Available
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            A new version of the app is available
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleUpdate}
          size="sm"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Update
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Later
        </Button>
      </div>
    </div>
  );
} 