import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import AuthCleanup from "@/components/auth-cleanup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | T3 Chat Clone",
    default: "T3 Chat Clone",
  },
  description: "A chat clone built with Next.js, Shadcn, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <body
          className={`bg-background selection:bg-sidebar-logo relative antialiased selection:text-white dark:selection:text-black`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthCleanup />
            <Toaster />
            <Suspense fallback={<div />}>{children}</Suspense>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
