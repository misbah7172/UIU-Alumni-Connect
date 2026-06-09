import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";

export function useJobs(page = 1, pageSize = 20, filters?: any) {
  return useQuery({
    queryKey: ["jobs", page, pageSize, filters],
    queryFn: async () => {
      return get("/jobs", { page, pageSize, ...filters });
    }
  });
}

export function useJobDetail(jobId: string) {
  return useQuery({
    queryKey: ["jobs", jobId],
    queryFn: async () => {
      return get(`/jobs/${jobId}`);
    }
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return post("/jobs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    }
  });
}
