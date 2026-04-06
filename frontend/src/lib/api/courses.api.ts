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

  updateSection: (sectionId: string, data: { title?: string; order?: number }) =>
    apiClient.patch(`/sections/${sectionId}`, data),

  deleteSection: (sectionId: string) =>
    apiClient.delete(`/sections/${sectionId}`),

  createLesson: (sectionId: string, data: Record<string, unknown>) =>
    apiClient.post(`/lessons/section/${sectionId}`, data),

  updateLesson: (lessonId: string, data: Record<string, unknown>) =>
    apiClient.patch(`/lessons/${lessonId}`, data),

  deleteLesson: (lessonId: string) =>
    apiClient.delete(`/lessons/${lessonId}`),
};

export const enrollmentsApi = {
  mine: () => apiClient.get('/enrollments/my'),
  markComplete: (enrollmentId: string, lessonId: string) =>
    apiClient.post(`/enrollments/${enrollmentId}/lessons/${lessonId}/complete`),
};
