import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');

// Falha explícita em vez de non-null assertion — facilita debug.
if (rootElement === null) {
  throw new Error('Elemento #root não encontrado no DOM. Verifique o index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
