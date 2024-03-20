import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteDiaryPost = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/diary-posts/ ' + id),
    onSuccess: (_, id) => {
      [['diary-posts', auth.user?.username], ['trip-diary-posts']].forEach((key) => {
        queryClient.setQueryData<Pagination<DiaryPost[]>>(
          key,
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages = draft.pages.map((page) =>
                page.filter((post) => post.id !== id),
              );
            }),
        );
      });
    },
  });
};
