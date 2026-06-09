import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, patch, del } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ALUMNI" | "ADMIN" | "RECRUITER";
  department?: string;
  batch?: string;
  bio?: string;
  profileImage?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills?: string[];
  studentProfile?: {
    resumeUrl?: string;
    portfolioUrl?: string;
  };
  verified: boolean;
  reputationPoints: number;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await get<{ user: User }>("/users/me");
      return data.user;
    }
  });
}

export function useAlumni(page = 1, pageSize = 20, department?: string) {
  return useQuery({
    queryKey: ["users", "alumni", page, pageSize, department],
    queryFn: async () => {
      return get("/users/alumni", { page, pageSize, ...(department && { department }) });
    }
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return patch("/users/me", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    }
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ["users", userId, "stats"],
    queryFn: async () => {
      return get(`/users/${userId}/stats`);
    }
  });
}
