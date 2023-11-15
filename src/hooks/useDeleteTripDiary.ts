import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTripDiary = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/tripDiaries/' + id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['diaryPosts', auth.user?.username] });
      queryClient.invalidateQueries({ queryKey: ['tripDiaries', auth.user?.username] });
    },
  });
};
