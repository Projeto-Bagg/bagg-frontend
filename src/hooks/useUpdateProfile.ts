import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (editForm: FormData) =>
      await axios.put<FullInfoUser>('/users', editForm),
    onSuccess(data) {
      if (auth.user?.username !== data.data.username) {
        router.push('/' + data.data.username);
        queryClient.setQueryData(['user', auth.user?.username], null);
      }

      queryClient.setQueryData<FullInfoUser>(['session'], data.data);
      queryClient.setQueryData<FullInfoUser>(['user', data.data.username], data.data);
    },
  });
};
