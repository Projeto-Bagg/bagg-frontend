import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useCreateCityVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visit: CreateCityVisit) =>
      await axios.post<CityVisit>('/city-visits', visit),
    onSuccess(data, variables) {
      queryClient.setQueryData<CityPage>(
        ['city', variables.cityId],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.userVisit = data.data;
            draft.visitsCount += 1;
          }),
      );

      if (data.data.message && data.data.rating) {
        queryClient.setQueryData<Pagination<CityVisit[]>>(
          ['city-visits', variables.cityId],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].unshift(data.data);
            }),
        );
      }
    },
  });
};
