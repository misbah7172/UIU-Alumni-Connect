"use client";

import { useBookMentorSession } from "@/hooks/useMentorship";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BookMentorForm({ mentorId }: { mentorId: string }) {
  const bookSessionMutation = useBookMentorSession();
  const [meetingTime, setMeetingTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await bookSessionMutation.mutateAsync({
        mentorId,
        meetingTime: new Date(meetingTime)
      });
      setMeetingTime("");
    } catch (err: any) {
      setError(err.message || "Failed to book session");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input type="datetime-local" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} required />
      {error && <div className="text-sm text-red-500">{error}</div>}
      <Button disabled={bookSessionMutation.isPending}>{bookSessionMutation.isPending ? "Booking..." : "Book Session"}</Button>
    </form>
  );
}
