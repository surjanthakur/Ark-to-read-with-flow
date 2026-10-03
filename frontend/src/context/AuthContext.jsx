// src/context/AuthContext.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './Auth.js';
import { toast } from 'react-toastify';
import { LoginUser, LogoutUser, GetCurrentUser } from '../api/user.js';

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //* get current user info
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
        const is_authenticated = result.headers['is_authenticated'];
        if (is_authenticated == 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
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

  // login user
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

  // logout user
  const logoutUser = async () => {
    const result = await logoutUser();
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
