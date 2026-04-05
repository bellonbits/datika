import { apiClient } from './client';

export const paymentsApi = {
  initiate: (data: { courseId: string; phoneNumber: string }) =>
    apiClient.post('/payments/initiate', data),

  checkStatus: (paymentId: string) =>
    apiClient.get(`/payments/status/${paymentId}`),

  getRevenue: () =>
    apiClient.get('/payments/admin/revenue'),
};
