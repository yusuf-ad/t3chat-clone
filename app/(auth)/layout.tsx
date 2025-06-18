import "@/styles/globals.css";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div />}>{children}</Suspense>;
}
