import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useCreateTip = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (data: FormData) => (await axios.post<Tip>('/tips', data)).data,
    onSuccess: (data) => {
      queryClient.setQueryData<Tip>(['tip', data.id], data);

      queryClient.setQueryData<Pagination<Tip>>(
        ['feed'],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].unshift(data);
          }),
      );
    },
  });
};
