import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next';
import { produce } from 'immer';
import { useRouter } from 'next/navigation';

interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePassword) =>
      axios.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
  });
};

export const useChangeUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => axios.put('/users/' + username),
    onSuccess: async (_, username) => {
      queryClient.setQueryData<User>(
        ['session'],
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.username = username;
          }),
      );
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (currentPassword: string) =>
      axios.post('/users/delete', {
        currentPassword,
      }),
    onSuccess: () => {
      deleteCookie('bagg.sessionToken');
      deleteCookie('bagg.refreshToken');
      queryClient.setQueryData(['session'], null);

      queryClient.invalidateQueries();

      router.push('/');
    },
  });
};
