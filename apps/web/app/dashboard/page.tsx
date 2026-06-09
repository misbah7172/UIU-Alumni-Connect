"use client";

import { CalendarClock, CheckCircle2, FileText, Flame, MessageSquareText } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { JobCard } from "@/components/job-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useJobs } from "@/hooks/useJobs";
import { useQuestions } from "@/hooks/useQuestions";
import { useCurrentUser } from "@/hooks/useUsers";

const summaryCards = [
  { label: "Saved jobs", value: "14", icon: FileText },
  { label: "Mentor sessions", value: "3", icon: CalendarClock },
  { label: "Reputation", value: "860", icon: Flame }
];

export default function StudentDashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: jobsData } = useJobs(1, 3);
  const { data: questionsData } = useQuestions(1, 5);

  const jobs = jobsData?.data || [];
  const questions = questionsData?.data || [];

  return (
    <DashboardShell title="Student Dashboard">
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            {summaryCards.map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardContent className="pt-5">
                  <Icon className="text-primary" />
                  <p className="mt-4 text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Personalized feed</h2>
              <p className="text-sm text-muted-foreground">Career updates from alumni and community threads.</p>
            </CardHeader>
            <CardContent className="grid gap-4">
              {questions.map((question: any) => (
                <div key={question.id} className="rounded-md border border-border p-4">
                  <div className="flex gap-3">
                    <MessageSquareText className="mt-1 shrink-0 text-primary" size={18} />
                    <div>
                      <h3 className="font-semibold">{question.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {question.tags?.map((tag: string) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
        <aside className="grid gap-5">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Recommended jobs</h2>
            </CardHeader>
            <CardContent className="grid gap-4">
              {jobs.slice(0, 2).map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Upcoming session</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-md bg-success/10 p-4 text-success">
                <CheckCircle2 />
                <p className="font-semibold">Resume review, Wednesday 8:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}
