import { apiClient, directApiClient } from '../api/httpClient';
import { API_BASE_URL, API_DIRECT_URL, buildApiUrl } from '../config/env';

export const BASE_URL = API_BASE_URL;
export const DIRECT_URL = API_DIRECT_URL;
export { buildApiUrl };

export async function ingestYoutubeLesson(payload) {
  return apiClient.post('/api/lessons/ingest-youtube', payload);
}

export async function uploadLesson(formData) {
  return directApiClient.post('/api/lessons/upload', formData);
}

export async function getLessonStatus(lessonId) {
  return apiClient.get(`/api/lessons/${lessonId}/status`);
}

export async function getLesson(lessonId) {
  return apiClient.get(`/api/lessons/${lessonId}`);
}

export async function regenerateChapters(lessonId) {
  return apiClient.post(`/api/lessons/${lessonId}/regenerate-chapters`);
}

export async function getLessons(courseId) {
  const data = await apiClient.get('/api/lessons', {
    params: { courseId },
  });

  if (data.lessons) {
    data.lessons = data.lessons.map((lesson) => ({ ...lesson, id: lesson.id || lesson.lessonId }));
  }

  return data;
}

export async function getLessonTranscript(lessonId) {
  return apiClient.get(`/api/lessons/${lessonId}/transcript`);
}

export async function checkHealth() {
  return apiClient.get('/api/health');
}

export async function getChatSession(lessonId) {
  return apiClient.get(`/api/chat/session/${lessonId}`);
}

export async function deleteChatSession(sessionId) {
  return apiClient.delete(`/api/chat/session/${sessionId}`);
}

export async function getLectureSummary(lessonId, type = 'full', startTime = 0, endTime = 0) {
  return apiClient.post('/api/chat/summary', { lessonId, type, startTime, endTime });
}

export async function generateQuiz(lessonId, count = 5, type = 'mcq', difficulty = 'mixed') {
  return apiClient.post('/api/chat/quiz', { lessonId, count, type, difficulty });
}

export async function streamChat(payload, signal) {
  return fetch(buildApiUrl('/api/chat/stream'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-demo-role': localStorage.getItem('demo_role') || 'student',
    },
    body: JSON.stringify(payload),
    signal,
  });
}
