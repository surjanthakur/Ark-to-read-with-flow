// src/context/AuthContext.jsx
import { useEffect, useState } from 'react';
import apiClient from '../api/Client.api.js';
import { AuthContext } from './Auth.js';

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // fetch current user api call
  const fetchCurrentUser = async () => {
    try {
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
