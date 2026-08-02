import { useMutation } from '@tanstack/react-query';
import { assistantApi } from '../api/assistant';

export function useAssistant() {
  const chat = useMutation({
    mutationFn: (data) => assistantApi.chat(data).then((res) => res.data),
  });

  return {
    chat,
  };
}