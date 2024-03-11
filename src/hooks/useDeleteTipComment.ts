import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

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
