// Ensure window.fetch has both getter and setter in iframe environments
if (typeof window !== 'undefined') {
  try {
    let currentFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : window.fetch;
    const defineFetch = (target: any) => {
      if (!target) return;
      try {
        Object.defineProperty(target, 'fetch', {
          get: () => currentFetch,
          set: (fn: any) => {
            currentFetch = fn;
          },
          configurable: true,
          enumerable: true,
        });
      } catch (_) {}
    };
    defineFetch(window);
    if (typeof Window !== 'undefined' && Window.prototype) {
      defineFetch(Window.prototype);
    }
  } catch (_) {}
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
