import apiClient from './Client.api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// LOGIN USER
export const LoginUser = () => {
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

// LOGOUT USER
export const LogoutUser = async () => {
  const response = await apiClient.post('/google/logout');
  return response;
};

// GET CURRENT USER
export const GetCurrentUser = async () => {
  const response = await apiClient.get('/google/auth/me');
  if (response.status == 200) {
    return response;
  }
};
