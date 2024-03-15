import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUnlikeTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tip: Tip) => await axios.delete(`/tip-likes/${tip.id}`),
    onMutate: (data) => {
      [['feed'], ['tips', data.user.username]].forEach((key) =>
        queryClient.setQueryData<Pagination<Tip>>(
          key,
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
                page.map((tip) => {
                  if (tip.id === data.id) {
                    tip.likedBy -= 1;
                    tip.isLiked = false;
                  }
                });
              });
            }),
        ),
      );

      queryClient.setQueryData<Tip>(
        ['tip', data.id],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.isLiked = false;
            draft.likedBy -= 1;
          }),
      );
    },
  });
};
