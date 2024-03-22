import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteTip = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/tips/ ' + id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Tip>(['tip', id], undefined);

      [['feed'], ['tips', auth.user?.username]].forEach((key) => {
        queryClient.setQueryData<Pagination<Tip[]>>(
          key,
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages = draft.pages.map((page) =>
                page.filter((tip) => tip.id !== id),
              );
            }),
        );
      });
    },
  });
};
