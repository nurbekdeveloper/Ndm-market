import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "NDM Market — Premium Construction Materials Catalog",
  description:
    "Discover premium construction materials with NDM Market: structural concrete, metal frameworks, professional mixes, and engineered solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="antialiased">
      <body className={`${manrope.variable} font-sans bg-surface text-base text-ink`}>{children}</body>
    </html>
  );
}
