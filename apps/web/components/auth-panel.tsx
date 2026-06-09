"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { useState } from "react";

export function AuthPanel({ mode }: { mode: "login" | "register" | "forgot" }) {
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const router = useRouter();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
    role: "STUDENT"
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await registerMutation.mutateAsync({
          email: formData.email,
          name: formData.name,
          role: formData.role,
          department: formData.department
        });
        router.push("/dashboard");
      } else if (isForgot) {
        setError("Password reset link sent to your email");
      } else {
        await loginMutation.mutateAsync(formData.email);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-3 text-primary">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap size={23} />
            </span>
            <span className="font-bold">UIU Alumni Connect</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {isForgot ? "Reset your password" : isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isForgot
                ? "Enter your university email to receive a secure reset link."
                : "Use your verified university identity to continue."}
            </p>
          </div>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            {isRegister ? (
              <Input placeholder="Full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} autoComplete="name" />
            ) : null}
            <Input
              placeholder="University email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
              required
            />
            {!isForgot && isRegister ? (
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="ALUMNI">Alumni</option>
              </select>
            ) : null}
            {!isForgot ? (
              <Input
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
            ) : null}
            {isRegister ? (
              <Input
                placeholder="Department and batch"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            ) : null}
            {error && <div className="text-sm text-red-500">{error}</div>}
            <Button size="lg" disabled={isLoading}>
              {isLoading ? "Loading..." : isForgot ? "Send reset link" : isRegister ? "Create account" : "Login"}
            </Button>
          </form>
          <div className="mt-5 flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
            <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-primary">
              {isRegister ? "Login" : "Register"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

