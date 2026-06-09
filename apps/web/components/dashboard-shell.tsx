import Link from "next/link";
import {
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Users
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Student", icon: LayoutDashboard },
  { href: "/dashboard/alumni", label: "Alumni", icon: BriefcaseBusiness },
  { href: "/jobs", label: "Jobs", icon: BookOpenCheck },
  { href: "/community", label: "Q&A", icon: MessageSquareText },
  { href: "/alumni", label: "Directory", icon: Users },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function DashboardShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-card lg:block">
          <div className="sticky top-0 flex h-screen flex-col gap-6 p-5">
            <Link href="/" className="text-lg font-bold text-primary">
              UIU Alumni Connect
            </Link>
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main>
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <h1 className="text-lg font-bold sm:text-xl">{title}</h1>
              <div className="flex items-center gap-3">
                <button className="rounded-md border border-border bg-card p-2 text-muted-foreground transition hover:text-foreground">
                  <Bell size={18} />
                </button>
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold">
                  U
                </div>
              </div>
            </div>
          </header>
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
