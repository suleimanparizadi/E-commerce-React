import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const { setUser, setTokens, logout } = useAuthStore();

  // Login with password
  const login = useMutation({
    mutationFn: (credentials) => authApi.login(credentials).then((res) => res.data),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // Send OTP
  const sendOTP = useMutation({
    mutationFn: (data) => authApi.sendOTP(data).then((res) => res.data),
  });

  // Verify OTP
  const verifyOTP = useMutation({
    mutationFn: (data) => authApi.verifyOTP(data).then((res) => res.data),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // Register - send OTP
  const registerInitiate = useMutation({
    mutationFn: (data) => authApi.registerInitiate(data).then((res) => res.data),
  });

  // Register - verify OTP and create account
  const register = useMutation({
    mutationFn: (data) => authApi.registerVerify(data).then((res) => res.data),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh);
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout().then((res) => res.data),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      logout();
      queryClient.clear();
    },
  });

  // Get profile
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile().then((res) => res.data),
    enabled: useAuthStore.getState().isAuthenticated,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  // Change password
  const changePassword = useMutation({
    mutationFn: (data) => authApi.changePassword(data).then((res) => res.data),
  });

  return {
    login,
    sendOTP,
    verifyOTP,
    register,
    registerInitiate,
    logout: logoutMutation,
    profile,
    changePassword,
  };
}