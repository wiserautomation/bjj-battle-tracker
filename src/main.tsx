
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TooltipProvider } from "@/components/ui/tooltip";

// Create root once with nullish coalescing for safety
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);

// Wrap the entire app with TooltipProvider at the highest level
root.render(
  <React.StrictMode>
    <TooltipProvider delayDuration={0}>
      <App />
    </TooltipProvider>
  </React.StrictMode>
);
