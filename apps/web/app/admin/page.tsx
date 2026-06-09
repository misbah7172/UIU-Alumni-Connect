import { AlertTriangle, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const adminMetrics = [
  { label: "Users", value: "24.6k", icon: Users },
  { label: "Verification queue", value: "86", icon: ShieldCheck },
  { label: "Reports", value: "17", icon: AlertTriangle },
  { label: "Monthly activity", value: "92%", icon: BarChart3 }
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Dashboard">
      <div className="grid gap-5 md:grid-cols-4">
        {adminMetrics.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <Icon className="text-primary" />
              <p className="mt-4 text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <CardHeader>
          <h2 className="text-lg font-bold">Moderation workflow</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="border-b border-border p-3">Item</th>
                <th className="border-b border-border p-3">Type</th>
                <th className="border-b border-border p-3">Risk</th>
                <th className="border-b border-border p-3">Status</th>
                <th className="border-b border-border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {["Alumni verification", "Reported answer", "Suspicious job post"].map((item, index) => (
                <tr key={item}>
                  <td className="border-b border-border p-3 font-semibold">{item}</td>
                  <td className="border-b border-border p-3">{index === 0 ? "Identity" : "Content"}</td>
                  <td className="border-b border-border p-3">
                    <Badge className={index === 2 ? "bg-destructive/10 text-destructive" : ""}>{index === 2 ? "High" : "Medium"}</Badge>
                  </td>
                  <td className="border-b border-border p-3">Pending review</td>
                  <td className="border-b border-border p-3">
                    <Button size="sm">Open</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
