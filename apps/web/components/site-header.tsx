"use client";

import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, Menu, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useState, useEffect } from "react";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/community", label: "Community" },
  { href: "/alumni", label: "Alumni" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/notifications", label: "Notifications" }
];

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap size={22} />
          </span>
          <span className="truncate text-base font-bold">UIU Alumni Connect</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="ghost" size="icon" aria-label="Search">
            <Link href="/jobs">
              <Search size={18} />
            </Link>
          </Button>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">
              <BriefcaseBusiness size={17} />
              Join
            </Link>
          </Button>
        </div>
        <Button variant="outline" size="icon" className="sm:hidden" aria-label="Open menu">
          <Menu size={19} />
        </Button>
      </div>
    </header>
  );
}
