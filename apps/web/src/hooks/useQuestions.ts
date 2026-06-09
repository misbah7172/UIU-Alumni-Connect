import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";

export function useQuestions(page = 1, pageSize = 20, search?: string) {
  return useQuery({
    queryKey: ["questions", page, pageSize, search],
    queryFn: async () => {
      return get("/questions", { page, pageSize, ...(search && { search }) });
    }
  });
}

export function useQuestionDetail(questionId: string) {
  return useQuery({
    queryKey: ["questions", questionId],
    queryFn: async () => {
      return get(`/questions/${questionId}`);
    },
    enabled: !!questionId
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return post("/questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    }
  });
}

export function useCreateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, answerBody }: any) => {
      return post(`/questions/${questionId}/answers`, { answerBody });
    },
    onSuccess: (_, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: ["questions", questionId] });
    }
  });
}
