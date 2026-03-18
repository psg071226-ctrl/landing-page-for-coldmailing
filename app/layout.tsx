import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Project Heimdall",
  description:
    "Project Heimdall helps architecture teams keep the reasoning behind every project change searchable, structured, and ready for AI."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
