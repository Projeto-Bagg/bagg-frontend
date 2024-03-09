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
      queryClient.setQueryData<Tip[]>(
        ['tips', auth.user?.username],
        (old) => old && produce(old, (draft) => draft.filter((post) => post.id !== id)),
      );

      queryClient.setQueryData<Tip[]>(
        ['feed'],
        (old) => old && produce(old, (draft) => draft.filter((post) => post.id !== id)),
      );
    },
  });
};
