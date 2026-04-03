import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Last Message — A Dead Man's Switch for the Words That Matter",
  description:
    "Write a message. Encrypt it. Set it free automatically if you stop checking in. Last Message is a privacy-first dead man's switch.",
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
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

