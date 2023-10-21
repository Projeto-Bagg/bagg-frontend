import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';
import { produce } from 'immer';

export const useUnfollow = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation(
    async (followingUsername: string) =>
      await axios.delete('/users/following/' + followingUsername),
    {
      onMutate(followingUsername) {
        queryClient.setQueryData<User>(
          ['user', followingUsername],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.isFollowing = false;
              draft.followers -= 1;
            }),
        );

        queryClient.setQueryData<User>(
          ['user', auth.user?.username],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.following -= 1;
            }),
        );

        ['followers', 'following'].forEach((tab) => {
          queryClient.setQueriesData<User[]>(
            [tab],
            (old) =>
              old &&
              produce(old, (draft) => {
                draft.forEach((user) => {
                  if (user.username === followingUsername) {
                    user.isFollowing = false;
                    user.followers -= 1;
                  }
                });
              }),
          );
        });
      },
    },
  );
};
