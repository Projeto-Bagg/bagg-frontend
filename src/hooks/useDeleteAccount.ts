import { useRouter } from '@/common/navigation';
import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCookie } from 'cookies-next';

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
