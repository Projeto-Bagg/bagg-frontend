import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';
import { produce } from 'immer';

export const useFollow = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (followingUsername: string) =>
      await axios.post('/users/following/' + followingUsername),
    onMutate(followingUsername) {
      queryClient.setQueryData<User>(
        ['user', followingUsername],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.isFollowing = true;
            draft.followers += 1;
          }),
      );

      queryClient.setQueryData<User>(
        ['user', auth.user?.username],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.following += 1;
          }),
      );

      ['followers', 'following', 'diaryPostLikedBy'].forEach((tab) => {
        queryClient.setQueriesData<User[]>(
          { queryKey: ['tab'] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((user) => {
                if (user.username === followingUsername) {
                  user.isFollowing = true;
                  user.followers += 1;
                }
              });
            }),
        );
      });

      queryClient.setQueryData<User[]>(
        ['followers', followingUsername],
        (old) =>
          old &&
          produce(old, (draft) => {
            auth.user &&
              draft.findIndex((user) => user.username === auth.user?.username) === -1 &&
              draft.unshift(auth.user);
          }),
      );
    },
  });
};
