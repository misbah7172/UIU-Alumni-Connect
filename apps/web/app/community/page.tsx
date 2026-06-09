"use client";

import { MessageSquareText, Search, TrendingUp } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuestions } from "@/hooks/useQuestions";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function CommunityPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data, isLoading, error } = useQuestions(page, 20, debouncedSearch);

  const questions = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <SiteHeader />
      <main className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge className="text-primary">Q&A Community</Badge>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Ask, answer, and grow together</h1>
            </div>
            <Button>Ask question</Button>
          </div>
          <div className="relative mt-8">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              className="pl-10"
              placeholder="Search career, interview, research, and resume discussions"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {isLoading && <div className="mt-8 text-center text-muted-foreground">Loading questions...</div>}
          {error && <div className="mt-8 text-center text-red-500">Error loading questions</div>}
          {!isLoading && questions.length === 0 && <div className="mt-8 text-center text-muted-foreground">No questions found</div>}

          <div className="mt-6 grid gap-4">
            {questions.map((question: any) => (
              <Card key={question.id}>
                <CardContent className="grid gap-4 pt-5 sm:grid-cols-[100px_1fr]">
                  <div className="flex gap-3 text-sm sm:grid sm:gap-2">
                    <Badge>{question.answers?.length || 0} answers</Badge>
                  </div>
                  <div>
                    <h2 className="font-bold">{question.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Alumni and students are sharing practical guidance, examples, and next steps.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.tags?.map((tag: string) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </div>
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
        </section>
        <aside className="grid h-fit gap-5">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary" />
                <h2 className="font-bold">Popular topics</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Interview Prep", "Resume Review", "Higher Studies", "Internships", "Research"].map((topic) => (
                  <Badge key={topic}>{topic}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <MessageSquareText className="text-accent" />
              <h2 className="mt-3 font-bold">Community standards</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Verified identities, moderation queues, and report workflows keep discussions useful and respectful.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  );
}
