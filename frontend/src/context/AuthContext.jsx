// src/context/AuthContext.jsx
import { useEffect, useEffectEvent, useState } from 'react';
import apiClient from '../api/Client.api.js';
import { AuthContext } from './Auth.js';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const BACKEND_ORIGIN = new URL(BACKEND_URL).origin;

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // fetch current user api call
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/google/auth/me');
      console.log('Current user response received.', { status: response.status });

      // Extract from body
      const { username, email, profile_img } = response.data ?? {};

      // Extract from headers (Axios lowercases header names)
      const isAuthHeader = response.headers['is_authenticated'];
      const authenticated = isAuthHeader === 'true';

      setUser({
        username,
        email,
        profile_img: profile_img || null,
      });
      setIsAuthenticated(authenticated);
    } catch (err) {
      console.error('Current user request failed.', {
        status: err.response?.status,
        message: err.message,
      });
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAfterLogin = useEffectEvent(() => {
    fetchCurrentUser();
  });

  const LoginUser = () => {
    const width = 500;
    const height = 600;

    const left = window.screenX + (window.outerWidth - width) / 2;

    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${BACKEND_URL}/google/login`,
      'google-login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      return;
    }
  };

  const LogoutUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/google/logout');
      console.log('Current user response received.', { status: response.status });

      const isAuthHeader = response.headers['is_authenticated'];
      const authenticated = isAuthHeader === 'true';
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (err) {
      console.error('Current user request failed.', {
        status: err.response?.status,
        message: err.message,
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const handleLoginMessage = (event) => {
      if (event.origin !== BACKEND_ORIGIN || event.data?.type !== 'google-login-success') {
        return;
      }
      toast.success("you'r now logged in 😁");
      refreshAfterLogin();
    };

    window.addEventListener('message', handleLoginMessage);
    return () => window.removeEventListener('message', handleLoginMessage);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        LogoutUser,
        LoginUser,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
