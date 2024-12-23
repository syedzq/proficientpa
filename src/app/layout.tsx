import type { Metadata } from "next";
import { Crimson_Text, Geist } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: "ProficientPA",
  description: "Practice PANCE questions tailored to your study progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${crimsonText.variable} ${geist.variable}`}>
      <body className="font-geist">{children}</body>
    </html>
  );
}
