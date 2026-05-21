"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: "32rem", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>PXcanvas crashed</h2>
        <p style={{ marginTop: "0.5rem", color: "#666", fontSize: "0.875rem" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p style={{ marginTop: "0.25rem", color: "#999", fontSize: "0.75rem" }}>
            Digest: {error.digest}
          </p>
        )}
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 0.875rem",
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              padding: "0.5rem 0.875rem",
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Go home
          </a>
        </div>
      </body>
    </html>
  )
}
