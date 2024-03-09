import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

interface CreateTipComment {
  tipId: number;
  message: string;
}

export const useCreateTipComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTipComment) =>
      await axios.post<TipComment>('/tip-comments/', {
        message: data.message,
        tipId: data.tipId,
      }),
    onSuccess(response, data) {
      queryClient.setQueryData<TipComment[]>(
        ['tip-comments', data.tipId],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.unshift(response.data);
          }),
      );
    },
  });
};
