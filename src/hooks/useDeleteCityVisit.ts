import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteCityVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cityId }: { cityId: number }) =>
      await axios.delete('/city-visits/' + cityId),
    onSuccess(_, { cityId }) {
      queryClient.setQueryData<City>(
        ['city', cityId],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.userVisit = null;
          }),
      );
    },
  });
};
