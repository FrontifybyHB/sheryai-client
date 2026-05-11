import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  generateQuiz,
  getLesson,
  getLessons,
  getLessonStatus,
  ingestYoutubeLesson,
  regenerateChapters,
  uploadLesson,
} from '../services/api';

export const lessonKeys = {
  all: ['lessons'],
  list: (courseId) => [...lessonKeys.all, 'list', courseId],
  detail: (lessonId) => [...lessonKeys.all, 'detail', lessonId],
  status: (lessonId) => [...lessonKeys.all, 'status', lessonId],
};

export function useLessonsQuery(courseId, options = {}) {
  return useQuery({
    queryKey: lessonKeys.list(courseId),
    queryFn: () => getLessons(courseId),
    enabled: Boolean(courseId),
    ...options,
  });
}

export function useLessonQuery(lessonId, options = {}) {
  return useQuery({
    queryKey: lessonKeys.detail(lessonId),
    queryFn: () => getLesson(lessonId),
    enabled: Boolean(lessonId),
    ...options,
  });
}

export function useLessonStatusQuery(lessonId, enabled = true) {
  return useQuery({
    queryKey: lessonKeys.status(lessonId),
    queryFn: () => getLessonStatus(lessonId),
    enabled: Boolean(lessonId) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'ready' || status === 'failed' ? false : 3000;
    },
  });
}

export function useIngestYoutubeLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ingestYoutubeLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
  });
}

export function useUploadLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadLesson,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
  });
}

export function useRegenerateChaptersMutation(lessonId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateChapters(lessonId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonKeys.detail(lessonId) }),
  });
}

export function useGenerateQuizMutation() {
  return useMutation({
    mutationFn: ({ lessonId, count, type = 'mcq', difficulty = 'mixed' }) => generateQuiz(lessonId, count, type, difficulty),
  });
}
