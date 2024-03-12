import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useDeleteProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => await axios.delete('/users/profile-pic'),
    onSuccess: () => {
      queryClient.setQueryData<User>(
        ['session'],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.image = undefined;
          }),
      );
    },
  });
};
