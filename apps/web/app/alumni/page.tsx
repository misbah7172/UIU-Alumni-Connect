"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAlumni } from "@/hooks/useUsers";
import { useState } from "react";

export default function AlumniDirectoryPage() {
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState<string>();
  const { data, isLoading, error } = useAlumni(page, 20, department);

  const alumni = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <Badge className="text-primary">Alumni directory</Badge>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Find verified alumni by company, department, and batch</h1>
        <div className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input className="pl-10" placeholder="Search alumni, company, skill, or batch" />
          </div>
          <Button variant="outline">
            <SlidersHorizontal size={17} />
            Filters
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["CSE", "EEE", "BBA", "2010-2015", "2016-2020", "Mentorship available", "Verified"].map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>

        {isLoading && <div className="mt-8 text-center text-muted-foreground">Loading alumni...</div>}
        {error && <div className="mt-8 text-center text-red-500">Error loading alumni</div>}
        {!isLoading && alumni.length === 0 && <div className="mt-8 text-center text-muted-foreground">No alumni found</div>}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {alumni.map((person: any) => (
            <ProfileCard key={person.id} person={person} />
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
