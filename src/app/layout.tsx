import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import FirstRunGate from "@/components/first-run/first-run-gate"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PXcanvas",
  description: "Content wireframe-ready trong vài phút.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
        <FirstRunGate />
      </body>
    </html>
  )
}
