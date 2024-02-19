import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteCityInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cityId: number) => axios.delete('/cityInterests/' + cityId),
    onSuccess: (_, cityId) => {
      queryClient.setQueryData<City>(
        ['city', cityId],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.isInterested = false;
          }),
      );
    },
  });
};
