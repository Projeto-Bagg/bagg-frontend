import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';

export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (followingUsername: string) =>
      await axios.post('/users/following/' + followingUsername),
    {
      onMutate(followingUsername) {
        queryClient.setQueryData<FriendshipStatus>(
          ['friendship', followingUsername],
          (old) =>
            old && {
              ...old,
              following: true,
            },
        );

        queryClient.setQueryData<User>(
          ['user', followingUsername],
          (old) =>
            old && {
              ...old,
              followers: old.followers + 1,
            },
        );
      },
    },
  );
};
