import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Last Message",
  description: "A dead man's switch for the words that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
