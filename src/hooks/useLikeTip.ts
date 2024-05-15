import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useLikeTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tip: Tip) => await axios.post(`/tip-likes/${tip.id}`),
    onMutate: (data) => {
      ['following-feed', 'for-you-feed', 'tips'].forEach((tab) =>
        queryClient.setQueriesData<Pagination<Tip[]>>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
                page.map((tip) => {
                  if (tip.id === data.id) {
                    tip.likesAmount += 1;
                    tip.isLiked = true;
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
            draft.isLiked = true;
            draft.likesAmount += 1;
          }),
      );
    },
  });
};
