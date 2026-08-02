import { apiClient } from './client';

export const authApi = {
  login: (credentials) => apiClient.post('/accounts/login/password/', credentials),
  sendOTP: (data) => apiClient.post('/accounts/login/otp/send/', data),
  verifyOTP: (data) => apiClient.post('/accounts/login/otp/verify/', data),
  registerInitiate: (data) => apiClient.post('/accounts/register/initiate/', data),
  registerVerify: (data) => apiClient.post('/accounts/register/verify/', data),
  logout: () => apiClient.post('/accounts/logout/', { refresh: localStorage.getItem('refresh_token') }),
  getProfile: () => apiClient.get('/accounts/profile/'),
  updateProfile: (data) => apiClient.patch('/accounts/profile/', data),
  changePassword: (data) => apiClient.post('/accounts/password/change/', data),
};