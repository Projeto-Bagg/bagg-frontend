import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useCreateTip = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (data: FormData) => (await axios.post<Tip>('/tips', data)).data,
    onSuccess: (data) => {
      queryClient.setQueryData<Tip>(['tip', data.id], data);

      [['following-feed'], ['tips', auth.user?.username]].forEach((key) => {
        queryClient.setQueryData<Pagination<Tip[]>>(
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

export const useDeleteTip = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (id: number) => axios.delete('/tips/' + id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['tip', id], null);

      [['following-feed'], ['for-you-feed'], ['tips', auth.user?.username]].forEach(
        (key) => {
          queryClient.setQueryData<Pagination<Tip[]>>(
            key,
            (old) =>
              old &&
              produce(old, (draft) => {
                draft.pages = draft.pages.map((page) =>
                  page.filter((tip) => tip.id !== id),
                );
              }),
          );
        },
      );
    },
  });
};

export const useLikeTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tip: Tip) => await axios.post(`/tip-likes/${tip.id}`),
    onMutate: (data) => {
      ['following-feed', 'for-you-feed', 'tips', 'tip-search'].forEach((tab) =>
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

export const useUnlikeTip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tip: Tip) => await axios.delete(`/tip-likes/${tip.id}`),
    onMutate: (data) => {
      ['following-feed', 'for-you-feed', 'tips', 'tip-search'].forEach((tab) =>
        queryClient.setQueriesData<Pagination<Tip[]>>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
                page.map((tip) => {
                  if (tip.id === data.id) {
                    tip.likesAmount -= 1;
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
            draft.likesAmount -= 1;
          }),
      );
    },
  });
};

interface CreateTipComment {
  tipId: number;
  message: string;
}

export const useCreateTipComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTipComment) =>
      await axios.post<TipComment>('/tip-comments/', {
        message: data.message,
        tipId: data.tipId,
      }),
    onSuccess(response, data) {
      queryClient.setQueryData<TipComment[]>(
        ['tip-comments', data.tipId],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.unshift(response.data);
          }),
      );
    },
  });
};

interface DeleteTipComment {
  tipId: number;
  commentId: number;
}

export const useDeleteTipComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteTipComment) =>
      await axios.delete('/tip-comments/' + data.commentId),
    onSuccess(_, data) {
      queryClient.setQueryData<TipComment[]>(
        ['tip-comments', data.tipId],
        (old) =>
          old &&
          produce(old, (draft) =>
            draft.filter((comment) => comment.id !== data.commentId),
          ),
      );
    },
  });
};
