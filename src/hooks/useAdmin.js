import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';

// Helper to extract data from Django's { data: ... } wrapper
function extractData(response) {
  if (!response) return null;
  if (response.data !== undefined) return response.data;
  return response;
}

export function useAdmin() {
  const queryClient = useQueryClient();

  // ─── Dashboard Stats ───
  const products = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await adminApi.getProducts();
      const data = res?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  const orders = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const res = await adminApi.getAllOrders();
      const extracted = extractData(res.data);
      return Array.isArray(extracted) ? extracted : [];
    },
  });

  const users = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await adminApi.getUsers();
      const data = res?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  // ─── Products CRUD ───
  const createProduct = useMutation({
    mutationFn: (data) => adminApi.createProduct(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  const updateProduct = useMutation({
    mutationFn: ({ slug, data }) => adminApi.updateProduct(slug, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  const deleteProduct = useMutation({
    mutationFn: (slug) => adminApi.deleteProduct(slug).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });

  // ─── Order Status ───
  const changeOrderStatus = useMutation({
    mutationFn: ({ orderId, status }) => 
      adminApi.changeOrderStatus(orderId, status).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });

  // ─── User Toggle ───
  const toggleUserActive = useMutation({
    mutationFn: (userId) => adminApi.toggleUserActive(userId).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  // ─── FAQ ───
  const faqs = useQuery({
    queryKey: ['admin', 'faqs'],
    queryFn: async () => {
      const res = await adminApi.getFAQs();
      const data = res?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  const createFAQ = useMutation({
    mutationFn: (data) => adminApi.createFAQ(data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] }),
  });

  const updateFAQ = useMutation({
    mutationFn: ({ faqId, data }) => adminApi.updateFAQ(faqId, data).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] }),
  });

  const deleteFAQ = useMutation({
    mutationFn: (faqId) => adminApi.deleteFAQ(faqId).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] }),
  });

  // ─── Dropdown Data ───
  const cpus = useQuery({
    queryKey: ['admin', 'cpus'],
    queryFn: async () => {
      const res = await adminApi.getCPUs();
      const data = res?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  const categories = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const res = await adminApi.getCategories();
      const data = res?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  return {
    // Stats
    products,
    orders,
    users,
    
    // Products
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Orders
    changeOrderStatus,
    
    // Users
    toggleUserActive,
    
    // FAQ
    faqs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    
    // Dropdowns
    cpus,
    categories,
  };
}