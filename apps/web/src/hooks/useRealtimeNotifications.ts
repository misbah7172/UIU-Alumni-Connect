"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `userId=eq.${user.id}`
        },
        (payload: any) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          if (payload.eventType === "INSERT") {
            const notification = payload.new;
            showNotificationToast(notification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);
}

function showNotificationToast(notification: any) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("UIU Alumni Connect", {
      body: notification.message,
      icon: "/icon.png"
    });
  }
}

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
