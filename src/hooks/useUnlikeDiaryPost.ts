import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUnlikeDiaryPost = () => {
  const queryClient = useQueryClient();

  return useMutation(async (id: number) => await axios.post(`/diaryPosts/${id}/unlike`), {
    onMutate: (id) => {
      ['diaryPosts', 'feed'].forEach((tab) =>
        queryClient.setQueriesData<DiaryPost[]>(
          [tab],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((diaryPost) => {
                if (diaryPost.id === id) {
                  diaryPost.likedBy -= 1;
                  diaryPost.isLiked = false;
                }
              });
            }),
        ),
      );
    },
  });
};
