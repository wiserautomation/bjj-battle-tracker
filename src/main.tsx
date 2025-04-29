
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Render the app without a duplicate React.StrictMode
createRoot(document.getElementById("root")!).render(<App />);
