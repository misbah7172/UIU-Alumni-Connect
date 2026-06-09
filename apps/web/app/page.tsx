import Link from "next/link";
import { ArrowRight, Network, Sparkles, UsersRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/job-card";
import { ProfileCard } from "@/components/profile-card";
import { SectionHeading } from "@/components/section-heading";
import { featuredAlumni, jobs, stats } from "@/lib/data";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-shell grid min-h-[calc(100vh-64px)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Badge className="border-primary/20 bg-primary/10 text-primary">University career network</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Build your future with verified UIU alumni.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Connect students, alumni, mentors, and recruiters through trusted profiles, referrals, mentorship,
              jobs, and career-focused community discussions.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/register">
                  Join the network
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/jobs">Explore jobs</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-background p-4">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-primary p-5 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <Network />
                  <p className="font-bold">Live career graph</p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {["Students", "Alumni", "Mentors"].map((item) => (
                    <div key={item} className="rounded-md bg-white/12 p-3 text-sm font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/60 py-14">
          <div className="page-shell grid gap-5 md:grid-cols-3">
            {[
              ["Trusted identity", "Supabase Auth, verification flows, and role-aware experiences."],
              ["Career momentum", "Jobs, referrals, saved roles, mentor bookings, and recommendations."],
              ["Community knowledge", "Q&A threads, reputation, badges, and moderated discussions."]
            ].map(([title, body]) => (
              <Card key={title}>
                <CardContent className="pt-5">
                  <Sparkles className="text-accent" size={22} />
                  <h3 className="mt-4 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-shell py-16">
          <SectionHeading
            eyebrow="Featured alumni"
            title="Learn from graduates building global careers"
            description="Verified alumni can mentor students, answer questions, post opportunities, and support referrals."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredAlumni.map((person) => (
              <ProfileCard key={person.name} person={person} />
            ))}
          </div>
        </section>

        <section className="bg-card/70 py-16">
          <div className="page-shell">
            <SectionHeading
              eyebrow="Opportunities"
              title="Jobs and referrals surfaced through alumni trust"
              description="Compact, skill-tagged cards keep opportunities easy to scan on every device."
            />
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.title} job={job} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell grid gap-8 py-16 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Mentorship"
              title="Book practical guidance from people who already walked the path"
              description="Students get clear availability, session history, and role-specific mentor recommendations."
            />
            <Button asChild className="mt-6" variant="secondary">
              <Link href="/mentorship">Find a mentor</Link>
            </Button>
          </div>
          <Card>
            <CardContent className="grid gap-4 pt-5">
              {["Resume review with alumni", "Backend interview prep circle", "Higher studies planning"].map((session) => (
                <div key={session} className="flex items-center justify-between rounded-md border border-border p-4">
                  <div className="flex items-center gap-3">
                    <UsersRound className="text-primary" />
                    <span className="font-semibold">{session}</span>
                  </div>
                  <Badge>Open</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="border-t border-border py-8">
        <div className="page-shell flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>UIU Alumni Connect</p>
          <p>Built for students, alumni, mentors, recruiters, and administrators.</p>
        </div>
      </footer>
    </>
  );
}
