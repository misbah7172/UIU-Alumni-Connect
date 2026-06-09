import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch } from "@/lib/api";

export function useMentors(page = 1, pageSize = 20, search?: string) {
  return useQuery({
    queryKey: ["mentorship", "mentors", page, pageSize, search],
    queryFn: async () => {
      return get("/mentorship/mentors", { page, pageSize, search });
    }
  });
}

export function useMentorshipSessions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["mentorship", "sessions", page, pageSize],
    queryFn: async () => {
      return get("/mentorship/sessions", { page, pageSize });
    }
  });
}

export function useBookMentorSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return post("/mentorship/sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorship", "sessions"] });
    }
  });
}

export function useUpdateMentorshipSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, status }: any) => {
      return patch(`/mentorship/sessions/${sessionId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorship", "sessions"] });
    }
  });
}
