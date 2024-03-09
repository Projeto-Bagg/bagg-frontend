import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUnlikeTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Tip) => await axios.delete(`/tip-likes/${post.id}`),
    onMutate: (post) => {
      ['tips', 'feed'].forEach((tab) =>
        queryClient.setQueriesData<Tip[]>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((tip) => {
                if (tip.id === post.id) {
                  tip.likedBy -= 1;
                  tip.isLiked = false;
                }
              });
            }),
        ),
      );
    },
  });
};
