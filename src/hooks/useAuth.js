import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { cartApi } from '../api/cart';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const { setUser, setTokens, logout } = useAuthStore();
  const { items: guestItems, clearCart: clearGuestCart } = useCartStore();

  // Reactive auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Login with password
  const login = useMutation({
    mutationFn: (credentials) => authApi.login(credentials).then((res) => res.data),
    onSuccess: async (data) => {
      const tokens = data.tokens || data;
      setTokens(tokens.access, tokens.refresh);
      await syncGuestCartToApi();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Login with OTP - send OTP
  const sendOTP = useMutation({
    mutationFn: (phone_number) => authApi.sendOTP(phone_number).then((res) => res.data),
  });

  // Login with OTP - verify OTP
  // Verify OTP
  const verifyOTP = useMutation({
    mutationFn: (data) => {
      // Fix field name mismatch from LoginPage
      const payload = {
        phone_number: data.phone_number || data.phone,
        code: data.code || data.otp_code,
      };
      return authApi.verifyOTP(payload).then((res) => res.data);
    },
    onSuccess: async (data) => {
      const tokens = data.tokens || data;
      setTokens(tokens.access, tokens.refresh);
      
      // 🛒 Sync guest cart to API after OTP login
      const guestItems = useCartStore.getState().items;
      if (guestItems.length > 0) {
        for (const item of guestItems) {
          try {
            await cartApi.addItem({
              product_slug: item.product?.slug,
              quantity: item.quantity,
            });
          } catch (e) {
            console.error('Cart sync error:', e);
          }
        }
        useCartStore.getState().clearCart();
      }
      
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Register - send OTP
  const registerInitiate = useMutation({
    mutationFn: (data) => authApi.registerInitiate(data).then((res) => res.data),
  });

  // Register - verify OTP and create account
  const register = useMutation({
    mutationFn: (data) => authApi.registerVerify(data).then((res) => res.data),
    onSuccess: async (data) => {
      const tokens = data.tokens || data;
      setTokens(tokens.access, tokens.refresh);
      await syncGuestCartToApi();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  async function syncGuestCartToApi() {
    const items = useCartStore.getState().items;
    if (!items || items.length === 0) return;

    console.log('🛒 Syncing guest cart to API:', items);
    for (const item of items) {
      try {
        await cartApi.addItem({
          product_slug: item.product?.slug,
          quantity: item.quantity,
        });
        console.log(`✅ Synced: ${item.product?.name} x${item.quantity}`);
      } catch (error) {
        console.error(`❌ Failed to sync ${item.product?.slug}:`, error.response?.data?.message || error.message);
      }
    }
    clearGuestCart();
    console.log('🗑️ Guest cart cleared');
  }

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
    enabled: isAuthenticated,
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
    registerInitiate,
    register,
    logout: logoutMutation,
    profile,
    changePassword,
  };
}