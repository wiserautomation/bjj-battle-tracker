
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create root instance
const root = createRoot(rootElement);

// Render the App component
root.render(<App />);
