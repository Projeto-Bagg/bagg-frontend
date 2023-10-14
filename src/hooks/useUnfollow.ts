import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';

export const useUnFollow = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (followingUsername: string) =>
      await axios.delete('/users/following/' + followingUsername),
    {
      onMutate(followingUsername) {
        queryClient.setQueryData<FriendshipStatus>(
          ['friendship', followingUsername],
          (old) =>
            old && {
              ...old,
              following: false,
            },
        );

        queryClient.setQueryData<User>(
          ['user', followingUsername],
          (old) =>
            old && {
              ...old,
              followers: old.followers - 1,
            },
        );
      },
    },
  );
};
