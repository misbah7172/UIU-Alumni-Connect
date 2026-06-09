"use client";

import { useCreateJob } from "@/hooks/useJobs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateJobForm({ onSuccess }: { onSuccess?: () => void }) {
  const createJobMutation = useCreateJob();
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    description: "",
    location: "",
    employmentType: "FULL_TIME",
    requiredSkills: "",
    salaryRange: "",
    referralAvailable: false,
    applyLink: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createJobMutation.mutateAsync({
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim())
      });
      onSuccess?.();
      setFormData({
        companyName: "",
        jobTitle: "",
        description: "",
        location: "",
        employmentType: "FULL_TIME",
        requiredSkills: "",
        salaryRange: "",
        referralAvailable: false,
        applyLink: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to create job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input placeholder="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
      <Input placeholder="Job Title" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} required />
      <textarea
        placeholder="Job Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        rows={4}
        required
      />
      <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
      <select
        value={formData.employmentType}
        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="INTERNSHIP">Internship</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="CONTRACT">Contract</option>
      </select>
      <Input placeholder="Required Skills (comma separated)" value={formData.requiredSkills} onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })} />
      <Input placeholder="Salary Range" value={formData.salaryRange} onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })} />
      <Input placeholder="Apply Link" value={formData.applyLink} onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })} type="url" />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.referralAvailable}
          onChange={(e) => setFormData({ ...formData, referralAvailable: e.target.checked })}
        />
        <span>Referral available</span>
      </label>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <Button disabled={createJobMutation.isPending}>{createJobMutation.isPending ? "Creating..." : "Create Job"}</Button>
    </form>
  );
}
