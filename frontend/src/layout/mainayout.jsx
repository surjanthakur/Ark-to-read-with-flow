import { ThemeProvider } from '../context/ThemeToggleContext.js';
import { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/export.js';
import { HomePage } from '../pages/export.js';
import { ToastContainer } from 'react-toastify';

export default function MainLayout() {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const storedTheme = localStorage.getItem('themeMode');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // set light mode
  const lightTheme = () => {
    setThemeMode('light');
    localStorage.setItem('themeMode', 'light');
  };

  // set dark mode
  const darkTheme = () => {
    setThemeMode('dark');
    localStorage.setItem('themeMode', 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(themeMode);
    root.style.colorScheme = themeMode;
  }, [themeMode]);

  return (
    <>
      <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
        <div className="min-h-screen bg-[#f7f6f0]">
          <Navbar />
          <main>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
            />
            <HomePage />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}
