import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

if (import.meta.env.DEV && import.meta.env.MODE === 'mock') {
  const { initMSW } = await import('../tests/msw/browser.ts');
  console.log('MSW使用開始');
  await initMSW();
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
