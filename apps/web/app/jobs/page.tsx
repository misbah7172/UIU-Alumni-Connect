"use client";

import { Filter, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJobs } from "@/hooks/useJobs";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<any>({});
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, error } = useJobs(page, 20, { ...filters, search: debouncedSearch || undefined });

  const jobs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge className="text-primary">Job board</Badge>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Career opportunities with alumni support</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Search internships, full-time roles, referrals, and department-specific opportunities.
            </p>
          </div>
          <Button>Post a job</Button>
        </div>
        <div className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              className="pl-10"
              placeholder="Search by role, company, or skill"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button variant="outline">
            <Filter size={17} />
            Filters
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Remote", "Hybrid", "Internship", "Full-time", "Referral available", "CSE", "EEE", "BBA"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setFilters((current: any) => ({ ...current, search: undefined }));
                setSearch(filter);
                setPage(1);
              }}
            >
              <Badge>{filter}</Badge>
            </button>
          ))}
        </div>

        {isLoading && <div className="mt-8 text-center text-muted-foreground">Loading jobs...</div>}
        {error && <div className="mt-8 text-center text-red-500">Error loading jobs</div>}
        {!isLoading && jobs.length === 0 && <div className="mt-8 text-center text-muted-foreground">No jobs found</div>}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {pagination && pagination.pages > 1 && (
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
        )}
      </main>
    </>
  );
}
