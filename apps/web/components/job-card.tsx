import { Bookmark, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Job = {
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string[];
  deadline: string;
};

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-lift">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold">{job.title}</h3>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">{job.company}</p>
          </div>
          <button className="rounded-md border border-border p-2 text-muted-foreground transition hover:text-primary" aria-label="Bookmark job">
            <Bookmark size={17} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin size={15} />
            {job.location}
          </span>
          <Badge>{job.type}</Badge>
          <Badge className="border-accent/30 bg-accent/10 text-foreground">Deadline {job.deadline}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <Button className="mt-5 w-full">Apply with referral</Button>
      </CardContent>
    </Card>
  );
}
