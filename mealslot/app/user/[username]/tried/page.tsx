import { prisma } from "@/lib/db";
import React from "react";

type Props = { params: { username: string } };

export default async function PublicTriedPage({ params }: Props) {
  const username = params.username;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="mt-2 text-sm text-neutral-600">No user with that username exists.</p>
      </div>
    );
  }

  const items = await prisma.triedMeal.findMany({ where: { userId: user.id }, orderBy: { dateTried: "desc" }, include: { dish: true } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{user.name}'s Tried Dishes</h1>
      <p className="mt-1 text-sm text-neutral-600">Public view — no login required</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.length === 0 ? (
          <div className="text-sm text-neutral-500">No tried dishes yet.</div>
        ) : items.map(it => (
          <div key={it.id} className="rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-md p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:border-[#303237] dark:bg-[#1c1e23]/90 dark:shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{it.dish?.name}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">{it.rating ? `★ ${it.rating}` : null}</div>
            </div>
            <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{new Date(it.dateTried).toLocaleString()}</div>
            <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{it.notes ?? <span className="opacity-60">No notes</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
