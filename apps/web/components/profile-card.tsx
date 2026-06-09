import { Building2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Alumni = {
  name: string;
  role: string;
  company: string;
  department: string;
  focus: string;
};

export function ProfileCard({ person }: { person: Alumni }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-lift">
      <CardContent className="pt-5">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
            {person.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-bold">{person.name}</h3>
              <CheckCircle2 size={16} className="text-success" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{person.role}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Building2 size={16} />
          {person.company}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{person.department}</Badge>
          <Badge className="bg-success/10 text-success">Verified alumni</Badge>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{person.focus}</p>
        <Button className="mt-5 w-full" variant="outline">
          View profile
        </Button>
      </CardContent>
    </Card>
  );
}
