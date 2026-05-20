import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://incase.dmsodiq.xyz";

export const metadata: Metadata = {
  title: "In Case | Emotional Continuity Infrastructure",
  description:
    "A silent guardian for your most important words. Built on trust architecture and zero-knowledge encryption.",
  keywords: [
    "emotional continuity",
    "inactivity trigger",
    "zero-knowledge encryption",
    "trust architecture",
    "encrypted message",
    "privacy-first"
  ],
  openGraph: {
    title: "In Case | Emotional Continuity Infrastructure",
    description:
      "Write a private message. Check in periodically. If life interrupts, we securely deliver it to the people you choose.",
    type: "website",
    url: baseUrl,
    siteName: "In Case",
  },
  twitter: {
    card: "summary_large_image",
    title: "In Case | Emotional Continuity Infrastructure",
    description: "Your passwords are backed up. Your photos are backed up. What about the things you meant to say?",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: baseUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
