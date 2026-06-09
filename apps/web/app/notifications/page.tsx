"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useNotifications
} from "@/hooks/useNotifications";
import { useState } from "react";

type NotificationItem = {
  id: string;
  type: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data, isLoading, error } = useNotifications(page, 20, unreadOnly);
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();

  const notifications: NotificationItem[] = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge className="text-primary">Notifications</Badge>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Stay current on opportunities and requests</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Track answers, referrals, mentorship requests, matching jobs, and profile activity.
            </p>
          </div>
          <Button variant={unreadOnly ? "primary" : "outline"} onClick={() => setUnreadOnly((value) => !value)}>
            <Bell size={17} />
            {unreadOnly ? "Showing unread" : "Show unread"}
          </Button>
        </div>

        {isLoading ? <div className="mt-8 text-center text-muted-foreground">Loading notifications...</div> : null}
        {error ? <div className="mt-8 text-center text-destructive">Error loading notifications</div> : null}
        {!isLoading && notifications.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <Bell className="mx-auto text-muted-foreground" />
              <h2 className="mt-4 font-bold">No notifications yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                New answers, referrals, mentorship updates, and job matches will appear here.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <div className="mt-8 grid gap-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.readStatus ? "opacity-75" : ""}>
              <CardContent className="flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{notification.type.replaceAll("_", " ")}</Badge>
                    {!notification.readStatus ? <Badge className="bg-success/10 text-success">Unread</Badge> : null}
                  </div>
                  <p className="mt-3 font-semibold">{notification.message}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.readStatus ? (
                    <Button
                      variant="outline"
                      onClick={() => markAsRead.mutate(notification.id)}
                      disabled={markAsRead.isPending}
                    >
                      <CheckCheck size={17} />
                      Read
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    onClick={() => deleteNotification.mutate(notification.id)}
                    disabled={deleteNotification.isPending}
                  >
                    <Trash2 size={17} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pagination && pagination.pages > 1 ? (
          <div className="mt-8 flex justify-center gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="outline">
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {page} of {pagination.pages}
            </span>
            <Button disabled={page === pagination.pages} onClick={() => setPage(page + 1)} variant="outline">
              Next
            </Button>
          </div>
        ) : null}
      </main>
    </>
  );
}
