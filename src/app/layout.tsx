import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "In Case: For the things people should hear",
  description:
    "Write a private message. Choose your check-in period. If you stop checking in, we'll deliver it securely to the people you choose.",
  keywords: [
    "encrypted message",
    "digital legacy",
    "dead man's switch",
    "zero-knowledge encryption",
    "legacy message",
    "inactivity trigger",
    "emotional continuity",
    "in case app",
  ],
  openGraph: {
    title: "In Case: For the things people should hear, even if you never get the chance to say them.",
    description:
      "Write a private message. Choose your check-in period. If you stop checking in, we'll deliver it securely to the people you choose.",
    type: "website",
    url: baseUrl,
    siteName: "In Case",
  },
  twitter: {
    card: "summary_large_image",
    title: "In Case: For the things people should hear",
    description: "Write a message. Encrypt it. If you stop checking in, it delivers itself.",
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
