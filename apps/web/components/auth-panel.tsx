"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGoogleLogin } from "@/hooks/useAuth";
import { useState } from "react";

export function AuthPanel({ mode }: { mode: "login" | "register" | "forgot" }) {
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const router = useRouter();
  const googleLogin = useGoogleLogin();
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");

    try {
      await googleLogin.mutateAsync();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const isLoading = googleLogin.isPending;

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
              {isRegister ? "Create your account" : isForgot ? "Google manages your password" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isForgot
                ? "Use Google account recovery for your UIU email."
                : "Continue with your Google account ending in .uiu.ac.bd."}
            </p>
          </div>
          <div className="mt-6 grid gap-4">
            <Button size="lg" onClick={handleGoogleLogin} disabled={isLoading}>
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>
            <p className="rounded-md border border-border bg-muted p-3 text-center text-sm text-muted-foreground">
              Only Google accounts ending with <span className="font-semibold text-foreground">.uiu.ac.bd</span> can sign in.
            </p>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
          <div className="mt-5 flex items-center justify-center text-sm">
            <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-primary">
              {isRegister ? "Already have access? Login" : "New here? Continue with Google"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
