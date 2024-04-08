import axios from '@/services/axios';
import { useMutation } from '@tanstack/react-query';

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
