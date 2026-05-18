import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker with update handling
if ('serviceWorker' in navigator) {
  // Track if we're already refreshing
  let isRefreshing = false;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registered');
        
        // Check for updates on page load
        registration.update();
        
        // Detect controller change (service worker update)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Only reload once to prevent infinite reload loop
          if (isRefreshing) return;
          isRefreshing = true;
          window.location.reload();
        });
      })
      .catch(error => console.error('Service worker registration failed:', error));
  });
}
