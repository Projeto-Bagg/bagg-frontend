import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useLikeTip = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (post: Tip) => await axios.post(`/tip-likes/${post.id}`),
    onMutate: (post) => {
      queryClient.setQueryData<Tip[]>(
        ['tips', 'like', auth.user?.username],
        (old) =>
          old &&
          produce(old, (draft) => {
            !draft.some((currentPost) => currentPost.id === post.id) &&
              draft.unshift(post);
          }),
      );

      ['feed', 'tips'].forEach((tab) =>
        queryClient.setQueriesData<Tip[]>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((tip) => {
                if (tip.id === post.id) {
                  tip.likedBy += 1;
                  tip.isLiked = true;
                }
              });
            }),
        ),
      );
    },
  });
};
