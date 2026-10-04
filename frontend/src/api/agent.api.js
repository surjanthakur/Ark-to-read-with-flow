import apiClient from './Client.api.js';

export const CallAgent = async (user_input = String) => {
  const response = await apiClient.post('/agent/asks', {
    user_query: user_input,
  });
  if (response.status == 200) {
    return response.data;
  }
};
