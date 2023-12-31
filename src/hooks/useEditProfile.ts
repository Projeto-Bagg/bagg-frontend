import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/services/axios';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const route = useRouter();

  return useMutation({
    mutationFn: async (editForm: FormData) => await axios.put<User>('/users', editForm),
    onSuccess(data) {
      if (auth.user?.username !== data.data.username) {
        route.push('/' + data.data.username);
        queryClient.setQueryData(['user', auth.user?.username], null);
      }

      queryClient.setQueryData<User>(['session'], data.data);
      queryClient.setQueryData<User>(['user', data.data.username], data.data);
    },
  });
};
