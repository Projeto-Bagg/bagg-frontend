import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/tips/ ' + id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Tip>(['tip', id], undefined);

      queryClient.setQueryData<Pagination<Tip>>(
        ['feed'],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages = draft.pages.map((page) => page.filter((tip) => tip.id !== id));
          }),
      );
    },
  });
};
