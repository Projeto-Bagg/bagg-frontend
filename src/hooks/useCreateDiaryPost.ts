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
