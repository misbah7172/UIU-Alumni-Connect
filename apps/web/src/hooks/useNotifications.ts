import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, patch, del } from "@/lib/api";

export function useNotifications(page = 1, pageSize = 20, unreadOnly = false) {
  return useQuery({
    queryKey: ["notifications", page, pageSize, unreadOnly],
    queryFn: async () => {
      return get("/notifications", { page, pageSize, unread: unreadOnly });
    },
    refetchInterval: 10000
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return patch(`/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return del(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}
