"use client";

import { useCreateQuestion } from "@/hooks/useQuestions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateQuestionForm({ onSuccess }: { onSuccess?: () => void }) {
  const createQuestionMutation = useCreateQuestion();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createQuestionMutation.mutateAsync({
        title: formData.title,
        body: formData.body,
        tags: formData.tags.split(",").map((t) => t.trim())
      });
      onSuccess?.();
      setFormData({ title: "", body: "", tags: "" });
    } catch (err: any) {
      setError(err.message || "Failed to create question");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input placeholder="Question Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required minLength={10} />
      <textarea
        placeholder="Question Details"
        value={formData.body}
        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={6}
        required
        minLength={20}
      />
      <Input placeholder="Tags (comma separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} required />
      {error && <div className="text-sm text-red-500">{error}</div>}
      <Button disabled={createQuestionMutation.isPending}>{createQuestionMutation.isPending ? "Posting..." : "Post Question"}</Button>
    </form>
  );
}
