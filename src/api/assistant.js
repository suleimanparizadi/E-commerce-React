import { apiClient } from './client';

export const assistantApi = {
  // Send message to AI assistant
  chat: (data) =>
    apiClient.post('/assistant/', data),
};