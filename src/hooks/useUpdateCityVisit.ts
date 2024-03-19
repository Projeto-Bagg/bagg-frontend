import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUpdateCityVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visit: CreateCityVisit) =>
      await axios.put<CityVisit>('/city-visits', visit),
    onSuccess(_, variables) {
      queryClient.setQueryData<CityPage>(
        ['city', variables.cityId],
        (old) =>
          old &&
          produce(old, (draft) => {
            if (draft.userVisit) {
              draft.userVisit.rating = variables.rating;
              draft.userVisit.message = variables.message;
            }
          }),
      );
    },
  });
};
