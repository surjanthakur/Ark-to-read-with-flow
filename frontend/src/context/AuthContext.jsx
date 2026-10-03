// src/context/AuthContext.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './Auth.js';
import { toast } from 'react-toastify';
import { LoginUser, LogoutUser, GetCurrentUser } from '../api/user.js';

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
        toast.error(error.response?.data || "Oop's something went wrong plzz try again later!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  //* login user
  const loginUser = () => {
    try {
      setIsLoading(true);

      LoginUser();
    } catch (error) {
      toast.error(error.response?.data || "Oop's something went wrong plzz try again later!");
    } finally {
      setIsLoading(false);
    }
  };

  //* logout current session user
  const logoutUser = async () => {
    try {
      setIsLoading(true);

      const result = await LogoutUser();

      const { message } = result.data ?? '';

      setUser(null);

      setIsAuthenticated(false);

      toast.success(message || 'ok see you soon again.');
    } catch (error) {
      toast.error(error.response?.data || "Oop's something went wrong plzz try again later!");
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
