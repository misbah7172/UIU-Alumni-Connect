"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ maxWidth: 460, padding: 24, textAlign: "center" }}>
            <h1>UIU Alumni Connect could not load</h1>
            <p>Please retry the page. If the issue continues, check the API and environment configuration.</p>
            <button onClick={reset}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
