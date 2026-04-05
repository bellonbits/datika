import { apiClient } from './client';

export const coursesApi = {
  list: (params?: { page?: number; limit?: number; level?: string; search?: string }) =>
    apiClient.get('/courses', { params }),

  findOne: (id: string) =>
    apiClient.get(`/courses/${id}`),

  myCourses: () =>
    apiClient.get('/courses/my-courses'),

  create: (data: Record<string, unknown>) =>
    apiClient.post('/courses', data),

  update: (id: string, data: Record<string, unknown>) =>
    apiClient.patch(`/courses/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/courses/${id}`),

  createSection: (courseId: string, data: { title: string; order: number }) =>
    apiClient.post(`/courses/${courseId}/sections`, data),
};

export const enrollmentsApi = {
  mine: () => apiClient.get('/enrollments/my'),
  markComplete: (enrollmentId: string, lessonId: string) =>
    apiClient.post(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`),
};
