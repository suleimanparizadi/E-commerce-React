import { apiClient } from './client';

export const reviewsApi = {
  // Get product reviews
  getProductReviews: (slug) =>
    apiClient.get(`/reviews/product/${slug}/list`),

  // Create review
  createReview: (slug, data) =>
    apiClient.post(`/reviews/product/${slug}/create/`, data),

  // Update review
  updateReview: (reviewId, data) =>
    apiClient.patch(`/reviews/${reviewId}/change/`, data),

  // Delete review
  deleteReview: (reviewId) =>
    apiClient.delete(`/reviews/${reviewId}/change/`),
};