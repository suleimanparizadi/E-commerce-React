import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviews';

export function useReviews(productSlug) {
  const queryClient = useQueryClient();

  // Get product reviews
  const reviews = useQuery({
    queryKey: ['reviews', productSlug],
    queryFn: () => reviewsApi.getProductReviews(productSlug).then((res) => res.data),
    enabled: !!productSlug,
  });

  // Create review
  const createReview = useMutation({
    mutationFn: (data) => reviewsApi.createReview(productSlug, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productSlug] });
    },
  });

  // Update review
  const updateReview = useMutation({
    mutationFn: ({ reviewId, data }) => reviewsApi.updateReview(reviewId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productSlug] });
    },
  });

  // Delete review
  const deleteReview = useMutation({
    mutationFn: (reviewId) => reviewsApi.deleteReview(reviewId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productSlug] });
    },
  });

  return {
    reviews,
    createReview,
    updateReview,
    deleteReview,
  };
}