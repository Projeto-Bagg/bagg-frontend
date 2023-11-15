import { CreateTripDiaryType } from '@/components/create-trip-diary';
import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useCreateTripDiary = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTripDiaryType) =>
      (await axios.post<TripDiary>('tripDiaries', data)).data,
    onSuccess: (data: TripDiary) => {
      queryClient.setQueryData<TripDiary[]>(
        ['tripDiaries', auth.user?.username],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.unshift(data);
          }),
      );
    },
  });
};
