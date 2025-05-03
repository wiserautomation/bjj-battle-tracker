
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root once with nullish coalescing for safety
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Wrap the entire app with React.StrictMode to help with development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
