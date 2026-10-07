import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

export const MainLayout = lazy(() => import('./layout/mainayout.jsx'));
export const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
export const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="p-10 align-middle justify-center text-center" role="status">
            Wait Loading page...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/why" element={<AboutPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
