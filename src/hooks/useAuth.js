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
      // Handle both response shapes: {tokens: {access, refresh}} or {access, refresh}
      const tokens = data.tokens || data;
      setTokens(tokens.access, tokens.refresh);
      
      // 🛒 Sync guest cart to API after login
      await syncGuestCartToApi();
      
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Send OTP
  const sendOTP = useMutation({
    mutationFn: (data) => authApi.sendOTP(data).then((res) => res.data),
  });

  // Verify OTP
  const verifyOTP = useMutation({
    mutationFn: (data) => authApi.verifyOTP(data).then((res) => res.data),
    onSuccess: async (data) => {
      const tokens = data.tokens || data;
      setTokens(tokens.access, tokens.refresh);
      
      // 🛒 Sync guest cart to API after OTP login
      await syncGuestCartToApi();
      
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
      
      // 🛒 Sync guest cart to API after registration
      await syncGuestCartToApi();
      
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 🛒 Helper: sync guest cart items to authenticated API cart
  async function syncGuestCartToApi() {
    const items = useCartStore.getState().items;
    if (!items || items.length === 0) return;

    console.log('🛒 Syncing guest cart to API:', items);

    // Add each item sequentially to respect stock checks
    for (const item of items) {
      try {
        await cartApi.addItem({
          product_slug: item.product?.slug,
          quantity: item.quantity,
        });
        console.log(`✅ Synced: ${item.product?.name} x${item.quantity}`);
      } catch (error) {
        console.error(`❌ Failed to sync ${item.product?.slug}:`, error.response?.data?.message || error.message);
        // Continue with other items even if one fails
      }
    }

    // Clear guest cart after sync
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

  // Get profile — only when authenticated
  const profile = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile().then((res) => res.data),
    enabled: isAuthenticated, // ← Now reactive!
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