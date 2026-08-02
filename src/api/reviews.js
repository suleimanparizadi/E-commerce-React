import { apiClient } from './client';

export const reviewsApi = {
  getProductReviews: (slug) => apiClient.get(`/reviews/product/${slug}/list`),
  createReview: (slug, data) => apiClient.post(`/reviews/product/${slug}/create/`, data),
  updateReview: (reviewId, data) => apiClient.patch(`/reviews/${reviewId}/change/`, data),
  deleteReview: (reviewId) => apiClient.delete(`/reviews/${reviewId}/change/`),
};