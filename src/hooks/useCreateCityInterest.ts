import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useCreateCityInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cityId: number) => axios.post('/city-interests/' + cityId),
    onSuccess: (_, cityId) => {
      queryClient.setQueryData<CityPage>(
        ['city', cityId],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.isInterested = true;
            draft.interestsCount += 1;
          }),
      );
    },
  });
};
