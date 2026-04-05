import { apiClient } from './client';

export interface AuthResult {
  user: {
    id: string; name: string; email: string; role: string; avatarUrl?: string;
  };
  tokens: { accessToken: string; refreshToken: string };
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<unknown, { data: AuthResult }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<unknown, { data: AuthResult }>('/auth/login', data),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  me: () => apiClient.get<unknown, { data: AuthResult['user'] }>('/auth/me'),

  refresh: (refreshToken: string) =>
    apiClient.post<unknown, { data: { accessToken: string; refreshToken: string } }>(
      '/auth/refresh',
      { refreshToken },
    ),
};
