import { BarChart3, Handshake, Inbox, PenSquare } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const alumniMetrics = [
  { label: "Active jobs", value: "7", icon: PenSquare },
  { label: "Referral requests", value: "18", icon: Handshake },
  { label: "Mentorship requests", value: "9", icon: Inbox },
  { label: "Profile views", value: "1.8k", icon: BarChart3 }
];

export default function AlumniDashboardPage() {
  return (
    <DashboardShell title="Alumni Dashboard">
      <div className="grid gap-5 md:grid-cols-4">
        {alumniMetrics.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <Icon className="text-primary" />
              <p className="mt-4 text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">Referral queue</h2>
          </CardHeader>
          <CardContent className="grid gap-3">
            {["Frontend Engineer Intern", "Junior Backend Engineer", "Product Analyst"].map((role) => (
              <div key={role} className="flex flex-col justify-between gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold">{role}</h3>
                  <p className="text-sm text-muted-foreground">Student profile match above 82%</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Decline</Button>
                  <Button>Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-bold">Engagement</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Answers accepted", "Students mentored", "Jobs filled"].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{item}</span>
                  <Badge>{78 - index * 12}%</Badge>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${78 - index * 12}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
