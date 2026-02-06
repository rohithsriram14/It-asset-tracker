import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';

function tryMount() {
  const container = document.getElementById('root');
  if (!container) return false;
  createRoot(container).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <App />
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
  );
  return true;
}

if (!tryMount()) {
  window.addEventListener('DOMContentLoaded', () => {
    if (!tryMount()) throw new Error('Root container not found — ensure public/index.html has <div id="root"></div>');
  });
}
