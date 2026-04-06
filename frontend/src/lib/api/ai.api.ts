import { apiClient } from './client';

export const aiApi = {
  // Notes
  generateNotes: (data: {
    topic: string;
    subject?: string;
    level?: string;
    context?: string;
  }) => apiClient.post('/ai/notes/generate', data),

  getNotes: (id: string) => apiClient.get(`/ai/notes/${id}`),
  myNotes: () => apiClient.get('/ai/notes'),

  // Quiz
  generateQuiz: (data: {
    topic: string;
    content: string;
    difficulty?: string;
    questionCount?: number;
    timeLimitSeconds?: number;
  }) => apiClient.post('/ai/quiz/generate', data),

  getQuiz: (id: string) => apiClient.get(`/ai/quiz/${id}`),

  // Grading
  gradeSubmission: (data: {
    taskDescription: string;
    submission: string;
    submissionType: 'sql' | 'python' | 'written';
    expectedOutput?: string;
    submissionId?: string;
  }) => apiClient.post('/ai/grade', data),

  // Chat
  sendMessage: (data: {
    message: string;
    sessionId?: string;
    courseId?: string;
    courseContext?: string;
  }) => apiClient.post('/ai/chat', data),

  getChatSessions: () => apiClient.get('/ai/chat/sessions'),
  getChatSession: (id: string) => apiClient.get(`/ai/chat/sessions/${id}`),
  
  // Course
  generateCourseMetadata: (data: { prompt: string; duration?: string; amount?: number; context?: string }) =>
    apiClient.post('/ai/course/generate', data),
};
