"use client";

import { useRequestReferral } from "@/hooks/useReferrals";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RequestReferralForm({ alumniId, jobId, onSuccess }: { alumniId: string; jobId: string; onSuccess?: () => void }) {
  const requestReferralMutation = useRequestReferral();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await requestReferralMutation.mutateAsync({
        alumniId,
        jobId,
        message
      });
      onSuccess?.();
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to request referral");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <textarea
        placeholder="Tell them why you're a good fit"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={4}
        minLength={20}
        required
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
      <Button disabled={requestReferralMutation.isPending}>{requestReferralMutation.isPending ? "Requesting..." : "Request Referral"}</Button>
    </form>
  );
}
