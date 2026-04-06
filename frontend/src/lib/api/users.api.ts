import { apiClient } from './client';
import { useAuthStore } from '@/lib/store/auth.store';

function currentUserId(): string {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export const usersApi = {
  updateProfile: (data: { name?: string; phone?: string; country?: string; bio?: string }) =>
    apiClient.patch(`/users/${currentUserId()}`, data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.patch('/auth/change-password', data),
};
