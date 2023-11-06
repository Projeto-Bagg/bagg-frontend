import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTripDiary = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation(async (id: number) => axios.delete('/tripDiaries/' + id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['feed']);
      queryClient.invalidateQueries(['diaryPosts', auth.user?.username]);
      queryClient.invalidateQueries(['tripDiaries', auth.user?.username]);
    },
  });
};
