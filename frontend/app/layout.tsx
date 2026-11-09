import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndicAcademic AI — Intelligent Academic Companion",
  description:
    "Study smarter with syllabus-aligned AI assistance for Indian university curricula, academic documents, exam preparation, and quizzes.",
  openGraph: {
    title: "IndicAcademic AI — Intelligent Academic Companion",
    description:
      "Study smarter with syllabus-aligned AI assistance for Indian university curricula, academic documents, exam preparation, and quizzes.",
    type: "website",
    locale: "en_IN",
    siteName: "IndicAcademic AI",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
