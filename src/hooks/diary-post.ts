import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useCreateDiaryPost = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (data: FormData) =>
      (await axios.post<DiaryPost>('/diary-posts', data)).data,
    onSuccess: (data) => {
      [
        ['diary-posts', auth.user?.username],
        ['trip-diary-posts', data.tripDiary],
      ].forEach((key) => {
        queryClient.setQueryData<Pagination<DiaryPost[]>>(
          key,
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].unshift(data);
            }),
        );
      });
    },
  });
};

export const useDeleteDiaryPost = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/diary-posts/' + id),
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

export const useLikeDiaryPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: DiaryPost) =>
      await axios.post(`/diary-post-likes/${post.id}`),
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
                    diaryPost.likesAmount += 1;
                    diaryPost.isLiked = true;
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
            draft.isLiked = true;
          }),
      );
    },
  });
};

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
                    diaryPost.likesAmount -= 1;
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
