import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';

export const useFollow = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation(
    async (followingUsername: string) =>
      await axios.post('/users/following/' + followingUsername),
    {
      onMutate(followingUsername) {
        queryClient.setQueryData<User>(
          ['user', followingUsername],
          (old) =>
            old && {
              ...old,
              isFollowing: true,
              followers: old.followers + 1,
            },
        );

        queryClient.setQueryData<User>(
          ['user', auth.user?.username],
          (old) =>
            old && {
              ...old,
              following: old.following + 1,
            },
        );

        queryClient.setQueriesData<User[]>(
          ['followers'],
          (old) =>
            old &&
            old.map((user) => {
              if (user.username === followingUsername) {
                return {
                  ...user,
                  isFollowing: true,
                  followers: user.followers + 1,
                };
              }
              return user;
            }),
        );

        queryClient.setQueriesData<User[]>(
          ['following'],
          (old) =>
            old &&
            old.map((user) => {
              if (user.username === followingUsername) {
                return {
                  ...user,
                  isFollowing: true,
                  followers: user.followers + 1,
                };
              }
              return user;
            }),
        );
      },
    },
  );
};
