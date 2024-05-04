import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUnlikeDiaryPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: DiaryPost) =>
      await axios.delete(`/diary-post-likes/${post.id}`),
    onMutate: (post) => {
      [
        ['diary-posts', post.user.username],
        ['trip-diary-posts', post.tripDiary.id],
      ].forEach((key) =>
        queryClient.setQueryData<Pagination<DiaryPost[]>>(
          key,
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
                page.map((diaryPost) => {
                  if (diaryPost.id === post.id) {
                    diaryPost.likedBy -= 1;
                    diaryPost.isLiked = false;
                  }
                });
              });
            }),
        ),
      );

      queryClient.setQueryData<DiaryPost>(
        ['diary-post', post.id],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.isLiked = false;
          }),
      );
    },
  });
};
