import { apiClient } from './client';

export const assistantApi = {
  chat: (data) => apiClient.post('/assistant/', { question: data.user_message }),
};