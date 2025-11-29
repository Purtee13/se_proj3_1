"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function TriedPreview() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user?.id) return;
      try {
        const r = await fetch(`/api/tried?userId=${user.id}`);
        if (!r.ok) return;
        const j = await r.json();
        if (!mounted) return;
        setItems(j.slice(0,3));
      } catch (e) {}
    }
    load();
    return ()=>{ mounted=false; };
  }, [user?.id]);

  if (!user) return <div className="text-xs text-neutral-500">Log in to see your tried dishes.</div>;

  return (
    <div>
      <div className="mb-2 text-sm font-semibold">Your tried</div>
      <div className="space-y-2">
        {items.length === 0 ? <div className="text-xs text-neutral-500">No tried dishes yet</div> : items.map(it => (
          <div key={it.id} className="rounded-md border bg-white p-2 text-sm dark:bg-neutral-900">{it.dish?.name ?? it.dishName}</div>
        ))}
      </div>
      <div className="mt-2 text-xs">
        <a className="text-sky-600" href={`/user/${encodeURIComponent(user.username)}/tried`}>View all</a>
      </div>
    </div>
  );
}
