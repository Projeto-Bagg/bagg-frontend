import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useLikeDiaryPost = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (post: DiaryPost) =>
      await axios.post(`/diaryPosts/${post.id}/like`),
    onMutate: (post) => {
      queryClient.setQueryData<DiaryPost[]>(
        ['diaryPosts', 'like', auth.user?.username],
        (old) =>
          old &&
          produce(old, (draft) => {
            !draft.some((currentPost) => currentPost.id === post.id) &&
              draft.unshift(post);
          }),
      );

      ['diaryPosts', 'feed', 'tripDiaryPosts'].forEach((tab) =>
        queryClient.setQueriesData<DiaryPost[]>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((diaryPost) => {
                if (diaryPost.id === post.id) {
                  diaryPost.likedBy += 1;
                  diaryPost.isLiked = true;
                }
              });
            }),
        ),
      );
    },
  });
};
