"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The page could not finish loading. You can retry the request, and the app will keep your session intact.
          </p>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-4 rounded-md bg-muted p-3 text-left text-xs text-muted-foreground">{error.message}</p>
          ) : null}
          <Button className="mt-6" onClick={reset}>
            <RotateCcw size={17} />
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
