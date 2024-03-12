import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteTripDiary = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/trip-diaries/' + id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['diary-posts', auth.user?.username] });
      queryClient.invalidateQueries({ queryKey: ['diary-post', id] });

      queryClient.setQueryData<TripDiary[]>(
        ['trip-diaries', auth.user?.username],
        (old) =>
          old &&
          produce(old, (draft) => draft.filter((tripDiary) => tripDiary.id !== id)),
      );
    },
  });
};
