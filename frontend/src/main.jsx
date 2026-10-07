import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

import MainLayout from './layout/mainayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AboutPage from './pages/AboutPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/why" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
