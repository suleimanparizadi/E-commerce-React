import { apiClient } from './client';

export const authApi = {
  // Password login
  login: (credentials) =>
    apiClient.post('/accounts/login/password/', credentials),

  // OTP send
  sendOTP: (data) =>
    apiClient.post('/accounts/login/otp/send/', data),

  // OTP verify
  verifyOTP: (data) =>
    apiClient.post('/accounts/login/otp/verify/', data),

  // Register initiate (send OTP)
  registerInitiate: (data) =>
    apiClient.post('/accounts/register/initiate/', data),

  // Register verify (create account)
  registerVerify: (data) =>
    apiClient.post('/accounts/register/verify/', data),

  // Logout
  logout: () =>
    apiClient.post('/accounts/logout/', { refresh: localStorage.getItem('refresh_token') }),

  // Get profile
  getProfile: () =>
    apiClient.get('/accounts/profile/'),

  // Update profile
  updateProfile: (data) =>
    apiClient.patch('/accounts/profile/', data),

  // Change password
  changePassword: (data) =>
    apiClient.post('/accounts/password/change/', data),
};