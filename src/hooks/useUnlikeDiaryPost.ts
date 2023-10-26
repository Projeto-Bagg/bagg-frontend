import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUnlikeDiaryPost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (post: DiaryPost) => await axios.post(`/diaryPosts/${post.id}/unlike`),
    {
      onMutate: (post) => {
        ['diaryPosts', 'feed'].forEach((tab) =>
          queryClient.setQueriesData<DiaryPost[]>(
            [tab],
            (old) =>
              old &&
              produce(old, (draft) => {
                draft.map((diaryPost) => {
                  if (diaryPost.id === post.id) {
                    diaryPost.likedBy -= 1;
                    diaryPost.isLiked = false;
                  }
                });
              }),
          ),
        );
      },
    },
  );
};
