// src/context/AuthContext.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './Auth.js';
import { toast } from 'react-toastify';
import { LoginUser, LogoutUser, GetCurrentUser } from '../api/user.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //* get current session user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);

        const result = await GetCurrentUser();

        const { username, email, profile_img } = result.data ?? {};

        setUser({
          username,
          email,
          profile_img: profile_img || '',
        });

        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);

        setIsAuthenticated(false);
        if (error.response.status == 500) {
          return;
        }
        toast.error(
          error.response?.data?.detail || "Oop's something went wrong plzz try again later!"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const handleOAuthMessage = (event) => {
      if (event.origin !== BACKEND_URL) {
        return;
      }

      if (event.data?.type === 'google-login-success') {
        toast.success("you'r now logged in");

        // Refresh user/session
        fetchCurrentUser();
      }
    };

    // Check existing session when app loads
    fetchCurrentUser();

    window.addEventListener('message', handleOAuthMessage);

    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  //* login user
  const loginUser = () => {
    try {
      setIsLoading(true);
      LoginUser();
    } catch (error) {
      toast.error(
        error.response?.data?.details || "Oop's something went wrong plzz try again later!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  //* logout current session user
  const logoutUser = async () => {
    try {
      setIsLoading(true);

      await LogoutUser();

      setIsAuthenticated(false);
      setUser(null);

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Oop's something went wrong plzz try again later!"
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
