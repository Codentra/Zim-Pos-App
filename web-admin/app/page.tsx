"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/api";

export default function DashboardPage() {
  const businesses = useQuery(api.admin.listBusinesses);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">ZimPos Admin</h1>
        <p className="text-zinc-600">Manage businesses and payment setup</p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-medium text-zinc-800">Businesses</h2>
        {businesses === undefined ? (
          <p className="text-zinc-500">Loading…</p>
        ) : businesses.length === 0 ? (
          <p className="text-zinc-500">No businesses yet. They will appear here after registration.</p>
        ) : (
          <ul className="space-y-3">
            {businesses.map((b: { id: string; name: string; ownerName: string; email: string; city: string }) => (
              <li
                key={b.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-900">{b.name}</div>
                    <div className="text-sm text-zinc-600">
                      {b.ownerName} · {b.email} · {b.city}
                    </div>
                  </div>
                  <Link
                    href={`/business/${b.id}/payment`}
                    className="rounded bg-zinc-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    Payment setup
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
