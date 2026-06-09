"use client";

import { CalendarPlus, Clock, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMentors } from "@/hooks/useMentorship";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function MentorshipPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, error } = useMentors(page, 20, debouncedSearch);

  const mentors = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <SiteHeader />
      <main className="page-shell py-10">
        <Badge className="text-primary">Mentorship</Badge>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Book guidance with trusted UIU alumni</h1>
        <div className="relative mt-8">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            className="pl-10"
            placeholder="Search mentors by role, skill, company, or availability"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading && <div className="mt-8 text-center text-muted-foreground">Loading mentors...</div>}
        {error && <div className="mt-8 text-center text-red-500">Error loading mentors</div>}
        {!isLoading && mentors.length === 0 && <div className="mt-8 text-center text-muted-foreground">No mentors available</div>}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((mentor: any) => (
            <Card key={mentor.id}>
              <CardContent className="pt-5">
                <div className="grid h-12 w-12 place-items-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
                  {mentor.name?.charAt(0)}
                </div>
                <h2 className="mt-4 font-bold">{mentor.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{mentor.alumniProfile?.position}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
                  <Clock size={16} />
                  Available
                </div>
                <Button className="mt-5 w-full">
                  <CalendarPlus size={17} />
                  Book session
                </Button>
              </CardContent>
            </Card>
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
