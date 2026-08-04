import { useMutation } from '@tanstack/react-query';
import { assistantApi } from '../api/assistant';

export function useAssistant() {
  const chat = useMutation({
    mutationFn: async (data) => {
      const res = await assistantApi.chat(data);
      // Return raw answer — can be string OR object { message, products }
      return res?.data?.answer ?? 'پاسخی دریافت نشد.';
    },
  });

  return {
    chat,
  };
}