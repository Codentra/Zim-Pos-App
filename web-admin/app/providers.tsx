"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = url ? new ConvexReactClient(url) : null;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-red-600">
          Missing NEXT_PUBLIC_CONVEX_URL. Add it in web-admin/.env.local and restart.
        </p>
      </div>
    );
  }
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
