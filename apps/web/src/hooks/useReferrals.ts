import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch } from "@/lib/api";

export function useReferralsSent(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["referrals", "sent", page, pageSize],
    queryFn: async () => {
      return get("/referrals/sent", { page, pageSize });
    }
  });
}

export function useReferralsReceived(page = 1, pageSize = 20, status?: string) {
  return useQuery({
    queryKey: ["referrals", "received", page, pageSize, status],
    queryFn: async () => {
      return get("/referrals/received", { page, pageSize, ...(status && { status }) });
    }
  });
}

export function useRequestReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return post("/referrals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals", "sent"] });
    }
  });
}

export function useUpdateReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ referralId, status }: any) => {
      return patch(`/referrals/${referralId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
    }
  });
}
