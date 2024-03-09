import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUnlikeTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tip: Tip) => await axios.delete(`/tip-likes/${tip.id}`),
    onMutate: (tip) => {
      ['tips', 'feed'].forEach((tab) =>
        queryClient.setQueriesData<Tip[]>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((tip) => {
                if (tip.id === tip.id) {
                  tip.likedBy -= 1;
                  tip.isLiked = false;
                }
              });
            }),
        ),
      );

      queryClient.setQueryData<Tip>(
        ['tip', tip.id],
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
