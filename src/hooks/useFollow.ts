import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';
import { produce } from 'immer';

export const useFollow = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (user: User) => await axios.post('/follows/' + user.id),
    onMutate(followedUser) {
      queryClient.setQueryData<FullInfoUser>(
        ['user', followedUser.username],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.friendshipStatus.isFollowing = true;
            draft.followers += 1;
          }),
      );

      queryClient.setQueryData<FullInfoUser>(
        ['user', auth.user?.username],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.following += 1;
          }),
      );

      ['followers', 'following', 'diary-post-liked-by'].forEach((tab) => {
        queryClient.setQueriesData<FullInfoUser[]>(
          { queryKey: [tab] },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.map((user) => {
                if (user.username === followedUser.username) {
                  user.friendshipStatus.isFollowing = true;
                  user.followers += 1;
                }
              });
            }),
        );
      });

      queryClient.setQueriesData<Pagination<User[]>>(
        {
          queryKey: ['city', 'residents'],
        },
        (old) =>
          produce(old, (draft) => {
            draft?.pages.map((page) =>
              page.map((user) => {
                if (user.username === followedUser.username) {
                  user.friendshipStatus.isFollowing = true;
                }
              }),
            );
          }),
      );

      queryClient.setQueryData<User[]>(
        ['followers', followedUser.username],
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
