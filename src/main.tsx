
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Create root once
const root = createRoot(rootElement);

// Render the App directly without nested StrictMode since App.tsx already has it
root.render(<App />);
