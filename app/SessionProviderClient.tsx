// app/SessionProviderClient.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}