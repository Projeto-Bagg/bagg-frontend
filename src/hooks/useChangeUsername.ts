import axios from '@/services/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { produce } from 'immer';

export const useChangeUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => axios.put('/users/' + username),
    onSuccess: async (_, username) => {
      const refreshToken = getCookie('bagg.refreshToken');

      try {
        const response = await axios.post('/auth/refresh', { refreshToken });
        setCookie('bagg.sessionToken', response.data.accessToken);
        setCookie('bagg.refreshToken', response.data.refreshToken);
      } catch (error) {
        deleteCookie('bagg.sessionToken');
        deleteCookie('bagg.refreshToken');
      }

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
