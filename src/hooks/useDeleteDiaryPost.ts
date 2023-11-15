import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteDiaryPost = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/diaryPosts/ ' + id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<DiaryPost[]>(
        ['diaryPosts', auth.user?.username],
        (old) => old && produce(old, (draft) => draft.filter((post) => post.id !== id)),
      );

      queryClient.setQueryData<DiaryPost[]>(
        ['feed'],
        (old) => old && produce(old, (draft) => draft.filter((post) => post.id !== id)),
      );

      queryClient.setQueriesData<DiaryPost[]>(
        { queryKey: ['tripDiaryPosts'] },
        (old) => old && produce(old, (draft) => draft.filter((post) => post.id !== id)),
      );
    },
  });
};
