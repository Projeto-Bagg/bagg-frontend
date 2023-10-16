import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await axios.delete('/users/profile-pic');
    },
    {
      onSuccess: () => {
        queryClient.setQueryData<User>(
          ['session'],
          (old) =>
            old && {
              ...old,
              image: undefined,
            },
        );
      },
    },
  );
};
