import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx';

import './index.css';

import MainLayout from './layout/mainayout.jsx';
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/dashboard/:email" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
