import { useAuth } from '@/context/auth-context';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useUpdateCityVisit = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (visit: CreateCityVisit) =>
      await axios.put<CityVisit>('/city-visits', visit),
    onSuccess(data, variables) {
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

      if (variables.message && variables.rating) {
        queryClient.setQueryData<Pagination<CityVisit[]>>(
          ['city-visits', variables.cityId],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].unshift(data.data);
            }),
        );
      }

      if (variables.message === null && variables.rating === null) {
        queryClient.setQueryData<Pagination<CityVisit[]>>(
          ['city-visits', variables.cityId],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages = draft.pages.map((page) =>
                page.filter((cityVisit) => cityVisit.user.id !== auth.user?.id),
              );
            }),
        );
      }
    },
  });
};
