import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Last Message — A Dead Man's Switch for the Words That Matter",
  description:
    "Write a message. Encrypt it in your browser. If you stop checking in, it delivers itself. Zero-knowledge encryption. No accounts. No logins. Open source.",
  keywords: [
    "dead man's switch",
    "encrypted message",
    "zero-knowledge encryption",
    "digital legacy",
    "automated message delivery",
    "privacy-first",
    "open source",
    "AES-256-GCM",
    "client-side encryption",
    "send message after death",
    "dead man's switch app",
  ],
  openGraph: {
    title: "Last Message — A Dead Man's Switch for the Words That Matter",
    description:
      "Write a message. Encrypt it. If you stop checking in for 14 days, it delivers itself. Zero-knowledge. No accounts. Open source.",
    type: "website",
    url: baseUrl,
    siteName: "Last Message",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Last Message — Encrypted Dead Man's Switch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Last Message — A Dead Man's Switch for the Words That Matter",
    description:
      "Write a message. Encrypt it. If you stop checking in, it delivers itself. Zero-knowledge encryption. No accounts.",
    images: [`${baseUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Last Message",
  description:
    "A dead man's switch for encrypted text messages. Zero-knowledge encryption, no accounts, open source.",
  url: baseUrl,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

