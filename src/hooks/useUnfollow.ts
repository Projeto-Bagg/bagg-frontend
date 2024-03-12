import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';
import { produce } from 'immer';

export const useUnfollow = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (followingUsername: string) =>
      await axios.delete('/follows/' + followingUsername),
    onMutate(followingUsername) {
      queryClient.setQueryData<User>(
        ['user', followingUsername],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.friendshipStatus.isFollowing = false;
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

      ['followers', 'following', 'diary-post-liked-by'].forEach((tab) => {
        queryClient.setQueriesData<User[]>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.forEach((user) => {
                if (user.username === followingUsername) {
                  user.friendshipStatus.isFollowing = false;
                  user.followers -= 1;
                }
              });
            }),
        );
      });

      queryClient.setQueryData<User[]>(
        ['followers', followingUsername],
        (old) =>
          old &&
          produce(old, (draft) => draft.filter((user) => user.id !== auth.user?.id)),
      );
    },
  });
};
